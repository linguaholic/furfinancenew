import { create } from 'zustand';
import { Pet, Expense, ExpenseCategory, Budget, AppSettings } from '@/types';
import { petsService, expensesService, categoriesService, budgetsService, settingsService } from '@/lib/supabase-service';

interface FurFinanceStore {
  // Data
  pets: Pet[];
  expenses: Expense[];
  categories: ExpenseCategory[];
  budgets: Budget[];
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  
  // Pet actions
  addPet: (pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePet: (id: string, updates: Partial<Pet>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  loadPets: () => Promise<void>;

  // Expense actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  loadExpenses: () => Promise<void>;

  // Category actions
  addCategory: (category: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ExpenseCategory>;
  updateCategory: (id: string, updates: Partial<ExpenseCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  loadCategories: () => Promise<void>;

  // Budget actions
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  loadBudgets: () => Promise<void>;

  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  loadSettings: () => Promise<void>;

  // Computed values
  getPetExpenses: (petId: string) => Expense[];
  getCategoryExpenses: (categoryId: string) => Expense[];
  getTotalExpenses: (petId?: string, startDate?: string, endDate?: string) => number;
  getMonthlyExpenses: (petId?: string, year?: number, month?: number) => number;
  getPetBudgets: (petId: string) => Budget[];
  getCategoryBudgets: (categoryId: string) => Budget[];
}

export const useFurFinanceStore = create<FurFinanceStore>((set, get) => ({
  pets: [],
  expenses: [],
  categories: [],
  budgets: [],
  settings: {
    defaultCurrency: 'USD',
    availableCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  isLoading: false,
  error: null,

  // Initialize store
  initialize: async () => {
    console.log('Store: Initializing...');
    set({ isLoading: true, error: null });
    try {
      // Load critical data first (settings and categories needed for forms)
      await Promise.all([
        get().loadSettings(),
        get().loadCategories(),
      ]);
      console.log('Store: Critical data loaded');
      
      // Load secondary data in parallel (pets, expenses, budgets)
      Promise.all([
        get().loadPets(),
        get().loadExpenses(),
        get().loadBudgets(),
      ]).then(() => {
        console.log('Store: Secondary data loaded');
      }).catch((error) => {
        console.error('Store: Secondary data failed:', error);
      });
      
      console.log('Store: Initialization complete');
    } catch (error) {
      console.error('Store: Initialization failed:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to initialize' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Pet actions
  loadPets: async () => {
    try {
      const pets = await petsService.getAll();
      set({ pets });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load pets' });
    }
  },

  addPet: async (petData) => {
    set({ isLoading: true, error: null });
    try {
      const newPet = await petsService.create(petData);
      set((state) => ({ pets: [...state.pets, newPet] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add pet' });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePet: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPet = await petsService.update(id, updates);
      set((state) => ({
        pets: state.pets.map((pet) => (pet.id === id ? updatedPet : pet)),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update pet' });
    } finally {
      set({ isLoading: false });
    }
  },

  deletePet: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await petsService.delete(id);
      set((state) => ({
        pets: state.pets.filter((pet) => pet.id !== id),
        expenses: state.expenses.filter((expense) => expense.petId !== id),
        budgets: state.budgets.filter((budget) => budget.petId !== id),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete pet' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Expense actions
  loadExpenses: async () => {
    try {
      const expenses = await expensesService.getAll();
      set({ expenses });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load expenses' });
    }
  },

  addExpense: async (expenseData) => {
    set({ isLoading: true, error: null });
    try {
      const newExpense = await expensesService.create(expenseData);
      set((state) => ({ expenses: [...state.expenses, newExpense] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add expense' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateExpense: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedExpense = await expensesService.update(id, updates);
      set((state) => ({
        expenses: state.expenses.map((expense) => (expense.id === id ? updatedExpense : expense)),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update expense' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await expensesService.delete(id);
      set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== id),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete expense' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Category actions
  loadCategories: async () => {
    try {
      console.log('Store: Loading categories...');
      const startTime = Date.now();
      const categories = await categoriesService.getOrCreateDefault();
      const endTime = Date.now();
      console.log(`Store: Categories loaded: ${categories.length} (${endTime - startTime}ms)`);
      set({ categories });
    } catch (error) {
      console.error('Store: Failed to load categories:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load categories' });
    }
  },

  addCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const newCategory = await categoriesService.create(categoryData);
      set((state) => ({ categories: [...state.categories, newCategory] }));
      return newCategory; // Return the new category
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add category' });
      throw error; // Re-throw to handle in the component
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCategory = await categoriesService.update(id, updates);
      set((state) => ({
        categories: state.categories.map((category) => (category.id === id ? updatedCategory : category)),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update category' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await categoriesService.delete(id);
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        expenses: state.expenses.filter((expense) => expense.categoryId !== id),
        budgets: state.budgets.filter((budget) => budget.categoryId !== id),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete category' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Budget actions
  loadBudgets: async () => {
    try {
      const budgets = await budgetsService.getAll();
      set({ budgets });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load budgets' });
    }
  },

  addBudget: async (budgetData) => {
    set({ isLoading: true, error: null });
    try {
      const newBudget = await budgetsService.create(budgetData);
      set((state) => ({ budgets: [...state.budgets, newBudget] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add budget' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateBudget: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedBudget = await budgetsService.update(id, updates);
      set((state) => ({
        budgets: state.budgets.map((budget) => (budget.id === id ? updatedBudget : budget)),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update budget' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteBudget: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await budgetsService.delete(id);
      set((state) => ({
        budgets: state.budgets.filter((budget) => budget.id !== id),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete budget' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Settings actions
  loadSettings: async () => {
    try {
      console.log('Store: Loading settings...');
      const startTime = Date.now();
      const settings = await settingsService.getOrCreate();
      const endTime = Date.now();
      console.log(`Store: Settings loaded (${endTime - startTime}ms)`);
      set({ settings });
    } catch (error) {
      console.error('Store: Failed to load settings:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load settings' });
    }
  },

  updateSettings: async (newSettings) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSettings = await settingsService.update(newSettings);
      set({ settings: updatedSettings });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update settings' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Computed values (same as before)
  getPetExpenses: (petId) => {
    return get().expenses.filter((expense) => expense.petId === petId);
  },

  getCategoryExpenses: (categoryId) => {
    return get().expenses.filter((expense) => expense.categoryId === categoryId);
  },

  getTotalExpenses: (petId, startDate, endDate) => {
    let expenses = get().expenses;

    if (petId) {
      expenses = expenses.filter((expense) => expense.petId === petId);
    }

    if (startDate) {
      expenses = expenses.filter((expense) => expense.date >= startDate);
    }

    if (endDate) {
      expenses = expenses.filter((expense) => expense.date <= endDate);
    }

    return expenses.reduce((total, expense) => total + expense.amount, 0);
  },

  getMonthlyExpenses: (petId, year = new Date().getFullYear(), month = new Date().getMonth() + 1) => {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
    return get().getTotalExpenses(petId, startDate, endDate);
  },

  getPetBudgets: (petId) => {
    return get().budgets.filter((budget) => budget.petId === petId);
  },

  getCategoryBudgets: (categoryId) => {
    return get().budgets.filter((budget) => budget.categoryId === categoryId);
  },
})); 