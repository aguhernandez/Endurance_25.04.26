/*
  # Create Cycling Sessions Table

  1. New Tables
    - `cycling_sessions`
      - **Session Metadata:**
        - `id` (uuid, primary key)
        - `athlete_id` (uuid, required) → references auth.users
        - `session_date` (date, required)
        - `session_name` (text, optional)
        - `planned_by_coach_id` (uuid, optional) → references auth.users
        - `status` (text) - 'planned' or 'completed'
        - `created_at` (timestamptz)
        - `updated_at` (timestamptz)
      
      - **Objective Metrics:**
        - `duration_minutes` (integer, required)
        - `distance_km` (decimal, optional)
        - `avg_power_watts` (integer, optional)
        - `normalized_power` (integer, calculated)
        - `intensity_factor` (decimal, calculated) - NP/FTP
        - `training_load` (integer, calculated) - duration × IF² × 100
        - `time_in_z1` (integer, optional) - minutes in zone 1
        - `time_in_z2` (integer, optional) - minutes in zone 2
        - `time_in_z3` (integer, optional) - minutes in zone 3
        - `time_in_z4` (integer, optional) - minutes in zone 4
        - `time_in_z5` (integer, optional) - minutes in zone 5
      
      - **Subjective Metrics:**
        - `perceived_effort` (integer 1-10, required for completed sessions)
        - `fatigue_level` (integer 1-10, required for completed sessions)
        - `motivation` (integer 1-10, optional)
        - `notes` (text, optional)

  2. Security
    - Enable RLS
    - Athletes can read their own sessions
    - Coaches can read all sessions
    - Athletes can create and update their own completed sessions
    - Coaches can create and update sessions for any athlete

  3. Calculated Fields
    - Intensity Factor (IF) = Normalized Power / FTP
    - Training Load (TL) = Duration × IF² × 100
    - These are calculated via database functions when NP is provided
*/

-- Create cycling_sessions table
CREATE TABLE IF NOT EXISTS cycling_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Session metadata
  athlete_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date date NOT NULL,
  session_name text,
  planned_by_coach_id uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Objective metrics
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  distance_km decimal(10, 2),
  avg_power_watts integer CHECK (avg_power_watts >= 0),
  normalized_power integer CHECK (normalized_power >= 0),
  intensity_factor decimal(4, 2),
  training_load integer,
  
  -- Time in zones (minutes)
  time_in_z1 integer DEFAULT 0 CHECK (time_in_z1 >= 0),
  time_in_z2 integer DEFAULT 0 CHECK (time_in_z2 >= 0),
  time_in_z3 integer DEFAULT 0 CHECK (time_in_z3 >= 0),
  time_in_z4 integer DEFAULT 0 CHECK (time_in_z4 >= 0),
  time_in_z5 integer DEFAULT 0 CHECK (time_in_z5 >= 0),
  
  -- Subjective metrics
  perceived_effort integer CHECK (perceived_effort BETWEEN 1 AND 10),
  fatigue_level integer CHECK (fatigue_level BETWEEN 1 AND 10),
  motivation integer CHECK (motivation BETWEEN 1 AND 10),
  notes text
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sessions_athlete_date ON cycling_sessions(athlete_id, session_date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_coach ON cycling_sessions(planned_by_coach_id);

-- Enable RLS
ALTER TABLE cycling_sessions ENABLE ROW LEVEL SECURITY;

-- Athletes can read their own sessions
CREATE POLICY "Athletes can read own sessions"
  ON cycling_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = athlete_id);

-- Coaches can read all sessions
CREATE POLICY "Coaches can read all sessions"
  ON cycling_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'coach'
    )
  );

-- Athletes can insert their own sessions
CREATE POLICY "Athletes can insert own sessions"
  ON cycling_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = athlete_id);

-- Coaches can insert sessions for any athlete
CREATE POLICY "Coaches can insert sessions for athletes"
  ON cycling_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'coach'
    )
  );

-- Athletes can update their own sessions
CREATE POLICY "Athletes can update own sessions"
  ON cycling_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

-- Coaches can update all sessions
CREATE POLICY "Coaches can update all sessions"
  ON cycling_sessions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'coach'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'coach'
    )
  );

-- Athletes can delete their own sessions
CREATE POLICY "Athletes can delete own sessions"
  ON cycling_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = athlete_id);

-- Coaches can delete all sessions
CREATE POLICY "Coaches can delete all sessions"
  ON cycling_sessions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'coach'
    )
  );

-- Function to calculate IF and TL automatically
CREATE OR REPLACE FUNCTION calculate_session_metrics()
RETURNS TRIGGER AS $$
DECLARE
  athlete_ftp integer;
BEGIN
  -- Only calculate if normalized_power is provided
  IF NEW.normalized_power IS NOT NULL AND NEW.normalized_power > 0 THEN
    -- Get athlete's current FTP
    SELECT current_ftp_watts INTO athlete_ftp
    FROM athlete_ftp
    WHERE athlete_id = NEW.athlete_id;
    
    -- Calculate IF and TL if FTP exists
    IF athlete_ftp IS NOT NULL AND athlete_ftp > 0 THEN
      NEW.intensity_factor = ROUND((NEW.normalized_power::decimal / athlete_ftp::decimal), 2);
      NEW.training_load = ROUND((NEW.duration_minutes * POWER(NEW.intensity_factor, 2) * 100)::numeric);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate metrics
CREATE TRIGGER calculate_metrics_on_insert_update
  BEFORE INSERT OR UPDATE ON cycling_sessions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_session_metrics();

-- Trigger for updated_at
CREATE TRIGGER set_session_updated_at
  BEFORE UPDATE ON cycling_sessions
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();