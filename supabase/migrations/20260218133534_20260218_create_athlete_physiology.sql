/*
  # Create athlete_physiology table

  ## Summary
  This migration creates a shared physiological data table that the LAB satellite
  writes to and the Cycling Planner satellite reads from. This enables real training
  zones (HR and Power) to be defined in the LAB and automatically used when building
  workouts in the Cycling Planner.

  ## New Tables

  ### `athlete_physiology`
  Stores the complete physiological profile of an athlete, including:
  - Heart rate zones (Z1-Z7) with min/max bpm ranges
  - Power zones (Z1-Z5) as % FTP min/max ranges
  - Maximum HR (HRmax)
  - Resting HR (HRrest)
  - VO2max estimate
  - Lactate threshold HR and Power
  - Last updated metadata

  ## Design Decisions
  - One row per athlete (upsert pattern)
  - HR zones stored as separate min/max columns for easy querying
  - Power zones stored as % FTP ranges (not absolute watts, since FTP can change)
  - Source field tracks which app wrote the data (e.g., 'lab', 'manual', 'cycling')
  - Both LAB and Cycling satellites use same Supabase instance, so direct reads are possible

  ## Security
  - RLS enabled
  - Anon and authenticated can read/write (same pattern as profiles, since HUB handles real auth)
*/

CREATE TABLE IF NOT EXISTS athlete_physiology (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES profiles(id),
  
  -- Heart Rate Data
  hr_max integer,
  hr_rest integer,
  
  -- HR Zones (bpm ranges)
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
  
  -- Power Zones (% FTP ranges)
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
  
  -- Additional Physiology
  vo2max numeric,
  lactate_threshold_hr integer,
  lactate_threshold_power_percent integer,
  
  -- Metadata
  source text DEFAULT 'manual',
  notes text,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(athlete_id)
);

CREATE INDEX IF NOT EXISTS idx_athlete_physiology_athlete_id ON athlete_physiology(athlete_id);

ALTER TABLE athlete_physiology ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read athlete physiology"
  ON athlete_physiology
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert athlete physiology"
  ON athlete_physiology
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update athlete physiology"
  ON athlete_physiology
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_athlete_physiology_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_athlete_physiology_updated_at
  BEFORE UPDATE ON athlete_physiology
  FOR EACH ROW
  EXECUTE FUNCTION update_athlete_physiology_updated_at();
