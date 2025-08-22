-- SIMPLE MONTHLY RESET SCRIPT
-- Run this at the beginning of each month to reset all user progress
-- WARNING: This will permanently delete all user progress data

-- Simple approach: Just delete all progress
-- Uncomment the line below to reset all user progress
-- DELETE FROM public.user_progress;

-- If you want to see current statistics before resetting, run this first:
SELECT 
  COUNT(*) as total_progress_records,
  COUNT(DISTINCT user_id) as active_users,
  SUM(boulder_count) as total_boulders_completed,
  SUM(boulder_count * 100) as total_points_earned
FROM public.user_progress 
WHERE boulder_count > 0;

-- Optional: Create a simple backup before deletion
-- Uncomment these lines to create a timestamped backup
/*
CREATE TABLE user_progress_backup_2024_01 AS 
SELECT *, NOW() as backup_created_at 
FROM public.user_progress;
*/

-- The actual reset (uncomment to execute)
-- DELETE FROM public.user_progress;

-- Verify reset was successful
-- SELECT COUNT(*) as remaining_records FROM public.user_progress;
