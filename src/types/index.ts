export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'fish' | 'reptile' | 'small_animal' | 'other';
  breed?: string;
  birthDate?: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Expense {
  id: string;
  petId: string;
  categoryId: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  receipt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  petId: string;
  categoryId: string;
  amount: number;
  currency: string;
  period: 'monthly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  defaultCurrency: string;
  availableCurrencies: Currency[];
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const AVAILABLE_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
];

export interface AppData {
  pets: Pet[];
  expenses: Expense[];
  categories: ExpenseCategory[];
  budgets: Budget[];
  settings: AppSettings;
}

export const DEFAULT_CATEGORIES: Omit<ExpenseCategory, 'id'>[] = [
  { name: 'Food & Treats', color: '#10b981', icon: 'utensils' },
  { name: 'Veterinary Care', color: '#ef4444', icon: 'heart-pulse' },
  { name: 'Grooming', color: '#8b5cf6', icon: 'scissors' },
  { name: 'Toys & Entertainment', color: '#f59e0b', icon: 'gamepad-2' },
  { name: 'Supplies & Equipment', color: '#06b6d4', icon: 'package' },
  { name: 'Training', color: '#84cc16', icon: 'graduation-cap' },
  { name: 'Insurance', color: '#6366f1', icon: 'shield' },
  { name: 'Other', color: '#6b7280', icon: 'more-horizontal' },
]; 