/*
  # Fix Admin Policies

  1. Changes
    - Update RLS policies to include admin role
    - Admins can read all profiles
    - Admins can read all athlete FTP data
    - Admins can read all cycling sessions
  
  2. Security
    - Maintain existing athlete and coach access
    - Add admin access to all tables
*/

-- Drop and recreate the "Coaches can read all profiles" policy to include admins
DROP POLICY IF EXISTS "Coaches can read all profiles" ON profiles;

CREATE POLICY "Coaches and admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );

-- Add admin read access to athlete_ftp
DROP POLICY IF EXISTS "Coaches can view athlete FTP" ON athlete_ftp;

CREATE POLICY "Coaches and admins can view athlete FTP"
  ON athlete_ftp
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = athlete_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );

-- Add admin read access to cycling_sessions
DROP POLICY IF EXISTS "Coaches can view all sessions" ON cycling_sessions;

CREATE POLICY "Coaches and admins can view all sessions"
  ON cycling_sessions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = athlete_id
    OR auth.uid() = planned_by_coach_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );

-- Add admin write access to athlete_ftp
DROP POLICY IF EXISTS "Coaches can update athlete FTP" ON athlete_ftp;

CREATE POLICY "Coaches and admins can update athlete FTP"
  ON athlete_ftp
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );

CREATE POLICY "Coaches and admins can insert athlete FTP"
  ON athlete_ftp
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );

-- Add admin write access to cycling_sessions
DROP POLICY IF EXISTS "Coaches can create sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Coaches can update sessions" ON cycling_sessions;

CREATE POLICY "Coaches and admins can create sessions"
  ON cycling_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );

CREATE POLICY "Coaches and admins can update sessions"
  ON cycling_sessions
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = planned_by_coach_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );
