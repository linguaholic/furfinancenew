-- Migration to add 'chicken' to the pet_type enum
-- This should be run on existing databases that don't have 'chicken' in the pet_type enum

-- Add 'chicken' to the pet_type enum
ALTER TYPE pet_type ADD VALUE 'chicken' AFTER 'reptile';

-- Note: This migration assumes the enum already exists and has the other values
-- If you get an error about the enum not existing, you may need to run the full schema first 