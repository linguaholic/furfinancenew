import { supabase } from './supabase'
import { Pet, Expense, Budget, ExpenseCategory, AppSettings, UserCategoryPreference } from '@/types'

// Utility functions to convert between camelCase and snake_case
const toSnakeCase = (obj: unknown): unknown => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(toSnakeCase)
  
  const snakeCaseObj: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    // Handle specific field mappings
    let snakeKey: string
    switch (key) {
      case 'birthDate':
        snakeKey = 'birth_date'
        break
      case 'photo':
        snakeKey = 'photo_url'
        break
      case 'petId':
        snakeKey = 'pet_id'
        break
      case 'categoryId':
        snakeKey = 'category_id'
        break
      case 'startDate':
        snakeKey = 'start_date'
        break
      case 'endDate':
        snakeKey = 'end_date'
        break
      case 'recurringType':
        snakeKey = 'recurring_type'
        break
      case 'nextDueDate':
        snakeKey = 'next_due_date'
        break
      case 'defaultCurrency':
        snakeKey = 'default_currency'
        break
      case 'availableCurrencies':
        snakeKey = 'available_currencies'
        break
      case 'createdAt':
        snakeKey = 'created_at'
        break
      case 'updatedAt':
        snakeKey = 'updated_at'
        break
      default:
        snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    }
    snakeCaseObj[snakeKey] = toSnakeCase(value)
  }
  return snakeCaseObj
}

const toCamelCase = (obj: unknown): unknown => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(toCamelCase)
  
  const camelCaseObj: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    // Handle specific field mappings
    let camelKey: string
    switch (key) {
      case 'birth_date':
        camelKey = 'birthDate'
        break
      case 'photo_url':
        camelKey = 'photo'
        break
      case 'pet_id':
        camelKey = 'petId'
        break
      case 'category_id':
        camelKey = 'categoryId'
        break
      case 'start_date':
        camelKey = 'startDate'
        break
      case 'end_date':
        camelKey = 'endDate'
        break
      case 'recurring_type':
        camelKey = 'recurringType'
        break
      case 'next_due_date':
        camelKey = 'nextDueDate'
        break
      case 'default_currency':
        camelKey = 'defaultCurrency'
        break
      case 'available_currencies':
        camelKey = 'availableCurrencies'
        break
      case 'created_at':
        camelKey = 'createdAt'
        break
      case 'updated_at':
        camelKey = 'updatedAt'
        break
      default:
        camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    }
    camelCaseObj[camelKey] = toCamelCase(value)
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
    return (data || []).map(toCamelCase) as Pet[]
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
    return data ? toCamelCase(data) as Pet : null
  },

  async create(pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> {
    try {
      const userId = await getCurrentUserId()
      console.log('Creating pet with user ID:', userId)
      console.log('Pet data:', pet)
      
      // Convert camelCase to snake_case for database
      const snakeCasePet = toSnakeCase(pet) as Record<string, unknown>
      console.log('Snake case pet data:', snakeCasePet)
      
      // Clean up the data - remove empty strings and null values for optional fields
      const cleanedData = { ...snakeCasePet }
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === '' || cleanedData[key] === null || cleanedData[key] === undefined) {
          delete cleanedData[key]
        }
      })
      
      const insertData = { ...cleanedData, user_id: userId }
      console.log('Final insert data:', insertData)
      
      const { data, error } = await supabase
        .from('pets')
        .insert([insertData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error creating pet:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }
      
      console.log('Pet created successfully:', data)
      // Convert snake_case back to camelCase for frontend
      return toCamelCase(data) as Pet
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
    return toCamelCase(data) as Pet
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
    return (data || []).map(toCamelCase) as Expense[]
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
    return data ? toCamelCase(data) as Expense : null
  },

  async create(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const userId = await getCurrentUserId()
    const snakeCaseExpense = toSnakeCase(expense) as Record<string, unknown>
    
    console.log('Creating expense with data:', { ...snakeCaseExpense, user_id: userId })
    console.log('Original expense data:', expense)
    
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...snakeCaseExpense, user_id: userId }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }
    return toCamelCase(data) as Expense
  },

  async update(id: string, expense: Partial<Expense>): Promise<Expense> {
    const userId = await getCurrentUserId()
    const snakeCaseExpense = toSnakeCase(expense) as Record<string, unknown>
    const { data, error } = await supabase
      .from('expenses')
      .update(snakeCaseExpense)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return toCamelCase(data) as Expense
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
    // Get all categories (both system and user-specific)
    console.log('CategoriesService: Fetching all categories from database...');
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('CategoriesService: Error fetching categories:', error);
      throw error;
    }
    
    console.log('CategoriesService: Raw data from database:', data);
    console.log('CategoriesService: Number of categories found:', data?.length || 0);
    
    const categories = (data || []).map(toCamelCase) as ExpenseCategory[];
    console.log('CategoriesService: Processed categories:', categories.map(c => ({ id: c.id, name: c.name, userId: c.userId })));
    
    return categories;
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
    return data ? toCamelCase(data) as ExpenseCategory : null
  },

  async create(category: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExpenseCategory> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('expense_categories')
      .insert([{ ...category, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return toCamelCase(data) as ExpenseCategory
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
    return toCamelCase(data) as ExpenseCategory
  },

  async delete(id: string): Promise<void> {
    const userId = await getCurrentUserId()
    const { error } = await supabase
      .from('expense_categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
  },
}

// User Category Preferences
export const userCategoryPreferencesService = {
  async getAll(): Promise<UserCategoryPreference[]> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('user_category_preferences')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return (data || []).map(toCamelCase) as UserCategoryPreference[]
  },

  async updatePreferences(preferences: UserCategoryPreference[]): Promise<void> {
    const userId = await getCurrentUserId()
    
    // Delete existing preferences
    const { error: deleteError } = await supabase
      .from('user_category_preferences')
      .delete()
      .eq('user_id', userId)

    if (deleteError) throw deleteError

    // Insert new preferences
    if (preferences.length > 0) {
      const { error: insertError } = await supabase
        .from('user_category_preferences')
        .insert(preferences.map(pref => ({ ...pref, user_id: userId })))

      if (insertError) throw insertError
    }
  },

  async getOrCreateDefault(): Promise<ExpenseCategory[]> {
    const userId = await getCurrentUserId()
    console.log('Loading categories for user:', userId)
    
    // First, try to get existing categories
    const { data: existingCategories, error: getError } = await supabase
      .from('expense_categories')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (getError) {
      console.error('Error getting categories:', getError)
      throw getError
    }

    console.log('Existing categories found:', existingCategories?.length || 0)

    // If categories exist, return them
    if (existingCategories && existingCategories.length > 0) {
      return existingCategories.map(toCamelCase) as ExpenseCategory[]
    }

    console.log('No categories found, creating defaults...')

    // If no categories exist, create default ones
    const defaultCategories = [
      { name: 'Food & Treats', color: '#10b981', icon: '🍖' },
      { name: 'Veterinary Care', color: '#ef4444', icon: '🏥' },
      { name: 'Grooming', color: '#8b5cf6', icon: '✂️' },
      { name: 'Toys & Entertainment', color: '#f59e0b', icon: '🎾' },
      { name: 'Supplies & Equipment', color: '#06b6d4', icon: '📦' },
      { name: 'Training', color: '#84cc16', icon: '🎓' },
      { name: 'Insurance', color: '#6366f1', icon: '🛡️' },
      { name: 'Other', color: '#6b7280', icon: '📝' },
    ]

    const categoriesToInsert = defaultCategories.map(category => ({
      ...category,
      user_id: userId
    }))

    console.log('Inserting default categories:', categoriesToInsert)

    const { data: newCategories, error: createError } = await supabase
      .from('expense_categories')
      .insert(categoriesToInsert)
      .select()

    if (createError) {
      console.error('Error creating default categories:', createError)
      throw createError
    }

    console.log('Default categories created successfully:', newCategories?.length || 0)
    return (newCategories || []).map(toCamelCase) as ExpenseCategory[]
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
    return (data || []).map(toCamelCase) as Budget[]
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
    return data ? toCamelCase(data) as Budget : null
  },

  async create(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
    const userId = await getCurrentUserId()
    const snakeCaseBudget = toSnakeCase(budget) as Record<string, unknown>
    
    console.log('Creating budget with data:', { ...snakeCaseBudget, user_id: userId })
    
    const { data, error } = await supabase
      .from('budgets')
      .insert([{ ...snakeCaseBudget, user_id: userId }])
      .select()
      .single()

    if (error) {
      console.error('Supabase budget error:', error)
      throw error
    }
    return toCamelCase(data) as Budget
  },

  async update(id: string, budget: Partial<Budget>): Promise<Budget> {
    const userId = await getCurrentUserId()
    const snakeCaseBudget = toSnakeCase(budget) as Record<string, unknown>
    const { data, error } = await supabase
      .from('budgets')
      .update(snakeCaseBudget)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return toCamelCase(data) as Budget
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
      .maybeSingle()

    if (error) throw error
    return data ? toCamelCase(data) as AppSettings : null
  },

  async create(settings: Omit<AppSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppSettings> {
    const userId = await getCurrentUserId()
    const snakeCaseSettings = toSnakeCase(settings) as Record<string, unknown>
    const { data, error } = await supabase
      .from('app_settings')
      .insert([{ ...snakeCaseSettings, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return toCamelCase(data) as AppSettings
  },

  async update(settings: Partial<AppSettings>): Promise<AppSettings> {
    const userId = await getCurrentUserId()
    const snakeCaseSettings = toSnakeCase(settings) as Record<string, unknown>
    const { data, error } = await supabase
      .from('app_settings')
      .update(snakeCaseSettings)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return toCamelCase(data) as AppSettings
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