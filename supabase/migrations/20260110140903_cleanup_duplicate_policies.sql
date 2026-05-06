/*
  # Cleanup Duplicate RLS Policies

  1. Changes
    - Remove all old coach-only policies
    - Keep only the policies that include admin role
    - Ensure no policy conflicts
  
  2. Security
    - Maintain secure access for athletes, coaches, and admins
    - No data loss or security gaps
*/

-- Clean up athlete_ftp policies
DROP POLICY IF EXISTS "Coaches can insert FTP for athletes" ON athlete_ftp;
DROP POLICY IF EXISTS "Coaches can read all FTP" ON athlete_ftp;
DROP POLICY IF EXISTS "Coaches can update all FTP" ON athlete_ftp;

-- Clean up cycling_sessions policies
DROP POLICY IF EXISTS "Coaches can delete all sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Coaches can insert sessions for athletes" ON cycling_sessions;
DROP POLICY IF EXISTS "Coaches can read all sessions" ON cycling_sessions;
DROP POLICY IF EXISTS "Coaches can update all sessions" ON cycling_sessions;

-- Verify admin policies are in place
-- These should already exist from previous migration

-- Add missing delete policy for admins on cycling_sessions
DROP POLICY IF EXISTS "Coaches and admins can delete sessions" ON cycling_sessions;

CREATE POLICY "Coaches and admins can delete sessions"
  ON cycling_sessions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );
