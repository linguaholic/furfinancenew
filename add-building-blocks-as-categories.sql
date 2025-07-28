-- Migration: Add all building blocks as categories
-- This ensures all predefined categories exist in the database

-- Insert all building blocks as categories
-- Note: We'll use NULL for user_id since these are system-wide categories
-- In the future, we can add a 'is_system_category' boolean field if needed

INSERT INTO expense_categories (id, user_id, name, color, icon, created_at, updated_at) VALUES
-- Default categories (isDefault: true)
(gen_random_uuid(), NULL, 'Food & Treats', '#10b981', 'utensils', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Veterinary Care', '#ef4444', 'heart-pulse', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Grooming', '#8b5cf6', 'scissors', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Toys & Entertainment', '#f59e0b', 'gamepad-2', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Supplies & Equipment', '#06b6d4', 'package', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Training', '#84cc16', 'graduation-cap', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Insurance', '#6366f1', 'shield', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Other', '#6b7280', 'more-horizontal', NOW(), NOW()),

-- Additional building blocks (isDefault: false)
(gen_random_uuid(), NULL, 'Boarding & Pet Sitting', '#f97316', 'home', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Dental Care', '#ec4899', 'tooth', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Emergency Care', '#dc2626', 'alert-triangle', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Medication & Supplements', '#7c3aed', 'pill', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Housing & Rent', '#059669', 'building', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Transportation', '#0891b2', 'car', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Licensing & Registration', '#1d4ed8', 'file-text', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Behavioral Therapy', '#be185d', 'brain', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Alternative Medicine', '#65a30d', 'leaf', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Breeding & Reproduction', '#ea580c', 'heart', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Show & Competition', '#c026d3', 'trophy', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Pet Photography', '#0d9488', 'camera', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Pet Clothing & Accessories', '#f59e0b', 'shirt', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Pet Technology', '#6366f1', 'smartphone', NOW(), NOW()),
(gen_random_uuid(), NULL, 'Pet Memorial', '#6b7280', 'flower', NOW(), NOW())
ON CONFLICT (name) DO NOTHING; -- Prevent duplicates if categories already exist

-- Create user_category_preferences table for storing user preferences
CREATE TABLE IF NOT EXISTS user_category_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES expense_categories(id) ON DELETE CASCADE,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  custom_name TEXT,
  custom_color TEXT,
  custom_icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_id)
);

-- Create indexes for user_category_preferences
CREATE INDEX IF NOT EXISTS idx_user_category_preferences_user_id ON user_category_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_category_preferences_category_id ON user_category_preferences(category_id);

-- Enable RLS on user_category_preferences
ALTER TABLE user_category_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_category_preferences
CREATE POLICY "Users can view their own category preferences" ON user_category_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own category preferences" ON user_category_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own category preferences" ON user_category_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own category preferences" ON user_category_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for user_category_preferences updated_at
CREATE TRIGGER update_user_category_preferences_updated_at BEFORE UPDATE ON user_category_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 