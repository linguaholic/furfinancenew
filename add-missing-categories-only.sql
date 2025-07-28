-- Migration: Add missing building block categories only
-- This only inserts the missing categories without recreating tables

-- Insert missing building blocks as categories
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
  -- Additional building blocks that are missing
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