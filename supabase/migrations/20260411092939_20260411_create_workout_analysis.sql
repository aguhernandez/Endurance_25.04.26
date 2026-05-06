/*
  # Create workout_analysis table

  ## Summary
  Creates a dedicated analysis table that stores computed metrics for every completed workout.
  Kept separate from the `workouts` table to allow re-calculation, versioning, and future ML use.

  ## New Tables
  - `workout_analysis`
    - `id` (uuid, PK)
    - `workout_id` (uuid, FK → workouts.id)
    - `athlete_id` (uuid, references profiles.id)
    - `completion_score` (numeric 0-100): how closely the athlete matched the planned duration/intensity
    - `intensity_score` (numeric 0-100): quality of intensity execution vs plan
    - `load_score` (numeric 0-100): actual vs planned impulse ratio clamped
    - `final_score` (numeric 0-100): weighted composite
    - `classification` (text): 'green' | 'yellow' | 'red'
    - `impulse_planned` (numeric): expected training impulse from workout plan
    - `impulse_actual` (numeric): computed actual impulse
    - `fitness` (numeric): Chronic Training Load (CA) after this session
    - `fatigue` (numeric): Acute Training Load (AL) after this session
    - `form` (numeric): readiness / form = fitness - fatigue
    - `time_in_zones` (jsonb): seconds per zone {z1..z5}
    - `deviations` (jsonb): array of deviation objects with field/planned/actual/pct
    - `insights` (jsonb): array of insight strings
    - `wellness` (jsonb): wellness data at time of analysis (nullable)
    - `analysis_version` (int): for future re-calc versioning
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Athletes can read their own analysis
  - System (service role) inserts via anonymous policies for now since auth may be Hub-based
*/

CREATE TABLE IF NOT EXISTS workout_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workouts(id) ON DELETE CASCADE,
  athlete_id text NOT NULL,
  completion_score numeric(5,2) NOT NULL DEFAULT 0,
  intensity_score numeric(5,2) NOT NULL DEFAULT 0,
  load_score numeric(5,2) NOT NULL DEFAULT 0,
  final_score numeric(5,2) NOT NULL DEFAULT 0,
  classification text NOT NULL DEFAULT 'green' CHECK (classification IN ('green', 'yellow', 'red')),
  impulse_planned numeric(8,3) NOT NULL DEFAULT 0,
  impulse_actual numeric(8,3) NOT NULL DEFAULT 0,
  fitness numeric(8,3) NOT NULL DEFAULT 0,
  fatigue numeric(8,3) NOT NULL DEFAULT 0,
  form numeric(8,3) NOT NULL DEFAULT 0,
  time_in_zones jsonb,
  deviations jsonb,
  insights jsonb,
  wellness jsonb,
  analysis_version int NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workout_analysis_workout_id ON workout_analysis(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_analysis_athlete_id ON workout_analysis(athlete_id);
CREATE INDEX IF NOT EXISTS idx_workout_analysis_created_at ON workout_analysis(created_at DESC);

ALTER TABLE workout_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can read own workout analysis"
  ON workout_analysis
  FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid()::text);

CREATE POLICY "Anonymous users can read workout analysis"
  ON workout_analysis
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can insert workout analysis"
  ON workout_analysis
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert own workout analysis"
  ON workout_analysis
  FOR INSERT
  TO authenticated
  WITH CHECK (athlete_id = auth.uid()::text);

CREATE POLICY "Anonymous users can update workout analysis"
  ON workout_analysis
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
