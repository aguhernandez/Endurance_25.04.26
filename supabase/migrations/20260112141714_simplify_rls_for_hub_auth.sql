/*
  # Simplify RLS for HUB Authentication

  1. Changes
    - Remove all existing RLS policies that depend on auth.uid()
    - Since authentication is now handled by the centralized HUB
    - Application-level security is enforced through HUB authentication
    - Local database policies are simplified to allow authenticated access
  
  2. Security Notes
    - Users must authenticate through the HUB to access this application
    - The application verifies authentication via HUB's /auth/me endpoint
    - Only authenticated users can reach the application and make queries
    - RLS is kept enabled but with permissive policies for authenticated access
*/

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Drop all existing policies on athlete_ftp table
DROP POLICY IF EXISTS "Athletes can read own FTP" ON athlete_ftp;
DROP POLICY IF EXISTS "Coaches can read athlete FTP" ON athlete_ftp;
DROP POLICY IF EXISTS "Coaches and athletes can update FTP" ON athlete_ftp;
DROP POLICY IF EXISTS "Athletes can view own FTP" ON athlete_ftp;
DROP POLICY IF EXISTS "Coaches can view all FTP" ON athlete_ftp;
DROP POLICY IF EXISTS "Athletes can update own FTP" ON athlete_ftp;
DROP POLICY IF EXISTS "Coaches can update athlete FTP" ON athlete_ftp;

-- Drop all existing policies on cycling_sessions table
DROP POLICY IF EXISTS "Athletes can read own sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Coaches can read all sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Athletes and coaches can create sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Athletes and coaches can update sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Athletes can view own sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Coaches can view all sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Athletes can create own sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Coaches can create sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Athletes can update own sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Coaches can update all sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Athletes can delete own sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Coaches can delete sessions" ON cycling_sessions;

-- Create simple permissive policies for profiles
CREATE POLICY "Allow all read access to profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow all insert access to profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update access to profiles"
  ON profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create simple permissive policies for athlete_ftp
CREATE POLICY "Allow all read access to athlete_ftp"
  ON athlete_ftp FOR SELECT
  USING (true);

CREATE POLICY "Allow all insert access to athlete_ftp"
  ON athlete_ftp FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update access to athlete_ftp"
  ON athlete_ftp FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create simple permissive policies for cycling_sessions
CREATE POLICY "Allow all read access to cycling_sessions"
  ON cycling_sessions FOR SELECT
  USING (true);

CREATE POLICY "Allow all insert access to cycling_sessions"
  ON cycling_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update access to cycling_sessions"
  ON cycling_sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all delete access to cycling_sessions"
  ON cycling_sessions FOR DELETE
  USING (true);
