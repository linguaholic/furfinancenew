import { supabase } from './supabase'
import { Pet, Expense, Budget, ExpenseCategory, AppSettings } from '@/types'

// Utility functions to convert between camelCase and snake_case
const toSnakeCase = (obj: Record<string, unknown> | null | undefined): Record<string, unknown> | null | undefined => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(toSnakeCase) as Record<string, unknown>
  
  const snakeCaseObj: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    snakeCaseObj[snakeKey] = toSnakeCase(value as Record<string, unknown>)
  }
  return snakeCaseObj
}

const toCamelCase = (obj: Record<string, unknown> | null | undefined): Record<string, unknown> | null | undefined => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(toCamelCase) as Record<string, unknown>
  
  const camelCaseObj: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    camelCaseObj[camelKey] = toCamelCase(value as Record<string, unknown>)
  }
  return camelCaseObj
}

// Test function to check Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    
    // Test 1: Check if we can connect
    const { data: testData, error: testError } = await supabase
      .from('pets')
      .select('count')
      .limit(1)
    
    console.log('Connection test result:', { testData, testError })
    
    // Test 2: Check auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('Auth status:', { user: user?.id, authError })
    
    return { success: !testError && !authError, testError, authError }
  } catch (error) {
    console.error('Connection test failed:', error)
    return { success: false, error }
  }
}

// Helper to get current user ID (anonymous or authenticated)
const getCurrentUserId = async () => {
  try {
    const { data: { user }, error: getUserError } = await supabase.auth.getUser()
    
    if (getUserError) {
      console.error('Error getting user:', getUserError)
    }
    
    if (!user) {
      console.log('No user found, creating anonymous session...')
      const { data: { user: anonymousUser }, error: signInError } = await supabase.auth.signInAnonymously()
      
      if (signInError) {
        console.error('Error signing in anonymously:', signInError)
        throw signInError
      }
      
      if (!anonymousUser?.id) {
        console.error('Anonymous user created but no ID returned')
        throw new Error('Failed to create anonymous user')
      }
      
      console.log('Anonymous user created with ID:', anonymousUser.id)
      return anonymousUser.id
    }
    
    console.log('Using existing user with ID:', user.id)
    return user.id
  } catch (error) {
    console.error('Error in getCurrentUserId:', error)
    throw error
  }
}

// Pets
export const petsService = {
  async getAll(): Promise<Pet[]> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    // Convert snake_case to camelCase for frontend
    return (data || []).map(toCamelCase)
  },

  async getById(id: string): Promise<Pet | null> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    // Convert snake_case to camelCase for frontend
    return data ? toCamelCase(data) : null
  },

  async create(pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> {
    try {
      const userId = await getCurrentUserId()
      console.log('Creating pet with user ID:', userId)
      console.log('Pet data:', pet)
      
      // Convert camelCase to snake_case for database
      const snakeCasePet = toSnakeCase(pet)
      console.log('Snake case pet data:', snakeCasePet)
      
      const { data, error } = await supabase
        .from('pets')
        .insert([{ ...snakeCasePet, user_id: userId }])
        .select()
        .single()

      if (error) {
        console.error('Supabase error creating pet:', error)
        throw error
      }
      
      console.log('Pet created successfully:', data)
      // Convert snake_case back to camelCase for frontend
      return toCamelCase(data)
    } catch (error) {
      console.error('Error in petsService.create:', error)
      throw error
    }
  },

  async update(id: string, pet: Partial<Pet>): Promise<Pet> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('pets')
      .update(pet)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const userId = await getCurrentUserId()
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
  }
}

// Expenses
export const expensesService = {
  async getAll(): Promise<Expense[]> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        pet:pets(name),
        category:expense_categories(name, color, icon)
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Expense | null> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        pet:pets(name),
        category:expense_categories(name, color, icon)
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  },

  async create(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...expense, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, expense: Partial<Expense>): Promise<Expense> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const userId = await getCurrentUserId()
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
  }
}

// Categories
export const categoriesService = {
  async getAll(): Promise<ExpenseCategory[]> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<ExpenseCategory | null> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  },

  async create(category: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExpenseCategory> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('expense_categories')
      .insert([{ ...category, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, category: Partial<ExpenseCategory>): Promise<ExpenseCategory> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('expense_categories')
      .update(category)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const userId = await getCurrentUserId()
    const { error } = await supabase
      .from('expense_categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
  }
}

// Budgets
export const budgetsService = {
  async getAll(): Promise<Budget[]> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        pet:pets(name),
        category:expense_categories(name, color, icon)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Budget | null> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        pet:pets(name),
        category:expense_categories(name, color, icon)
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  },

  async create(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('budgets')
      .insert([{ ...budget, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, budget: Partial<Budget>): Promise<Budget> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('budgets')
      .update(budget)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const userId = await getCurrentUserId()
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
  }
}

// Settings
export const settingsService = {
  async get(): Promise<AppSettings | null> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return data
  },

  async create(settings: Omit<AppSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppSettings> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('app_settings')
      .insert([{ ...settings, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(settings: Partial<AppSettings>): Promise<AppSettings> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('app_settings')
      .update(settings)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getOrCreate(): Promise<AppSettings> {
    let settings = await this.get()
    if (!settings) {
      settings = await this.create({
        defaultCurrency: 'USD',
        availableCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK']
      })
    }
    return settings
  }
}

// File upload for pet photos
export const fileService = {
  async uploadPetPhoto(file: File, petId: string): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${petId}-${Date.now()}.${fileExt}`
    
    const { error } = await supabase.storage
      .from('pet-photos')
      .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('pet-photos')
      .getPublicUrl(fileName)

    return publicUrl
  },

  async deletePetPhoto(url: string): Promise<void> {
    const fileName = url.split('/').pop()
    if (!fileName) return

    const { error } = await supabase.storage
      .from('pet-photos')
      .remove([fileName])

    if (error) throw error
  }
} 