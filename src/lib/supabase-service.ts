import { supabase } from './supabase'
import { Pet, Expense, Budget, ExpenseCategory, AppSettings, Currency } from '@/types'

// Helper to get current user ID (anonymous or authenticated)
const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    // Create anonymous session if no user exists
    const { data: { user: anonymousUser } } = await supabase.auth.signInAnonymously()
    return anonymousUser?.id
  }
  return user.id
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
    return data || []
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
    return data
  },

  async create(pet: Omit<Pet, 'id' | 'created_at' | 'updated_at'>): Promise<Pet> {
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('pets')
      .insert([{ ...pet, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
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

  async create(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> {
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

  async create(category: Omit<ExpenseCategory, 'id' | 'created_at' | 'updated_at'>): Promise<ExpenseCategory> {
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

  async create(budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>): Promise<Budget> {
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

  async create(settings: Omit<AppSettings, 'id' | 'created_at' | 'updated_at'>): Promise<AppSettings> {
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
        defaultCurrency: 'USD' as Currency,
        availableCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'] as Currency[]
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
    
    const { data, error } = await supabase.storage
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