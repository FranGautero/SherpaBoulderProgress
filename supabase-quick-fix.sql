-- QUICK FIX - Run this first if you want to test immediately
-- This temporarily disables RLS so registration works

-- Temporarily disable Row Level Security on profiles table
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT INSERT ON public.profiles TO anon;

-- This will allow registration to work immediately
-- You can re-enable RLS later with proper policies
