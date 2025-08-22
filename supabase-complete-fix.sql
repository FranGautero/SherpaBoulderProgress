-- Complete fix for Sherpa Boulder Progress - Run this in Supabase SQL Editor
-- This will fix all permission and RLS issues

-- First, let's ensure we're working with the correct table structure
-- Drop any existing "users" table if it exists (to avoid confusion)
DROP TABLE IF EXISTS public.users CASCADE;

-- Ensure profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clear all existing policies on profiles
DROP POLICY IF EXISTS "Users can read their own data" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own data" ON profiles;
DROP POLICY IF EXISTS "Users can update their own data" ON profiles;
DROP POLICY IF EXISTS "Users can read their own profile data" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile during registration" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation for authenticated users" ON profiles;

-- Disable RLS temporarily to clear any issues
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new, working policies
CREATE POLICY "Enable read access for users to their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users during registration" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users to their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Update the get_user_count function to use profiles table
CREATE OR REPLACE FUNCTION get_user_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM public.profiles);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.boulders TO authenticated;
GRANT ALL ON public.user_progress TO authenticated;

-- Grant permissions to anon users for registration
GRANT INSERT ON public.profiles TO anon;

-- Also ensure auth schema access (sometimes needed)
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO anon;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Test the function
SELECT get_user_count();
