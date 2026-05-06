/*
  # Add is_library flag to workouts

  ## Summary
  Adds a boolean `is_library` column to the `workouts` table to distinguish
  between workouts created as reusable library templates vs. workouts created
  specifically for an athlete's training schedule.

  ## Changes
  - `workouts.is_library` (boolean, default false): When true, the workout is
    a reusable template visible in the workout library. When false, the workout
    was built specifically for an athlete's schedule and should not appear in
    the library.

  ## Migration logic
  - Existing workouts that have no `scheduled_date` and no `scheduled_time`
    are treated as library templates (is_library = true).
  - Existing workouts that have a `scheduled_date` are treated as personal/
    scheduled workouts (is_library = false).
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'is_library'
  ) THEN
    ALTER TABLE workouts ADD COLUMN is_library boolean NOT NULL DEFAULT false;
  END IF;
END $$;

UPDATE workouts
SET is_library = true
WHERE scheduled_date IS NULL AND is_library = false;
