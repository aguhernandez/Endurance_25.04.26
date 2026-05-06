/*
  # Add difficulty_color to workouts table

  1. Changes
    - Adds `difficulty_color` column to `workouts` table
      - Values: 'green' | 'yellow' | 'red' | null
      - Null means not yet computed or no historical data available

  2. Notes
    - This field is computed from the Banister CA model (SSR ratio)
    - Green = easy (SSR < 0.60), Yellow = moderate (SSR 0.60-1.10), Red = hard (SSR > 1.10)
    - Stored so it can be pushed to Hub API and displayed without re-computation
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'difficulty_color'
  ) THEN
    ALTER TABLE workouts ADD COLUMN difficulty_color text CHECK (difficulty_color IN ('green', 'yellow', 'red'));
  END IF;
END $$;
