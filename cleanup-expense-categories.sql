-- Cleanup migration for expense_categories table
-- This will fix the duplicate categories issue and ensure proper data structure

-- First, let's see what we're working with
SELECT 'Current state before cleanup:' as info;
SELECT COUNT(*) as total_categories FROM expense_categories;
SELECT COUNT(*) as system_categories FROM expense_categories WHERE user_id IS NULL;
SELECT COUNT(*) as user_categories FROM expense_categories WHERE user_id IS NOT NULL;

-- Step 1: Create a backup of current data (just in case)
CREATE TABLE IF NOT EXISTS expense_categories_backup AS 
SELECT * FROM expense_categories;

-- Step 1.5: Add is_default column if it doesn't exist
ALTER TABLE expense_categories 
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- Step 2: Remove duplicates of building blocks (keep only one of each)
-- Define the building block names we want to keep
DELETE FROM expense_categories 
WHERE id IN (
  SELECT ec.id
  FROM expense_categories ec
  WHERE ec.name IN (
    'Food & Treats',
    'Veterinary Care', 
    'Grooming & Hygiene',
    'Toys & Entertainment',
    'Training & Classes',
    'Insurance',
    'Transportation',
    'Medication & Supplements',
    'Boarding & Pet Sitting',
    'Pet Supplies',
    'Emergency Care',
    'Breeding & Mating',
    'Show & Competition',
    'Pet Photography',
    'Pet Memorial',
    'Pet Taxi Services',
    'Pet Insurance Claims',
    'Pet Therapy Services',
    'Pet Adoption Fees',
    'Pet Microchipping',
    'Pet License & Registration',
    'Pet Cremation Services',
    'Pet Behaviorist'
  )
  AND ec.id NOT IN (
    -- Keep the first occurrence of each building block (preferably system ones)
    SELECT DISTINCT ON (ec.name) ec.id
    FROM expense_categories ec
    WHERE ec.name IN (
      'Food & Treats',
      'Veterinary Care', 
      'Grooming & Hygiene',
      'Toys & Entertainment',
      'Training & Classes',
      'Insurance',
      'Transportation',
      'Medication & Supplements',
      'Boarding & Pet Sitting',
      'Pet Supplies',
      'Emergency Care',
      'Breeding & Mating',
      'Show & Competition',
      'Pet Photography',
      'Pet Memorial',
      'Pet Taxi Services',
      'Pet Insurance Claims',
      'Pet Therapy Services',
      'Pet Adoption Fees',
      'Pet Microchipping',
      'Pet License & Registration',
      'Pet Cremation Services',
      'Pet Behaviorist'
    )
    ORDER BY ec.name, 
             CASE WHEN ec.user_id IS NULL THEN 0 ELSE 1 END, -- Prefer system categories
             ec.created_at ASC -- Then oldest
  )
);

-- Step 3: Ensure all building blocks exist as system categories (user_id = NULL)
-- Insert missing building blocks
INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Food & Treats',
  '#10b981',
  'utensils',
  true,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Food & Treats' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Veterinary Care',
  '#ef4444',
  'stethoscope',
  true,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Veterinary Care' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Grooming & Hygiene',
  '#3b82f6',
  'scissors',
  true,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Grooming & Hygiene' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Toys & Entertainment',
  '#8b5cf6',
  'gamepad-2',
  true,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Toys & Entertainment' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Training & Classes',
  '#f59e0b',
  'graduation-cap',
  true,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Training & Classes' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Insurance',
  '#06b6d4',
  'shield',
  true,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Insurance' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Transportation',
  '#84cc16',
  'car',
  true,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Transportation' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Medication & Supplements',
  '#ec4899',
  'pill',
  true,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Medication & Supplements' AND user_id IS NULL
);

-- Additional building blocks (non-default)
INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Boarding & Pet Sitting',
  '#f97316',
  'home',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Boarding & Pet Sitting' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Pet Supplies',
  '#6366f1',
  'shopping-bag',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Pet Supplies' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Emergency Care',
  '#dc2626',
  'alert-triangle',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Emergency Care' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Breeding & Mating',
  '#7c3aed',
  'heart',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Breeding & Mating' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Show & Competition',
  '#059669',
  'trophy',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Show & Competition' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Pet Photography',
  '#0ea5e9',
  'camera',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Pet Photography' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Pet Memorial',
  '#6b7280',
  'flower',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Pet Memorial' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Pet Taxi Services',
  '#fbbf24',
  'taxi',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Pet Taxi Services' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Pet Insurance Claims',
  '#34d399',
  'file-text',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Pet Insurance Claims' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Pet Therapy Services',
  '#a78bfa',
  'heart-handshake',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Pet Therapy Services' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Pet Adoption Fees',
  '#fb7185',
  'users',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Pet Adoption Fees' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Pet Microchipping',
  '#60a5fa',
  'radio',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Pet Microchipping' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Pet License & Registration',
  '#f472b6',
  'id-card',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Pet License & Registration' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Pet Cremation Services',
  '#9ca3af',
  'flame',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Pet Cremation Services' AND user_id IS NULL
);

INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at)
SELECT 
  'Pet Behaviorist',
  '#10b981',
  'brain',
  false,
  NULL,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Pet Behaviorist' AND user_id IS NULL
);

-- Step 4: Update any remaining building blocks to be system categories
UPDATE expense_categories 
SET user_id = NULL, 
    updated_at = NOW()
WHERE name IN (
  'Food & Treats',
  'Veterinary Care', 
  'Grooming & Hygiene',
  'Toys & Entertainment',
  'Training & Classes',
  'Insurance',
  'Transportation',
  'Medication & Supplements',
  'Boarding & Pet Sitting',
  'Pet Supplies',
  'Emergency Care',
  'Breeding & Mating',
  'Show & Competition',
  'Pet Photography',
  'Pet Memorial',
  'Pet Taxi Services',
  'Pet Insurance Claims',
  'Pet Therapy Services',
  'Pet Adoption Fees',
  'Pet Microchipping',
  'Pet License & Registration',
  'Pet Cremation Services',
  'Pet Behaviorist'
) AND user_id IS NOT NULL;

-- Step 5: Show the final state
SELECT 'Final state after cleanup:' as info;
SELECT COUNT(*) as total_categories FROM expense_categories;
SELECT COUNT(*) as system_categories FROM expense_categories WHERE user_id IS NULL;
SELECT COUNT(*) as user_categories FROM expense_categories WHERE user_id IS NOT NULL;

-- Step 6: Show what building blocks we have
SELECT 'Building blocks (system categories):' as info;
SELECT name, is_default, user_id FROM expense_categories 
WHERE user_id IS NULL 
ORDER BY is_default DESC, name;

-- Step 7: Show any remaining custom categories
SELECT 'Custom categories (user-specific):' as info;
SELECT name, user_id, created_at FROM expense_categories 
WHERE user_id IS NOT NULL 
ORDER BY name;

-- Step 8: Clean up any orphaned user_category_preferences that reference deleted categories
DELETE FROM user_category_preferences 
WHERE category_id NOT IN (SELECT id FROM expense_categories);

-- Step 9: Show final user_category_preferences count
SELECT 'User category preferences after cleanup:' as info;
SELECT COUNT(*) as total_preferences FROM user_category_preferences; 