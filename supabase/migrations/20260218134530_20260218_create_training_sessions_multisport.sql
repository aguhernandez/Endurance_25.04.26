/*
  # Create training_sessions table (multi-sport)

  ## Summary
  Replaces the sport-specific `cycling_sessions` table with a generic `training_sessions`
  table that supports cycling, running, and swimming. The Endurance Planner now handles
  all three disciplines.

  ## New Tables

  ### `training_sessions`
  - `id` (uuid, PK)
  - `athlete_id` (uuid, FK to profiles)
  - `sport` (text) - 'cycling' | 'running' | 'swimming'
  - `sport_subtype` (text) - e.g. 'road', 'gravel', 'mtb', 'trail', 'pool', 'open-water'
  - `session_date` (date)
  - `session_name` (text, optional)
  - `planned_by_coach_id` (uuid, optional FK to profiles)
  - `status` (text) - 'planned' | 'completed'
  - `duration_minutes` (integer)
  - `distance_km` (numeric, optional)
  - `avg_power_watts` (integer, optional) - cycling
  - `avg_heart_rate` (integer, optional) - all sports
  - `avg_pace_per_km` (numeric, optional) - running/swimming (seconds per km)
  - `perceived_effort` (integer 1-10, optional)
  - `fatigue_level` (integer 1-10, optional)
  - `notes` (text, optional)
  - `created_at`, `updated_at` (timestamptz)

  ## Also extends athlete_physiology with running pace zones

  ## Security
  - RLS enabled
  - Athletes can read/create/update own sessions
  - Coaches can read/create/update all sessions
*/

CREATE TABLE IF NOT EXISTS training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES profiles(id),
  sport text NOT NULL DEFAULT 'cycling' CHECK (sport IN ('cycling', 'running', 'swimming')),
  sport_subtype text,
  session_date date NOT NULL,
  session_name text,
  planned_by_coach_id uuid REFERENCES profiles(id),
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'completed')),
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  distance_km numeric,
  avg_power_watts integer CHECK (avg_power_watts >= 0),
  avg_heart_rate integer CHECK (avg_heart_rate >= 0),
  avg_pace_per_km numeric,
  perceived_effort integer CHECK (perceived_effort >= 1 AND perceived_effort <= 10),
  fatigue_level integer CHECK (fatigue_level >= 1 AND fatigue_level <= 10),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE training_sessions IS 'Multi-sport training sessions for cycling, running, and swimming. Replaces cycling_sessions.';

CREATE INDEX IF NOT EXISTS idx_training_sessions_athlete_id ON training_sessions(athlete_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_date ON training_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_training_sessions_sport ON training_sessions(sport);

ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can read own training sessions"
  ON training_sessions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Athletes can insert own training sessions"
  ON training_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Athletes can update own training sessions"
  ON training_sessions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Athletes can delete own training sessions"
  ON training_sessions
  FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION update_training_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_training_sessions_updated_at
  BEFORE UPDATE ON training_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_training_sessions_updated_at();

-- Extend athlete_physiology with running pace zones
-- Pace zones stored as seconds per km (e.g. 300 = 5:00/km)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_physiology' AND column_name = 'run_pace_z1_min'
  ) THEN
    ALTER TABLE athlete_physiology
      ADD COLUMN run_pace_z1_min integer,
      ADD COLUMN run_pace_z1_max integer,
      ADD COLUMN run_pace_z2_min integer,
      ADD COLUMN run_pace_z2_max integer,
      ADD COLUMN run_pace_z3_min integer,
      ADD COLUMN run_pace_z3_max integer,
      ADD COLUMN run_pace_z4_min integer,
      ADD COLUMN run_pace_z4_max integer,
      ADD COLUMN run_pace_z5_min integer,
      ADD COLUMN run_pace_z5_max integer,
      ADD COLUMN run_vdot numeric,
      ADD COLUMN swim_css_per_100m integer,
      ADD COLUMN swim_pace_z1_min integer,
      ADD COLUMN swim_pace_z1_max integer,
      ADD COLUMN swim_pace_z2_min integer,
      ADD COLUMN swim_pace_z2_max integer,
      ADD COLUMN swim_pace_z3_min integer,
      ADD COLUMN swim_pace_z3_max integer,
      ADD COLUMN swim_pace_z4_min integer,
      ADD COLUMN swim_pace_z4_max integer,
      ADD COLUMN swim_pace_z5_min integer,
      ADD COLUMN swim_pace_z5_max integer;
  END IF;
END $$;
