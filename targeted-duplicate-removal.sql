-- Targeted duplicate removal - shows exactly what will be removed
-- This will help us understand what's happening with the duplicates

-- Step 1: Show all system categories (building blocks)
SELECT 'System categories (building blocks):' as info;
SELECT name, is_default, user_id FROM expense_categories 
WHERE user_id IS NULL 
ORDER BY name;

-- Step 2: Show all user categories
SELECT 'All user categories:' as info;
SELECT name, user_id, created_at FROM expense_categories 
WHERE user_id IS NOT NULL 
ORDER BY name;

-- Step 3: Show user categories that EXACTLY match system category names
SELECT 'User categories that EXACTLY match system names (will be removed):' as info;
SELECT uc.name, uc.user_id, uc.created_at 
FROM expense_categories uc
WHERE uc.user_id IS NOT NULL
AND EXISTS (
  SELECT 1 FROM expense_categories sc 
  WHERE sc.user_id IS NULL 
  AND sc.name = uc.name
)
ORDER BY uc.name;

-- Step 4: Show user categories that DON'T match system names (will be kept)
SELECT 'User categories that DON\'T match system names (will be kept):' as info;
SELECT uc.name, uc.user_id, uc.created_at 
FROM expense_categories uc
WHERE uc.user_id IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM expense_categories sc 
  WHERE sc.user_id IS NULL 
  AND sc.name = uc.name
)
ORDER BY uc.name;

-- Step 5: Count what will be removed vs kept
SELECT 'Summary:' as info;
SELECT 
  'Will be removed' as action,
  COUNT(*) as count
FROM expense_categories uc
WHERE uc.user_id IS NOT NULL
AND EXISTS (
  SELECT 1 FROM expense_categories sc 
  WHERE sc.user_id IS NULL 
  AND sc.name = uc.name
)
UNION ALL
SELECT 
  'Will be kept' as action,
  COUNT(*) as count
FROM expense_categories uc
WHERE uc.user_id IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM expense_categories sc 
  WHERE sc.user_id IS NULL 
  AND sc.name = uc.name
);

-- Step 6: Actually remove the duplicates (uncomment when ready)
-- DELETE FROM expense_categories 
-- WHERE user_id IS NOT NULL
-- AND EXISTS (
--   SELECT 1 FROM expense_categories sc 
--   WHERE sc.user_id IS NULL 
--   AND sc.name = expense_categories.name
-- );

-- Step 7: Show final state (uncomment after running the DELETE)
-- SELECT 'Final state after removal:' as info;
-- SELECT COUNT(*) as total_categories FROM expense_categories;
-- SELECT COUNT(*) as system_categories FROM expense_categories WHERE user_id IS NULL;
-- SELECT COUNT(*) as user_categories FROM expense_categories WHERE user_id IS NOT NULL; 