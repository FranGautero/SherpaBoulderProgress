-- Update Boulder System to Support Multiple Boulders per Cell
-- Run this in your Supabase SQL Editor

-- Add a count column to user_progress table
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS boulder_count INTEGER DEFAULT 1;

-- Update existing records to have count = 1 (for backward compatibility)
UPDATE user_progress SET boulder_count = 1 WHERE boulder_count IS NULL;

-- Make boulder_count NOT NULL with default 1
ALTER TABLE user_progress ALTER COLUMN boulder_count SET NOT NULL;
ALTER TABLE user_progress ALTER COLUMN boulder_count SET DEFAULT 1;

-- Add a check constraint to ensure count is always >= 0
ALTER TABLE user_progress ADD CONSTRAINT boulder_count_positive CHECK (boulder_count >= 0);

-- Remove the unique constraint on (user_id, boulder_id) since we now track counts
-- We'll handle this with a unique constraint and use upsert operations
DROP INDEX IF EXISTS user_progress_user_id_boulder_id_key;
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_user_id_boulder_id_key;

-- Add unique constraint back (this should still exist for data integrity)
ALTER TABLE user_progress ADD CONSTRAINT user_progress_user_id_boulder_id_unique 
  UNIQUE(user_id, boulder_id);

-- Create or replace a function to upsert boulder progress
CREATE OR REPLACE FUNCTION upsert_boulder_progress(
  p_user_id UUID,
  p_boulder_id UUID,
  p_count INTEGER
) RETURNS user_progress AS $$
DECLARE
  result user_progress;
BEGIN
  -- If count is 0, delete the record
  IF p_count <= 0 THEN
    DELETE FROM user_progress 
    WHERE user_id = p_user_id AND boulder_id = p_boulder_id;
    
    -- Return a dummy record for consistency
    SELECT p_user_id, p_boulder_id, 0, NOW()::timestamp with time zone 
    INTO result.user_id, result.boulder_id, result.boulder_count, result.completed_at;
    
    RETURN result;
  END IF;

  -- Otherwise, insert or update
  INSERT INTO user_progress (user_id, boulder_id, boulder_count, completed_at)
  VALUES (p_user_id, p_boulder_id, p_count, NOW())
  ON CONFLICT (user_id, boulder_id)
  DO UPDATE SET 
    boulder_count = p_count,
    completed_at = NOW()
  RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION upsert_boulder_progress TO authenticated;
