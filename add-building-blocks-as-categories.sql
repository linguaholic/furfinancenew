-- Migration: Add all building blocks as categories
-- This ensures all predefined categories exist in the database

-- Insert all building blocks as categories
-- Note: We'll use NULL for user_id since these are system-wide categories
-- In the future, we can add a 'is_system_category' boolean field if needed

-- Insert building blocks as categories, checking for existing ones first
INSERT INTO expense_categories (id, user_id, name, color, icon, created_at, updated_at)
SELECT 
  gen_random_uuid(), 
  NULL, 
  name, 
  color, 
  icon, 
  NOW(), 
  NOW()
FROM (VALUES
  -- Default categories (isDefault: true)
  ('Food & Treats', '#10b981', 'utensils'),
  ('Veterinary Care', '#ef4444', 'heart-pulse'),
  ('Grooming', '#8b5cf6', 'scissors'),
  ('Toys & Entertainment', '#f59e0b', 'gamepad-2'),
  ('Supplies & Equipment', '#06b6d4', 'package'),
  ('Training', '#84cc16', 'graduation-cap'),
  ('Insurance', '#6366f1', 'shield'),
  ('Other', '#6b7280', 'more-horizontal'),

  -- Additional building blocks (isDefault: false)
  ('Boarding & Pet Sitting', '#f97316', 'home'),
  ('Dental Care', '#ec4899', 'tooth'),
  ('Emergency Care', '#dc2626', 'alert-triangle'),
  ('Medication & Supplements', '#7c3aed', 'pill'),
  ('Housing & Rent', '#059669', 'building'),
  ('Transportation', '#0891b2', 'car'),
  ('Licensing & Registration', '#1d4ed8', 'file-text'),
  ('Behavioral Therapy', '#be185d', 'brain'),
  ('Alternative Medicine', '#65a30d', 'leaf'),
  ('Breeding & Reproduction', '#ea580c', 'heart'),
  ('Show & Competition', '#c026d3', 'trophy'),
  ('Pet Photography', '#0d9488', 'camera'),
  ('Pet Clothing & Accessories', '#f59e0b', 'shirt'),
  ('Pet Technology', '#6366f1', 'smartphone'),
  ('Pet Memorial', '#6b7280', 'flower')
) AS v(name, color, icon)
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE expense_categories.name = v.name
);

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