-- Cleanup script to remove obvious spam data from pets table
-- Run this in Supabase SQL Editor

-- Delete pets with SQL injection attempts
DELETE FROM pets WHERE name LIKE '%;%';

-- Delete pets with inappropriate names
DELETE FROM pets WHERE name ILIKE '%faggot%' OR name ILIKE '%fuck%' OR name ILIKE '%shit%';

-- Delete pets with very short random names (likely spam)
DELETE FROM pets WHERE name IN ('Gc', 'A', '5', 'bbh', 'G', 'Deheh', 'sjbdh', 'Asds');

-- Delete pets with impossible birth dates (before 1990 or in the future)
DELETE FROM pets WHERE birth_date < '1990-01-01' OR birth_date > CURRENT_DATE;

-- Delete pets with gibberish names (3 characters or less, not real names)
DELETE FROM pets WHERE LENGTH(name) <= 3 AND name NOT IN ('Max', 'Sam', 'Bob', 'Tom', 'Tim', 'Dan', 'Ben', 'Joe', 'Zoe', 'Ace', 'Rio', 'Kai', 'Leo', 'Mia', 'Eva', 'Ava', 'Ivy', 'Zoe');

-- Show remaining pets for verification
SELECT id, name, type, breed, birth_date, created_at 
FROM pets 
ORDER BY created_at DESC; 