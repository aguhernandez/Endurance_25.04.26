/*
  # Fix Foreign Key References for Local Development

  1. Changes
    - Drop foreign key constraints from cycling_sessions that reference auth.users
    - Drop foreign key constraints from athlete_ftp that reference auth.users
    - Add new foreign key constraints that reference profiles table instead
    - This allows local development mode to work without auth.users entries

  2. Security
    - RLS policies remain unchanged and secure
    - Foreign keys now point to profiles table which exists in both dev and production modes
*/

-- Drop existing foreign key constraints from cycling_sessions
ALTER TABLE cycling_sessions
  DROP CONSTRAINT IF EXISTS cycling_sessions_athlete_id_fkey;

ALTER TABLE cycling_sessions
  DROP CONSTRAINT IF EXISTS cycling_sessions_planned_by_coach_id_fkey;

-- Drop existing foreign key constraints from athlete_ftp
ALTER TABLE athlete_ftp
  DROP CONSTRAINT IF EXISTS athlete_ftp_athlete_id_fkey;

ALTER TABLE athlete_ftp
  DROP CONSTRAINT IF EXISTS athlete_ftp_updated_by_fkey;

-- Add new foreign key constraints pointing to profiles table
ALTER TABLE cycling_sessions
  ADD CONSTRAINT cycling_sessions_athlete_id_fkey
  FOREIGN KEY (athlete_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE cycling_sessions
  ADD CONSTRAINT cycling_sessions_planned_by_coach_id_fkey
  FOREIGN KEY (planned_by_coach_id) REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE athlete_ftp
  ADD CONSTRAINT athlete_ftp_athlete_id_fkey
  FOREIGN KEY (athlete_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE athlete_ftp
  ADD CONSTRAINT athlete_ftp_updated_by_fkey
  FOREIGN KEY (updated_by) REFERENCES profiles(id) ON DELETE SET NULL;
