/*
  # Fix workouts RLS INSERT policy

  The updated workouts table was missing an INSERT policy for the new columns,
  causing "violates row-level security policy" errors when saving workouts.
  
  This migration adds the necessary INSERT policy that allows:
  - Coaches and admins to create new workouts
  - Athletes to create planned workout sessions for themselves
*/

-- Drop problematic policies that don't include INSERT
DROP POLICY IF EXISTS "All authenticated users can view workouts" ON workouts;
DROP POLICY IF EXISTS "Coaches and admins can update own workouts" ON workouts;

-- Add proper INSERT policy for coaches and admins creating workouts
CREATE POLICY "Coaches and admins can insert workouts"
  ON workouts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = coach_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );

-- Add proper INSERT policy for athletes creating planned sessions
CREATE POLICY "Athletes can insert planned sessions"
  ON workouts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = athlete_id
    OR (
      auth.uid() = coach_id
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('coach', 'admin')
      )
    )
  );

-- Add SELECT policy
CREATE POLICY "All authenticated users can view workouts"
  ON workouts FOR SELECT
  TO authenticated
  USING (
    coach_id = auth.uid()
    OR athlete_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );

-- Add UPDATE policy
CREATE POLICY "Coaches and admins can update workouts"
  ON workouts FOR UPDATE
  TO authenticated
  USING (
    coach_id = auth.uid()
    OR athlete_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  )
  WITH CHECK (
    coach_id = auth.uid()
    OR athlete_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );

-- Keep existing DELETE policy
CREATE POLICY "Coaches and admins can delete workouts"
  ON workouts FOR DELETE
  TO authenticated
  USING (
    coach_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );
