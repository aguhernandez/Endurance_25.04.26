/*
  # Re-enable RLS with Clean Policies
  
  1. Summary
    - Re-enable Row Level Security on all tables
    - Create clean, simple policies without circular dependencies
    - No foreign key constraints to auth schema to avoid auth errors
    
  2. Tables Affected
    - profiles: User profile information
    - athlete_ftp: FTP (Functional Threshold Power) data for athletes
    - cycling_sessions: Training sessions and activities
    
  3. Security Policies
    - Profiles: Users can read all profiles, but only update their own
    - Athlete FTP: All authenticated users can read/write (coaches need to set athlete FTP)
    - Cycling Sessions: All authenticated users can read/write (coaches plan for athletes)
    
  4. Notes
    - Using simple auth.uid() checks only
    - No subqueries to avoid circular dependencies
    - Authorization for coach/athlete roles handled in application layer
*/

-- ============================================
-- RE-ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_ftp ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycling_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP ALL EXISTING POLICIES (Clean slate)
-- ============================================

-- Profiles
DROP POLICY IF EXISTS "Allow authenticated users to read all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can read all profiles" ON profiles;

-- Athlete FTP
DROP POLICY IF EXISTS "Allow authenticated users to read FTP data" ON athlete_ftp;
DROP POLICY IF EXISTS "Allow authenticated users to insert FTP data" ON athlete_ftp;
DROP POLICY IF EXISTS "Allow authenticated users to update FTP data" ON athlete_ftp;
DROP POLICY IF EXISTS "Authenticated users can view all FTP data" ON athlete_ftp;
DROP POLICY IF EXISTS "Authenticated users can insert FTP data" ON athlete_ftp;
DROP POLICY IF EXISTS "Authenticated users can update FTP data" ON athlete_ftp;

-- Cycling Sessions
DROP POLICY IF EXISTS "Allow authenticated users to read sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to create sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to update sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to delete sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Authenticated users can view all sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Authenticated users can create sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Authenticated users can update sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Authenticated users can delete sessions" ON cycling_sessions;

-- ============================================
-- PROFILES TABLE - Simple Policies
-- ============================================

CREATE POLICY "Enable read for authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for users"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- ATHLETE_FTP TABLE - Simple Policies
-- ============================================

CREATE POLICY "Enable read FTP for authenticated users"
  ON athlete_ftp FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert FTP for authenticated users"
  ON athlete_ftp FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update FTP for authenticated users"
  ON athlete_ftp FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete FTP for authenticated users"
  ON athlete_ftp FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- CYCLING_SESSIONS TABLE - Simple Policies
-- ============================================

CREATE POLICY "Enable read sessions for authenticated users"
  ON cycling_sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert sessions for authenticated users"
  ON cycling_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update sessions for authenticated users"
  ON cycling_sessions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete sessions for authenticated users"
  ON cycling_sessions FOR DELETE
  TO authenticated
  USING (true);
