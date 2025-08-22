-- TEST SCRIPT FOR MONTHLY RESET
-- Use this to test the monthly reset functionality safely
-- This script will show you what would happen without actually deleting data

-- Step 1: Check current user progress data
SELECT 
    'CURRENT PROGRESS SUMMARY' as info,
    COUNT(*) as total_records,
    COUNT(DISTINCT user_id) as active_users,
    SUM(boulder_count) as total_boulders,
    SUM(boulder_count * 100) as total_points
FROM public.user_progress 
WHERE boulder_count > 0;

-- Step 2: See which users would be affected
SELECT 
    p.name as user_name,
    p.email,
    COUNT(*) as progress_entries,
    SUM(up.boulder_count) as total_boulders,
    SUM(up.boulder_count * 100) as total_points
FROM public.user_progress up
JOIN public.profiles p ON up.user_id = p.id
WHERE up.boulder_count > 0
GROUP BY p.id, p.name, p.email
ORDER BY total_points DESC;

-- Step 3: Show progress by color and zone
SELECT 
    b.color,
    b.zone,
    COUNT(DISTINCT up.user_id) as users_completed,
    SUM(up.boulder_count) as total_completions
FROM public.user_progress up
JOIN public.boulders b ON up.boulder_id = b.id
WHERE up.boulder_count > 0
GROUP BY b.color, b.zone
ORDER BY b.color, b.zone;

-- Step 4: Test the archive functionality (if using archival approach)
-- This will create a test archive without affecting live data
/*
-- Uncomment to test archiving:
INSERT INTO public.user_progress_archive (
    user_id, 
    boulder_id, 
    boulder_count, 
    completed_at,
    archived_at,
    archive_month,
    archive_year
)
SELECT 
    user_id,
    boulder_id,
    boulder_count,
    completed_at,
    NOW(),
    EXTRACT(MONTH FROM NOW())::INTEGER,
    EXTRACT(YEAR FROM NOW())::INTEGER
FROM public.user_progress
WHERE boulder_count > 0
ON CONFLICT DO NOTHING;  -- Don't overwrite existing archives

-- Check what was archived
SELECT COUNT(*) as archived_records FROM public.user_progress_archive;
*/

-- Step 5: SIMULATION - What would be deleted
SELECT 
    'SIMULATION: Records that would be DELETED' as warning,
    COUNT(*) as records_to_delete
FROM public.user_progress;

-- Step 6: ACTUAL RESET (uncomment only when ready)
-- WARNING: This will permanently delete all user progress
-- Make sure you've run the archive steps above first!

/*
-- UNCOMMENT THESE LINES TO ACTUALLY RESET:
-- DELETE FROM public.user_progress;
-- SELECT 'RESET COMPLETED' as status, COUNT(*) as remaining_records FROM public.user_progress;
*/

-- Step 7: Verification queries (run after reset)
-- Use these to confirm the reset worked properly

/*
-- Check that progress is cleared
SELECT COUNT(*) as remaining_progress FROM public.user_progress;

-- Check that archives exist (if using archival approach)
SELECT COUNT(*) as archived_records FROM public.user_progress_archive;

-- Check that users and boulders are still intact
SELECT COUNT(*) as total_users FROM public.profiles;
SELECT COUNT(*) as total_boulders FROM public.boulders;
*/
