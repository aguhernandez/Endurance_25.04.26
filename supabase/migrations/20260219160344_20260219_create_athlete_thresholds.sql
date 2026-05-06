/*
  # Create athlete_thresholds table

  ## Purpose
  This table stores the training thresholds and zones for each athlete,
  sent from satellite apps like LAB (Endurance Planner).
  The Planner reads from this table to plan workouts based on the athlete's
  current physiological data.

  ## New Tables

  ### `athlete_thresholds`
  Central store of athlete training zones & thresholds:

  #### Identity
  - `athlete_id` - HUB user ID
  - `source_satellite` - which satellite sent this data
  - `updated_at` - when last synced

  #### Cycling Thresholds
  - `ftp_watts` - Functional Threshold Power
  - `power_z1_min/max` through `power_z5_min/max` - power zones in watts

  #### Heart Rate Thresholds
  - `hr_max` - maximum heart rate
  - `hr_rest` - resting heart rate
  - `lactate_threshold_hr` - LTHR
  - `hr_z1_min/max` through `hr_z7_min/max` - HR zones in bpm

  #### Running Thresholds
  - `run_vdot` - Jack Daniels VDOT
  - `run_lthr` - Running LTHR
  - `run_pace_z1_min/max` through `run_pace_z5_min/max` - pace zones in sec/km

  #### Swimming Thresholds
  - `swim_css_sec_per_100m` - Critical Swim Speed
  - `swim_pace_z1_min/max` through `swim_pace_z5_min/max` - swim pace zones

  #### General
  - `vo2max` - VO2 max estimate

  ## Security
  - RLS enabled
  - Anon can insert/update (for satellite sync)
  - Anon can read (for Planner to consume)
*/

CREATE TABLE IF NOT EXISTS athlete_thresholds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id text NOT NULL UNIQUE,
  source_satellite text NOT NULL DEFAULT 'lab',

  ftp_watts integer,

  power_z1_min integer,
  power_z1_max integer,
  power_z2_min integer,
  power_z2_max integer,
  power_z3_min integer,
  power_z3_max integer,
  power_z4_min integer,
  power_z4_max integer,
  power_z5_min integer,
  power_z5_max integer,

  hr_max integer,
  hr_rest integer,
  lactate_threshold_hr integer,
  hr_z1_min integer,
  hr_z1_max integer,
  hr_z2_min integer,
  hr_z2_max integer,
  hr_z3_min integer,
  hr_z3_max integer,
  hr_z4_min integer,
  hr_z4_max integer,
  hr_z5_min integer,
  hr_z5_max integer,
  hr_z6_min integer,
  hr_z6_max integer,
  hr_z7_min integer,
  hr_z7_max integer,

  run_vdot numeric,
  run_lthr integer,
  run_pace_z1_min integer,
  run_pace_z1_max integer,
  run_pace_z2_min integer,
  run_pace_z2_max integer,
  run_pace_z3_min integer,
  run_pace_z3_max integer,
  run_pace_z4_min integer,
  run_pace_z4_max integer,
  run_pace_z5_min integer,
  run_pace_z5_max integer,

  swim_css_sec_per_100m integer,
  swim_pace_z1_min integer,
  swim_pace_z1_max integer,
  swim_pace_z2_min integer,
  swim_pace_z2_max integer,
  swim_pace_z3_min integer,
  swim_pace_z3_max integer,
  swim_pace_z4_min integer,
  swim_pace_z4_max integer,
  swim_pace_z5_min integer,
  swim_pace_z5_max integer,

  vo2max numeric,

  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE athlete_thresholds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert athlete thresholds"
  ON athlete_thresholds FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can read athlete thresholds"
  ON athlete_thresholds FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can update athlete thresholds"
  ON athlete_thresholds FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_athlete_thresholds_athlete_id ON athlete_thresholds(athlete_id);
