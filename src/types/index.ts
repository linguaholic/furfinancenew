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
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  petId: string;
  categoryId: string;
  amount: number;
  currency: Currency;
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
  currency: Currency;
  period: 'monthly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'SEK' | 'NOK' | 'DKK';

export interface AppSettings {
  defaultCurrency: Currency;
  availableCurrencies: Currency[];
  createdAt: string;
  updatedAt: string;
}

export const AVAILABLE_CURRENCIES: Currency[] = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'
];

export interface AppData {
  pets: Pet[];
  expenses: Expense[];
  categories: ExpenseCategory[];
  budgets: Budget[];
  settings: AppSettings;
}

export const DEFAULT_CATEGORIES: Omit<ExpenseCategory, 'id'>[] = [
  { name: 'Food & Treats', color: '#10b981', icon: 'utensils', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Veterinary Care', color: '#ef4444', icon: 'heart-pulse', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Grooming', color: '#8b5cf6', icon: 'scissors', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Toys & Entertainment', color: '#f59e0b', icon: 'gamepad-2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Supplies & Equipment', color: '#06b6d4', icon: 'package', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Training', color: '#84cc16', icon: 'graduation-cap', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Insurance', color: '#6366f1', icon: 'shield', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Other', color: '#6b7280', icon: 'more-horizontal', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]; 