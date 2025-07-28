export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'fish' | 'reptile' | 'chicken' | 'other';
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

export interface CategoryBuildingBlock {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserCategoryPreference {
  id: string;
  userId: string;
  categoryId: string;
  isEnabled: boolean;
  customName?: string;
  customColor?: string;
  customIcon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  petId: string;
  categoryId: string;
  amount: number;
  currency: Currency;
  description?: string;
  date: string;
  receipt?: string;
  recurringType: 'none' | 'monthly' | 'quarterly' | 'yearly';
  nextDueDate?: string;
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
  startDate: string;
  endDate?: string;
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

export const CATEGORY_BUILDING_BLOCKS: Omit<CategoryBuildingBlock, 'id'>[] = [
  // Current default categories (marked as default) - MUST MATCH DATABASE EXACTLY
  { name: 'Food & Treats', color: '#10b981', icon: 'utensils', description: 'Pet food, treats, and supplements', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Veterinary Care', color: '#ef4444', icon: 'stethoscope', description: 'Vet visits, medications, and medical procedures', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Grooming & Hygiene', color: '#3b82f6', icon: 'scissors', description: 'Grooming services and supplies', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Toys & Entertainment', color: '#8b5cf6', icon: 'gamepad-2', description: 'Toys, games, and entertainment items', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Training & Classes', color: '#f59e0b', icon: 'graduation-cap', description: 'Training classes, books, and tools', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Insurance', color: '#06b6d4', icon: 'shield', description: 'Pet insurance premiums', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Transportation', color: '#84cc16', icon: 'car', description: 'Pet carriers, car seats, and travel expenses', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Medication & Supplements', color: '#ec4899', icon: 'pill', description: 'Prescription medications and supplements', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // Additional building blocks - MUST MATCH DATABASE EXACTLY
  { name: 'Boarding & Pet Sitting', color: '#f97316', icon: 'home', description: 'Pet boarding, daycare, and pet sitting services', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Supplies', color: '#6366f1', icon: 'shopping-bag', description: 'Beds, crates, leashes, and other equipment', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Emergency Care', color: '#dc2626', icon: 'alert-triangle', description: 'Emergency vet visits and urgent care', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Breeding & Mating', color: '#7c3aed', icon: 'heart', description: 'Breeding fees, pregnancy care, and related expenses', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Show & Competition', color: '#059669', icon: 'trophy', description: 'Show entry fees, travel, and competition expenses', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Photography', color: '#0ea5e9', icon: 'camera', description: 'Professional pet photos and portraits', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Memorial', color: '#6b7280', icon: 'flower', description: 'End-of-life care, cremation, and memorial services', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Taxi Services', color: '#fbbf24', icon: 'taxi', description: 'Pet transportation services', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Insurance Claims', color: '#34d399', icon: 'file-text', description: 'Pet insurance claim processing', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Therapy Services', color: '#a78bfa', icon: 'heart-handshake', description: 'Pet therapy and emotional support services', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Adoption Fees', color: '#fb7185', icon: 'users', description: 'Pet adoption fees and related costs', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Microchipping', color: '#60a5fa', icon: 'radio', description: 'Pet microchipping services', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet License & Registration', color: '#f472b6', icon: 'id-card', description: 'Pet licenses, registration, and legal requirements', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Cremation Services', color: '#9ca3af', icon: 'flame', description: 'Pet cremation and memorial services', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Behaviorist', color: '#10b981', icon: 'brain', description: 'Pet behaviorist consultations and therapy', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]; 