/*
  # Add cadence_rpm to workout_steps

  Adds an optional cadence field to the workout_steps table, used exclusively
  by cycling workouts to specify target pedaling cadence.

  ## Changes
  - `workout_steps.cadence_rpm` (integer, nullable) — target cadence in RPM, typical range 60–110
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workout_steps' AND column_name = 'cadence_rpm'
  ) THEN
    ALTER TABLE workout_steps ADD COLUMN cadence_rpm integer CHECK (cadence_rpm BETWEEN 30 AND 200);
  END IF;
END $$;
