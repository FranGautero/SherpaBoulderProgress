-- SIMPLE AUTOMATED MONTHLY RESET
-- This creates a function to completely reset all user progress without keeping history
-- Perfect for monthly challenges where only current progress matters

-- Create a simple function to reset all user progress
CREATE OR REPLACE FUNCTION simple_monthly_reset()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
  reset_timestamp TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Record the reset time
  reset_timestamp := NOW();
  
  -- Delete ALL user progress (no history kept)
  DELETE FROM public.user_progress;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Return summary of what was reset
  RETURN json_build_object(
    'success', true,
    'deleted_records', deleted_count,
    'reset_timestamp', reset_timestamp,
    'message', 'Monthly progress reset completed - fresh start for everyone!'
  );
END;
$$;

-- Grant execution rights to service_role (for Edge Functions)
GRANT EXECUTE ON FUNCTION public.simple_monthly_reset TO service_role;

-- Grant execution rights to authenticated users (for manual admin reset)
GRANT EXECUTE ON FUNCTION public.simple_monthly_reset TO authenticated;

-- Optional: Create a function to get reset statistics before deleting
CREATE OR REPLACE FUNCTION get_reset_preview()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_records INTEGER;
  active_users INTEGER;
  total_boulders INTEGER;
  total_points INTEGER;
BEGIN
  -- Get statistics of what will be reset
  SELECT 
    COUNT(*) as records,
    COUNT(DISTINCT user_id) as users,
    SUM(boulder_count) as boulders,
    SUM(boulder_count * 100) as points
  INTO total_records, active_users, total_boulders, total_points
  FROM public.user_progress 
  WHERE boulder_count > 0;
  
  RETURN json_build_object(
    'total_records', COALESCE(total_records, 0),
    'active_users', COALESCE(active_users, 0),
    'total_boulders', COALESCE(total_boulders, 0),
    'total_points', COALESCE(total_points, 0),
    'preview_timestamp', NOW()
  );
END;
$$;

-- Grant execution rights for preview function
GRANT EXECUTE ON FUNCTION public.get_reset_preview TO service_role;
GRANT EXECUTE ON FUNCTION public.get_reset_preview TO authenticated;
