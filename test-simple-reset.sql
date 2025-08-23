-- TEST SIMPLE MONTHLY RESET
-- Run this to safely test the monthly reset system before automation
-- Shows what will be deleted without actually deleting anything

-- Step 1: See current progress statistics (before reset)
SELECT 
    '📊 CURRENT PROGRESS OVERVIEW' as info;

SELECT 
    COUNT(*) as total_progress_records,
    COUNT(DISTINCT user_id) as active_users,
    SUM(boulder_count) as total_boulders_completed,
    SUM(boulder_count * 100) as total_points_earned,
    ROUND(AVG(boulder_count * 100)) as avg_points_per_user
FROM public.user_progress 
WHERE boulder_count > 0;

-- Step 2: Show detailed user progress (who will be affected)
SELECT 
    '👥 USERS WHO WILL BE RESET' as info;

SELECT 
    p.name as user_name,
    COUNT(up.id) as progress_entries,
    SUM(up.boulder_count) as total_boulders,
    SUM(up.boulder_count * 100) as total_points
FROM public.user_progress up
JOIN public.profiles p ON up.user_id = p.id
WHERE up.boulder_count > 0
GROUP BY p.id, p.name
ORDER BY total_points DESC;

-- Step 3: Show progress by color (what achievements will be lost)
SELECT 
    '🎨 PROGRESS BY COLOR TO BE RESET' as info;

SELECT 
    b.color as boulder_color,
    COUNT(DISTINCT up.user_id) as users_with_progress,
    SUM(up.boulder_count) as total_completions
FROM public.user_progress up
JOIN public.boulders b ON up.boulder_id = b.id
WHERE up.boulder_count > 0
GROUP BY b.color
ORDER BY total_completions DESC;

-- Step 4: Test the preview function (what the automation will see)
SELECT 
    '🔍 RESET PREVIEW FUNCTION TEST' as info;

SELECT * FROM get_reset_preview();

-- Step 5: SIMULATION - Don't actually reset, just show what would happen
SELECT 
    '⚠️ SIMULATION: WHAT WOULD BE DELETED' as warning;

SELECT 
    'This would DELETE ALL ' || COUNT(*) || ' progress records!' as deletion_warning,
    'Affecting ' || COUNT(DISTINCT user_id) || ' users total' as users_affected,
    'Removing ' || SUM(boulder_count) || ' boulder completions' as boulders_lost,
    'Clearing ' || SUM(boulder_count * 100) || ' total points' as points_lost
FROM public.user_progress
WHERE boulder_count > 0;

-- Step 6: Show what will remain after reset (should be unchanged)
SELECT 
    '✅ DATA THAT WILL REMAIN UNCHANGED' as preserved_info;

SELECT 
    (SELECT COUNT(*) FROM public.profiles) as user_accounts,
    (SELECT COUNT(*) FROM public.boulders) as boulder_routes,
    'User profiles, boulder definitions, and app settings' as preserved_note;

-- Step 7: Instructions for actual reset
SELECT 
    '🚨 TO ACTUALLY RESET (DANGER!)' as reset_instructions;

SELECT 
    'Uncomment and run the line below to execute the real reset:' as instruction,
    '-- SELECT simple_monthly_reset();' as commented_reset_command,
    'This will PERMANENTLY DELETE all progress data!' as final_warning;

-- ACTUAL RESET COMMAND (commented for safety)
-- Uncomment the line below to execute the real reset
-- SELECT simple_monthly_reset();

-- Step 8: Post-reset verification (run after actual reset)
/*
-- Uncomment these lines AFTER running the reset to verify it worked:

SELECT 
    '✅ POST-RESET VERIFICATION' as verification;

SELECT 
    COUNT(*) as remaining_progress_records,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Reset successful - all progress cleared!'
        ELSE '⚠️ Reset incomplete - some records remain'
    END as status
FROM public.user_progress;

SELECT 
    COUNT(*) as user_accounts_preserved,
    COUNT(*) as boulder_routes_preserved
FROM public.profiles, public.boulders;
*/
