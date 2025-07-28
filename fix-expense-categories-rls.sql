-- Fix RLS policies for expense_categories table
-- Allow access to system categories (user_id IS NULL) and user's own categories

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own categories" ON expense_categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON expense_categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON expense_categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON expense_categories;

-- Create new policies that allow access to system categories
CREATE POLICY "Users can view system and their own categories" ON expense_categories
  FOR SELECT USING (
    user_id IS NULL OR user_id = auth.uid()
  );

CREATE POLICY "Users can insert their own categories" ON expense_categories
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own categories" ON expense_categories
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own categories" ON expense_categories
  FOR DELETE USING (user_id = auth.uid()); 