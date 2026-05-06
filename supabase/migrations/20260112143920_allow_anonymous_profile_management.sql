/*
  # Allow anonymous profile management for local development

  1. Changes
    - Add policy to allow anonymous users to read profiles
    - Add policy to allow anonymous users to create profiles
    - Add policy to allow anonymous users to update profiles
    - Add policy to allow anonymous users to delete profiles
  
  2. Security
    - These policies enable local development mode
    - In production, these should be disabled or restricted
    - Profiles table still has RLS enabled
*/

-- Allow anonymous users to read profiles (for local development)
CREATE POLICY "Anonymous can read profiles"
  ON profiles FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to insert profiles (for local development)
CREATE POLICY "Anonymous can create profiles"
  ON profiles FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update profiles (for local development)
CREATE POLICY "Anonymous can update profiles"
  ON profiles FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete profiles (for local development)
CREATE POLICY "Anonymous can delete profiles"
  ON profiles FOR DELETE
  TO anon
  USING (true);

-- Allow anonymous users to read all cycling sessions (for local development)
CREATE POLICY "Anonymous can read sessions"
  ON cycling_sessions FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to create sessions (for local development)
CREATE POLICY "Anonymous can create sessions"
  ON cycling_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update sessions (for local development)
CREATE POLICY "Anonymous can update sessions"
  ON cycling_sessions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete sessions (for local development)
CREATE POLICY "Anonymous can delete sessions"
  ON cycling_sessions FOR DELETE
  TO anon
  USING (true);

-- Allow anonymous users to read all athlete FTP records (for local development)
CREATE POLICY "Anonymous can read athlete_ftp"
  ON athlete_ftp FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to create FTP records (for local development)
CREATE POLICY "Anonymous can create athlete_ftp"
  ON athlete_ftp FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update FTP records (for local development)
CREATE POLICY "Anonymous can update athlete_ftp"
  ON athlete_ftp FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete FTP records (for local development)
CREATE POLICY "Anonymous can delete athlete_ftp"
  ON athlete_ftp FOR DELETE
  TO anon
  USING (true);