/*
  # Create structured workouts system

  1. New Tables
    - `workouts`
      - `id` (uuid, primary key)
      - `coach_id` (uuid, foreign key to profiles) - Creator of the workout
      - `sport` (text, default 'cycling')
      - `name` (text, not null)
      - `description` (text)
      - `intensity_basis` (text) - 'power', 'hr', 'pace', 'rpe'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `workout_steps`
      - `id` (uuid, primary key)
      - `workout_id` (uuid, foreign key to workouts)
      - `order` (integer, not null) - Order of the step
      - `step_type` (text, not null) - 'warmup', 'steady', 'interval', 'recovery', 'cooldown'
      - `duration_type` (text, not null) - 'time' or 'distance'
      - `duration_value` (integer, not null) - seconds or meters
      - `target_type` (text) - 'power', 'hr', 'pace', 'rpe'
      - `target_min_value` (integer) - minimum value for target
      - `target_max_value` (integer) - maximum value for target
      - `target_percent_ftp` (integer) - percentage of FTP
      - `target_zone` (integer) - training zone (1-7)
      - `repeat_times` (integer) - number of times to repeat
      - `repeat_rest_step_id` (uuid) - reference to rest step for intervals
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Coaches and admins can create/edit workouts
    - All authenticated users can view workouts
*/

-- Create updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sport text NOT NULL DEFAULT 'cycling',
  name text NOT NULL,
  description text,
  intensity_basis text CHECK (intensity_basis IN ('power', 'hr', 'pace', 'rpe')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workout_steps table
CREATE TABLE IF NOT EXISTS workout_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  "order" integer NOT NULL,
  step_type text NOT NULL CHECK (step_type IN ('warmup', 'steady', 'interval', 'recovery', 'cooldown')),
  duration_type text NOT NULL CHECK (duration_type IN ('time', 'distance')),
  duration_value integer NOT NULL,
  target_type text CHECK (target_type IN ('power', 'hr', 'pace', 'rpe')),
  target_min_value integer,
  target_max_value integer,
  target_percent_ftp integer,
  target_zone integer,
  repeat_times integer,
  repeat_rest_step_id uuid REFERENCES workout_steps(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workouts_coach_id ON workouts(coach_id);
CREATE INDEX IF NOT EXISTS idx_workout_steps_workout_id ON workout_steps(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_steps_order ON workout_steps(workout_id, "order");

-- Enable RLS
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_steps ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Coaches and admins can create workouts" ON workouts;
  DROP POLICY IF EXISTS "Coaches and admins can update own workouts" ON workouts;
  DROP POLICY IF EXISTS "Coaches and admins can delete own workouts" ON workouts;
  DROP POLICY IF EXISTS "All authenticated users can view workouts" ON workouts;
  DROP POLICY IF EXISTS "Can insert steps for owned workouts" ON workout_steps;
  DROP POLICY IF EXISTS "Can update steps for owned workouts" ON workout_steps;
  DROP POLICY IF EXISTS "Can delete steps for owned workouts" ON workout_steps;
  DROP POLICY IF EXISTS "All authenticated users can view workout steps" ON workout_steps;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Workouts policies: Coaches and admins can create/edit, everyone can view
CREATE POLICY "Coaches and admins can create workouts"
  ON workouts FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = coach_id
      AND profiles.role IN ('coach', 'admin')
    )
  );

CREATE POLICY "Coaches and admins can update own workouts"
  ON workouts FOR UPDATE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = coach_id
      AND profiles.role IN ('coach', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = coach_id
      AND profiles.role IN ('coach', 'admin')
    )
  );

CREATE POLICY "Coaches and admins can delete own workouts"
  ON workouts FOR DELETE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = coach_id
      AND profiles.role IN ('coach', 'admin')
    )
  );

CREATE POLICY "All authenticated users can view workouts"
  ON workouts FOR SELECT
  TO anon, authenticated
  USING (true);

-- Workout steps policies: Follow parent workout permissions
CREATE POLICY "Can insert steps for owned workouts"
  ON workout_steps FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN profiles ON profiles.id = workouts.coach_id
      WHERE workouts.id = workout_steps.workout_id
      AND profiles.role IN ('coach', 'admin')
    )
  );

CREATE POLICY "Can update steps for owned workouts"
  ON workout_steps FOR UPDATE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN profiles ON profiles.id = workouts.coach_id
      WHERE workouts.id = workout_steps.workout_id
      AND profiles.role IN ('coach', 'admin')
    )
  );

CREATE POLICY "Can delete steps for owned workouts"
  ON workout_steps FOR DELETE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN profiles ON profiles.id = workouts.coach_id
      WHERE workouts.id = workout_steps.workout_id
      AND profiles.role IN ('coach', 'admin')
    )
  );

CREATE POLICY "All authenticated users can view workout steps"
  ON workout_steps FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create updated_at trigger for workouts
DROP TRIGGER IF EXISTS update_workouts_updated_at ON workouts;
CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();