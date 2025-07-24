-- Migration script to add recurring expense functionality
-- Run this in your Supabase SQL editor

-- Add recurring_type enum
CREATE TYPE recurring_type AS ENUM ('none', 'monthly', 'quarterly', 'yearly');

-- Add recurring fields to expenses table
ALTER TABLE expenses 
ADD COLUMN recurring_type recurring_type NOT NULL DEFAULT 'none',
ADD COLUMN next_due_date DATE;

-- Add indexes for better performance
CREATE INDEX idx_expenses_recurring_type ON expenses(recurring_type);
CREATE INDEX idx_expenses_next_due_date ON expenses(next_due_date);

-- Update existing expenses to have 'none' as recurring_type
UPDATE expenses SET recurring_type = 'none' WHERE recurring_type IS NULL; 