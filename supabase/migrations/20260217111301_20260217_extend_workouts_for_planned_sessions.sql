/*
  # Extend workouts table for planned training sessions

  1. Changes to workouts table
    - Add `athlete_id` (uuid, foreign key) - The athlete assigned to this workout
    - Add `status` (text) - 'planned', 'in_progress', 'completed', 'skipped'
    - Add `estimated_duration_minutes` (integer) - Estimated duration for planned workouts
    - Add `estimated_impulse` (integer) - Planned impulse/training load
    - Add `actual_duration_minutes` (integer) - Actual duration when completed
    - Add `actual_impulse` (integer) - Actual impulse when completed
    - Add `actual_avg_intensity_percent_ftp` (numeric) - Actual intensity when completed
    - Add `rpe` (integer) - Rate of Perceived Exertion (0-10)
    - Add `notes` (text) - Session notes/observations
    - Add `completed_at` (timestamptz) - When the session was completed

  2. New Tables
    - `daily_load` - Daily accumulated impulse per athlete
      - `id` (uuid, primary key)
      - `athlete_id` (uuid, foreign key to profiles)
      - `date` (date) - The date for this load calculation
      - `planned_impulse` (integer) - Accumulated planned impulse
      - `actual_impulse` (integer) - Accumulated actual impulse
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `performance_state` - CT, AL, RB metrics per athlete per day
      - `id` (uuid, primary key)
      - `athlete_id` (uuid, foreign key to profiles)
      - `date` (date) - The calculation date
      - `ct` (integer) - Chronic Training load (14-day rolling average)
      - `al` (integer) - Acute Training load (7-day rolling average)
      - `rb` (integer) - Training Stress Balance (CT - AL)
      - `twl` (numeric) - Training Wellness Level (from subjective ratings)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  3. Security
    - Enable RLS on all new columns and tables
    - Athletes can view/edit their own sessions
    - Coaches and admins can manage athlete sessions
*/

-- Add columns to workouts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'athlete_id'
  ) THEN
    ALTER TABLE workouts ADD COLUMN athlete_id uuid REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'status'
  ) THEN
    ALTER TABLE workouts ADD COLUMN status text DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'skipped'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'estimated_duration_minutes'
  ) THEN
    ALTER TABLE workouts ADD COLUMN estimated_duration_minutes integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'estimated_impulse'
  ) THEN
    ALTER TABLE workouts ADD COLUMN estimated_impulse integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'actual_duration_minutes'
  ) THEN
    ALTER TABLE workouts ADD COLUMN actual_duration_minutes integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'actual_impulse'
  ) THEN
    ALTER TABLE workouts ADD COLUMN actual_impulse integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'actual_avg_intensity_percent_ftp'
  ) THEN
    ALTER TABLE workouts ADD COLUMN actual_avg_intensity_percent_ftp numeric(5,1);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'rpe'
  ) THEN
    ALTER TABLE workouts ADD COLUMN rpe integer CHECK (rpe >= 0 AND rpe <= 10);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'notes'
  ) THEN
    ALTER TABLE workouts ADD COLUMN notes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE workouts ADD COLUMN completed_at timestamptz;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workouts_athlete_id ON workouts(athlete_id);
CREATE INDEX IF NOT EXISTS idx_workouts_status ON workouts(status);
CREATE INDEX IF NOT EXISTS idx_workouts_scheduled_date ON workouts(scheduled_date);

-- Create daily_load table
CREATE TABLE IF NOT EXISTS daily_load (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  planned_impulse integer DEFAULT 0,
  actual_impulse integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(athlete_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_load_athlete_date ON daily_load(athlete_id, date);

-- Create performance_state table
CREATE TABLE IF NOT EXISTS performance_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  ct integer,
  al integer,
  rb integer,
  twl numeric(4,1),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(athlete_id, date)
);

CREATE INDEX IF NOT EXISTS idx_performance_state_athlete_date ON performance_state(athlete_id, date);

-- Enable RLS on new tables
ALTER TABLE daily_load ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_state ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_load
CREATE POLICY "Athletes can view own daily load"
  ON daily_load FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('coach', 'admin')
  ));

CREATE POLICY "Athletes can update own daily load"
  ON daily_load FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('coach', 'admin')
  ))
  WITH CHECK (athlete_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('coach', 'admin')
  ));

-- RLS Policies for performance_state
CREATE POLICY "Athletes can view own performance state"
  ON performance_state FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('coach', 'admin')
  ));

CREATE POLICY "Athletes can update own performance state"
  ON performance_state FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('coach', 'admin')
  ))
  WITH CHECK (athlete_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('coach', 'admin')
  ));

-- Update workouts RLS to include athlete access
DROP POLICY IF EXISTS "All authenticated users can view workouts" ON workouts;
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

DROP POLICY IF EXISTS "Coaches and admins can update own workouts" ON workouts;
CREATE POLICY "Coaches and admins can update own workouts"
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
