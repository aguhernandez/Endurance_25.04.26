/*
  # Add scheduled_date to workouts table

  1. Changes
    - Add `scheduled_date` column to workouts table to track when a workout is scheduled
    - This allows workouts to appear in the calendar on the specific date they were created for

  2. Migration Details
    - Column: `scheduled_date` (date, nullable, updatable)
    - Allows tracking which date a workout was planned for
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'scheduled_date'
  ) THEN
    ALTER TABLE workouts ADD COLUMN scheduled_date date;
  END IF;
END $$;
