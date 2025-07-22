import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pet, Expense, ExpenseCategory, Budget, AppData, DEFAULT_CATEGORIES, AVAILABLE_CURRENCIES, AppSettings } from '@/types';

interface FurFinanceStore {
  // Data
  pets: Pet[];
  expenses: Expense[];
  categories: ExpenseCategory[];
  budgets: Budget[];
  settings: AppSettings;

  // Actions
  addPet: (pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  deletePet: (id: string) => void;

  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  addCategory: (category: Omit<ExpenseCategory, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<ExpenseCategory>) => void;
  deleteCategory: (id: string) => void;

  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  updateSettings: (settings: Partial<AppSettings>) => void;

  // Computed values
  getPetExpenses: (petId: string) => Expense[];
  getCategoryExpenses: (categoryId: string) => Expense[];
  getTotalExpenses: (petId?: string, startDate?: string, endDate?: string) => number;
  getMonthlyExpenses: (petId?: string, year?: number, month?: number) => number;
  getPetBudgets: (petId: string) => Budget[];
  getCategoryBudgets: (categoryId: string) => Budget[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);
const getCurrentTimestamp = () => new Date().toISOString();

export const useFurFinanceStore = create<FurFinanceStore>()(
  persist(
    (set, get) => ({
      pets: [],
      expenses: [],
      categories: DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        id: generateId(),
      })),
      budgets: [],
      settings: {
        defaultCurrency: 'USD',
        availableCurrencies: AVAILABLE_CURRENCIES,
      },
      
      // Pet actions
      addPet: (petData) => {
        const newPet: Pet = {
          ...petData,
          id: generateId(),
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        };
        set((state) => ({ pets: [...state.pets, newPet] }));
      },
      
      updatePet: (id, updates) => {
        set((state) => ({
          pets: state.pets.map((pet) =>
            pet.id === id
              ? { ...pet, ...updates, updatedAt: getCurrentTimestamp() }
              : pet
          ),
        }));
      },
      
      deletePet: (id) => {
        set((state) => ({
          pets: state.pets.filter((pet) => pet.id !== id),
          expenses: state.expenses.filter((expense) => expense.petId !== id),
          budgets: state.budgets.filter((budget) => budget.petId !== id),
        }));
      },
      
      // Expense actions
      addExpense: (expenseData) => {
        const newExpense: Expense = {
          ...expenseData,
          id: generateId(),
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        };
        set((state) => ({ expenses: [...state.expenses, newExpense] }));
      },
      
      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id
              ? { ...expense, ...updates, updatedAt: getCurrentTimestamp() }
              : expense
          ),
        }));
      },
      
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },
      
      // Category actions
      addCategory: (categoryData) => {
        const newCategory: ExpenseCategory = {
          ...categoryData,
          id: generateId(),
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },
      
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updates } : category
          ),
        }));
      },
      
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          expenses: state.expenses.filter((expense) => expense.categoryId !== id),
          budgets: state.budgets.filter((budget) => budget.categoryId !== id),
        }));
      },
      
      // Budget actions
      addBudget: (budgetData) => {
        const newBudget: Budget = {
          ...budgetData,
          id: generateId(),
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        };
        set((state) => ({ budgets: [...state.budgets, newBudget] }));
      },
      
      updateBudget: (id, updates) => {
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.id === id
              ? { ...budget, ...updates, updatedAt: getCurrentTimestamp() }
              : budget
          ),
        }));
      },
      
                        deleteBudget: (id) => {
                    set((state) => ({
                      budgets: state.budgets.filter((budget) => budget.id !== id),
                    }));
                  },

                  // Settings actions
                  updateSettings: (newSettings) => {
                    set((state) => ({
                      settings: { ...state.settings, ...newSettings },
                    }));
                  },
      
      // Computed values
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
    }),
    {
      name: 'fur-finance-storage',
                        partialize: (state) => ({
                    pets: state.pets,
                    expenses: state.expenses,
                    categories: state.categories,
                    budgets: state.budgets,
                    settings: state.settings,
                  }),
    }
  )
); 