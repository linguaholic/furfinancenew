-- Remove user-specific duplicates of system categories
-- This will clean up any remaining user categories that duplicate system building blocks

-- First, let's see what we have
SELECT 'Current state before removing user duplicates:' as info;
SELECT COUNT(*) as total_categories FROM expense_categories;
SELECT COUNT(*) as system_categories FROM expense_categories WHERE user_id IS NULL;
SELECT COUNT(*) as user_categories FROM expense_categories WHERE user_id IS NOT NULL;

-- Show user categories that duplicate system categories
SELECT 'User categories that duplicate system categories:' as info;
SELECT uc.name, uc.user_id, uc.created_at 
FROM expense_categories uc
WHERE uc.user_id IS NOT NULL
AND EXISTS (
  SELECT 1 FROM expense_categories sc 
  WHERE sc.user_id IS NULL 
  AND sc.name = uc.name
)
ORDER BY uc.name;

-- Remove user categories that duplicate system categories
DELETE FROM expense_categories 
WHERE user_id IS NOT NULL
AND EXISTS (
  SELECT 1 FROM expense_categories sc 
  WHERE sc.user_id IS NULL 
  AND sc.name = expense_categories.name
);

-- Show final state
SELECT 'Final state after removing user duplicates:' as info;
SELECT COUNT(*) as total_categories FROM expense_categories;
SELECT COUNT(*) as system_categories FROM expense_categories WHERE user_id IS NULL;
SELECT COUNT(*) as user_categories FROM expense_categories WHERE user_id IS NOT NULL;

-- Show remaining user categories (should only be legitimate custom ones)
SELECT 'Remaining user categories (legitimate custom ones):' as info;
SELECT name, user_id, created_at 
FROM expense_categories 
WHERE user_id IS NOT NULL 
ORDER BY name; 