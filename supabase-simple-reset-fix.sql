-- FIXED: Simple Monthly Reset - Use TRUNCATE instead of DELETE
-- This avoids the "DELETE requires a WHERE clause" safety error

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
  
  -- Get count before truncating
  SELECT COUNT(*) INTO deleted_count FROM public.user_progress;
  
  -- Use TRUNCATE instead of DELETE (clears entire table efficiently)
  TRUNCATE TABLE public.user_progress RESTART IDENTITY;
  
  -- Return summary of what was reset
  RETURN json_build_object(
    'success', true,
    'deleted_records', deleted_count,
    'reset_timestamp', reset_timestamp,
    'message', 'Monthly progress reset completed - fresh start for everyone!'
  );
END;
$$;

-- Grant execution rights
GRANT EXECUTE ON FUNCTION public.simple_monthly_reset TO service_role;
GRANT EXECUTE ON FUNCTION public.simple_monthly_reset TO authenticated;
