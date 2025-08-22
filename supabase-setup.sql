-- Supabase database setup for Sherpa Boulder Progress
-- Run this script in your Supabase SQL editor

-- Create profiles table (instead of users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create boulders table
CREATE TABLE boulders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  color TEXT NOT NULL CHECK (color IN ('verdes', 'amarillos', 'rojos', 'lilas', 'negros')),
  zone TEXT NOT NULL CHECK (zone IN ('proa', 'popa', 'babor', 'estribor', 'desplome-de-los-loros', 'amazonia')),
  points INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(color, zone)
);

-- Create user_progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  boulder_id UUID REFERENCES boulders(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, boulder_id)
);

-- Insert all possible boulder combinations
INSERT INTO boulders (color, zone) VALUES
  ('verdes', 'proa'),
  ('verdes', 'popa'),
  ('verdes', 'babor'),
  ('verdes', 'estribor'),
  ('verdes', 'desplome-de-los-loros'),
  ('verdes', 'amazonia'),
  ('amarillos', 'proa'),
  ('amarillos', 'popa'),
  ('amarillos', 'babor'),
  ('amarillos', 'estribor'),
  ('amarillos', 'desplome-de-los-loros'),
  ('amarillos', 'amazonia'),
  ('rojos', 'proa'),
  ('rojos', 'popa'),
  ('rojos', 'babor'),
  ('rojos', 'estribor'),
  ('rojos', 'desplome-de-los-loros'),
  ('rojos', 'amazonia'),
  ('lilas', 'proa'),
  ('lilas', 'popa'),
  ('lilas', 'babor'),
  ('lilas', 'estribor'),
  ('lilas', 'desplome-de-los-loros'),
  ('lilas', 'amazonia'),
  ('negros', 'proa'),
  ('negros', 'popa'),
  ('negros', 'babor'),
  ('negros', 'estribor'),
  ('negros', 'desplome-de-los-loros'),
  ('negros', 'amazonia');

-- Create function to get user count (for 200 user limit)
CREATE OR REPLACE FUNCTION get_user_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM profiles);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Row Level Security Policies

-- Profiles table policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own data" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Boulders table policies (read-only for all authenticated users)
ALTER TABLE boulders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read boulders" 
  ON boulders FOR SELECT 
  TO authenticated 
  USING (true);

-- User progress table policies
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own progress" 
  ON user_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON user_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON user_progress FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" 
  ON user_progress FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_boulder_id ON user_progress(boulder_id);
CREATE INDEX idx_boulders_color_zone ON boulders(color, zone);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.boulders TO authenticated;
GRANT ALL ON public.user_progress TO authenticated;
