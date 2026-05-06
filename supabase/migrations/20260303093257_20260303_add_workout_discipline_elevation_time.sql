/*
  # Add Workout Sub-Discipline, Elevation, and Scheduled Time

  ## Changes
  - Adds `sub_discipline` column to `workouts` to store sub-type (road, mtb, trail, etc.)
  - Adds `elevation_m` column to `workouts` for planned elevation gain in meters
  - Adds `scheduled_time` column to `workouts` for the planned hour of day
  - Adds `repeat_group_id` to `workout_steps` to link interval+recovery as a pair

  ## Purpose
  Allows richer workout planning with discipline-specific metadata and
  interval pairs (hard + easy) that repeat together.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'sub_discipline'
  ) THEN
    ALTER TABLE workouts ADD COLUMN sub_discipline text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'elevation_m'
  ) THEN
    ALTER TABLE workouts ADD COLUMN elevation_m integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'scheduled_time'
  ) THEN
    ALTER TABLE workouts ADD COLUMN scheduled_time time;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workout_steps' AND column_name = 'repeat_group_id'
  ) THEN
    ALTER TABLE workout_steps ADD COLUMN repeat_group_id text;
  END IF;
END $$;
