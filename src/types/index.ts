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
  buildingBlockId: string;
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
  // Current default categories (marked as default)
  { name: 'Food & Treats', color: '#10b981', icon: 'utensils', description: 'Pet food, treats, and supplements', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Veterinary Care', color: '#ef4444', icon: 'heart-pulse', description: 'Vet visits, medications, and medical procedures', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Grooming', color: '#8b5cf6', icon: 'scissors', description: 'Grooming services and supplies', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Toys & Entertainment', color: '#f59e0b', icon: 'gamepad-2', description: 'Toys, games, and entertainment items', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Supplies & Equipment', color: '#06b6d4', icon: 'package', description: 'Beds, crates, leashes, and other equipment', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Training', color: '#84cc16', icon: 'graduation-cap', description: 'Training classes, books, and tools', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Insurance', color: '#6366f1', icon: 'shield', description: 'Pet insurance premiums', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Other', color: '#6b7280', icon: 'more-horizontal', description: 'Miscellaneous expenses', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // Additional building blocks
  { name: 'Boarding & Pet Sitting', color: '#f97316', icon: 'home', description: 'Pet boarding, daycare, and pet sitting services', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Dental Care', color: '#ec4899', icon: 'tooth', description: 'Dental cleanings, treatments, and supplies', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Emergency Care', color: '#dc2626', icon: 'alert-triangle', description: 'Emergency vet visits and urgent care', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Medication & Supplements', color: '#7c3aed', icon: 'pill', description: 'Prescription medications and supplements', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Housing & Rent', color: '#059669', icon: 'building', description: 'Pet deposits, pet rent, and housing fees', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Transportation', color: '#0891b2', icon: 'car', description: 'Pet carriers, car seats, and travel expenses', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Licensing & Registration', color: '#1d4ed8', icon: 'file-text', description: 'Pet licenses, microchipping, and registration', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Behavioral Therapy', color: '#be185d', icon: 'brain', description: 'Behavioral consultations and therapy sessions', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Alternative Medicine', color: '#65a30d', icon: 'leaf', description: 'Acupuncture, chiropractic, and holistic treatments', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Breeding & Reproduction', color: '#ea580c', icon: 'heart', description: 'Breeding fees, pregnancy care, and related expenses', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Show & Competition', color: '#c026d3', icon: 'trophy', description: 'Show entry fees, travel, and competition expenses', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Photography', color: '#0d9488', icon: 'camera', description: 'Professional pet photos and portraits', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Clothing & Accessories', color: '#f59e0b', icon: 'shirt', description: 'Clothing, collars, harnesses, and accessories', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Technology', color: '#6366f1', icon: 'smartphone', description: 'GPS trackers, automatic feeders, and pet tech', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: 'Pet Memorial', color: '#6b7280', icon: 'flower', description: 'End-of-life care, cremation, and memorial services', isDefault: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]; 