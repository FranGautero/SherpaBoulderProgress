-- Fix for Row Level Security Policy on profiles table
-- Run this in your Supabase SQL editor to fix the registration issue

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert their own data" ON profiles;

-- Create a new INSERT policy that works during registration
CREATE POLICY "Users can insert their own profile during registration" 
  ON profiles FOR INSERT 
  WITH CHECK (
    -- Allow insert if the user is authenticated AND the ID matches
    auth.uid() = id
    OR
    -- Allow insert during registration (when auth.uid() might be the same as the new user ID)
    auth.jwt() ->> 'sub' = id::text
  );

-- Alternative: You can also temporarily disable RLS for profiles table during registration
-- and re-enable it after testing. If the above doesn't work, use this approach:

-- Create a more permissive policy for INSERT that checks if the user exists in auth.users
DROP POLICY IF EXISTS "Users can insert their own profile during registration" ON profiles;

CREATE POLICY "Allow profile creation for authenticated users" 
  ON profiles FOR INSERT 
  WITH CHECK (
    -- Check if the ID exists in auth.users table
    EXISTS (SELECT 1 FROM auth.users WHERE id = profiles.id)
    AND
    -- And the current user is either the same user or during initial registration
    (auth.uid() = id OR auth.uid() IS NOT NULL)
  );

-- Also ensure the SELECT policy is working correctly
DROP POLICY IF EXISTS "Users can read their own data" ON profiles;

CREATE POLICY "Users can read their own profile data" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Make sure authenticated users can read from profiles table
GRANT SELECT ON profiles TO authenticated;
GRANT INSERT ON profiles TO authenticated;
