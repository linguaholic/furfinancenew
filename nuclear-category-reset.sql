-- NUCLEAR OPTION: Complete reset of expense_categories table
-- This will give us exactly what we want: 8 default + 15 additional categories

-- Step 1: Backup current data (just in case)
CREATE TABLE IF NOT EXISTS expense_categories_backup_nuclear AS 
SELECT * FROM expense_categories;

-- Step 2: COMPLETELY CLEAR the expense_categories table
TRUNCATE TABLE expense_categories RESTART IDENTITY CASCADE;

-- Step 3: Insert exactly the 8 default categories
INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at) VALUES
('Food & Treats', '#10b981', 'utensils', true, NULL, NOW(), NOW()),
('Veterinary Care', '#ef4444', 'stethoscope', true, NULL, NOW(), NOW()),
('Grooming & Hygiene', '#3b82f6', 'scissors', true, NULL, NOW(), NOW()),
('Toys & Entertainment', '#8b5cf6', 'gamepad-2', true, NULL, NOW(), NOW()),
('Training & Classes', '#f59e0b', 'graduation-cap', true, NULL, NOW(), NOW()),
('Insurance', '#06b6d4', 'shield', true, NULL, NOW(), NOW()),
('Transportation', '#84cc16', 'car', true, NULL, NOW(), NOW()),
('Medication & Supplements', '#ec4899', 'pill', true, NULL, NOW(), NOW());

-- Step 4: Insert exactly the 15 additional building blocks
INSERT INTO expense_categories (name, color, icon, is_default, user_id, created_at, updated_at) VALUES
('Boarding & Pet Sitting', '#f97316', 'home', false, NULL, NOW(), NOW()),
('Pet Supplies', '#6366f1', 'shopping-bag', false, NULL, NOW(), NOW()),
('Emergency Care', '#dc2626', 'alert-triangle', false, NULL, NOW(), NOW()),
('Breeding & Mating', '#7c3aed', 'heart', false, NULL, NOW(), NOW()),
('Show & Competition', '#059669', 'trophy', false, NULL, NOW(), NOW()),
('Pet Photography', '#0ea5e9', 'camera', false, NULL, NOW(), NOW()),
('Pet Memorial', '#6b7280', 'flower', false, NULL, NOW(), NOW()),
('Pet Taxi Services', '#fbbf24', 'taxi', false, NULL, NOW(), NOW()),
('Pet Insurance Claims', '#34d399', 'file-text', false, NULL, NOW(), NOW()),
('Pet Therapy Services', '#a78bfa', 'heart-handshake', false, NULL, NOW(), NOW()),
('Pet Adoption Fees', '#fb7185', 'users', false, NULL, NOW(), NOW()),
('Pet Microchipping', '#60a5fa', 'radio', false, NULL, NOW(), NOW()),
('Pet License & Registration', '#f472b6', 'id-card', false, NULL, NOW(), NOW()),
('Pet Cremation Services', '#9ca3af', 'flame', false, NULL, NOW(), NOW()),
('Pet Behaviorist', '#10b981', 'brain', false, NULL, NOW(), NOW());

-- Step 5: Verify the results
SELECT 'NUCLEAR RESET COMPLETE - Final state:' as info;
SELECT COUNT(*) as total_categories FROM expense_categories;
SELECT COUNT(*) as default_categories FROM expense_categories WHERE is_default = true;
SELECT COUNT(*) as additional_categories FROM expense_categories WHERE is_default = false;
SELECT COUNT(*) as system_categories FROM expense_categories WHERE user_id IS NULL;

-- Step 6: Show all categories
SELECT 'All categories after nuclear reset:' as info;
SELECT name, is_default, user_id FROM expense_categories 
ORDER BY is_default DESC, name;

-- Step 7: Clear any orphaned user_category_preferences
DELETE FROM user_category_preferences 
WHERE category_id NOT IN (SELECT id FROM expense_categories);

SELECT 'User category preferences after cleanup:' as info;
SELECT COUNT(*) as total_preferences FROM user_category_preferences; 