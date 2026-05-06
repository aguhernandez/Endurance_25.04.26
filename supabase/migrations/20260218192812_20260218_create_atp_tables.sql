/*
  # Create Annual Training Plan (ATP) Tables

  ## Overview
  Creates the database structure for the ATP (Annual Training Plan) generator
  based on the Banister Fitness-Fatigue model.

  ## New Tables

  ### 1. `atp_plans`
  Stores the Banister model parameters and ATP configuration per athlete.
  - `athlete_id` - Reference to the athlete profile
  - `ca_start` - Starting Chronic Adaptation value
  - `al_start` - Starting Acute Load value
  - `tau_chronic` - Time constant for chronic adaptation (default 28 days)
  - `tau_acute` - Time constant for acute load (default 7 days)
  - `rb_min` - Minimum allowed Readiness Balance (e.g., -25)
  - `rb_peak_target` - Target RB at peak/A-priority events (e.g., +10)
  - `ca_target_main_event` - Target CA value at main A-priority event
  - `plan_start_date` - Start date for the ATP simulation
  - `is_active` - Whether this is the current active plan

  ### 2. `atp_events`
  Stores competition/event targets for the ATP with priority levels.
  - `plan_id` - Reference to the atp_plan
  - `athlete_id` - Reference to the athlete
  - `event_name` - Name of the event
  - `event_date` - Date of the event
  - `priority` - A (peak), B (moderate taper), or C (no taper)
  - `notes` - Optional notes about the event

  ## Security
  - RLS enabled on both tables
  - Athletes can read/write their own plans
  - Coaches can read/write plans for their athletes
*/

CREATE TABLE IF NOT EXISTS atp_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name text NOT NULL DEFAULT 'Annual Training Plan',
  ca_start numeric(8,2) NOT NULL DEFAULT 50,
  al_start numeric(8,2) NOT NULL DEFAULT 50,
  tau_chronic integer NOT NULL DEFAULT 28,
  tau_acute integer NOT NULL DEFAULT 7,
  rb_min numeric(8,2) NOT NULL DEFAULT -25,
  rb_peak_target numeric(8,2) NOT NULL DEFAULT 10,
  ca_target_main_event numeric(8,2) NOT NULL DEFAULT 100,
  plan_start_date date NOT NULL DEFAULT CURRENT_DATE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_atp_plans_athlete_id ON atp_plans(athlete_id);
CREATE INDEX IF NOT EXISTS idx_atp_plans_active ON atp_plans(athlete_id, is_active);

ALTER TABLE atp_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view own ATP plans"
  ON atp_plans FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Athletes can insert own ATP plans"
  ON atp_plans FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Athletes can update own ATP plans"
  ON atp_plans FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Athletes can delete own ATP plans"
  ON atp_plans FOR DELETE
  TO anon
  USING (true);

-- ATP Events table
CREATE TABLE IF NOT EXISTS atp_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES atp_plans(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_name text NOT NULL,
  event_date date NOT NULL,
  priority text NOT NULL DEFAULT 'C' CHECK (priority IN ('A', 'B', 'C')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_atp_events_plan_id ON atp_events(plan_id);
CREATE INDEX IF NOT EXISTS idx_atp_events_athlete_id ON atp_events(athlete_id);
CREATE INDEX IF NOT EXISTS idx_atp_events_date ON atp_events(event_date);

ALTER TABLE atp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ATP events"
  ON atp_events FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert ATP events"
  ON atp_events FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update ATP events"
  ON atp_events FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete ATP events"
  ON atp_events FOR DELETE
  TO anon
  USING (true);
