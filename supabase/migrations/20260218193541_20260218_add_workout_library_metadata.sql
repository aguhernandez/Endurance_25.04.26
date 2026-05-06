/*
  # Add workout library metadata columns

  ## Overview
  Extends the workouts table with metadata useful for organizing a structured workout library.

  ## Changes to `workouts`
  - `tags` (text[]) — free-form tags for filtering/searching (e.g., 'threshold', 'endurance', 'vo2max')
  - `category` (text) — broad training category: 'endurance', 'threshold', 'vo2max', 'sprint', 'recovery', 'other'
  - `difficulty` (text) — perceived difficulty: 'easy', 'moderate', 'hard', 'very_hard'
  - `is_public` (boolean, default true) — whether this workout appears in the shared library
  - `estimated_tss` (numeric) — Training Stress Score estimate for the workout

  ## Notes
  - All new columns are optional with sensible defaults
  - No existing data is affected
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'tags'
  ) THEN
    ALTER TABLE workouts ADD COLUMN tags text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'category'
  ) THEN
    ALTER TABLE workouts ADD COLUMN category text DEFAULT 'other'
      CHECK (category IN ('endurance', 'threshold', 'vo2max', 'sprint', 'recovery', 'strength', 'other'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE workouts ADD COLUMN difficulty text DEFAULT 'moderate'
      CHECK (difficulty IN ('easy', 'moderate', 'hard', 'very_hard'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'is_public'
  ) THEN
    ALTER TABLE workouts ADD COLUMN is_public boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'estimated_tss'
  ) THEN
    ALTER TABLE workouts ADD COLUMN estimated_tss numeric(6,1);
  END IF;
END $$;
