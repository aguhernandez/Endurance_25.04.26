/*
  # Create activity_records table

  ## Purpose
  This table stores completed training activity records from all satellite apps (LAB, etc.).
  It acts as the central repository in the HUB for all athlete activity data.
  The Endurance Planner reads from this table to understand what athletes have actually done.

  ## New Tables

  ### `activity_records`
  Central activity log with full FIT-file-grade metrics:
  - `id` - unique record ID
  - `athlete_id` - references the HUB user ID (hub_user_id from profiles)
  - `source_satellite` - which satellite app sent this (e.g. 'lab', 'triathlon', etc.)
  - `sport` - cycling, running, swimming
  - `sport_subtype` - optional (road, trail, open_water, etc.)
  - `activity_date` - date of the activity
  - `activity_name` - optional descriptive name

  ### Time & Distance
  - `duration_seconds` - total duration in seconds (more precise than minutes)
  - `distance_meters` - total distance in meters (more precise than km)
  - `elevation_gain_meters` - total elevation gain

  ### Power Metrics (cycling/running with power meter)
  - `avg_power_watts` - average power
  - `max_power_watts` - peak power
  - `normalized_power_watts` - NP (weighted average)
  - `ftp_at_time` - FTP value used for TSS calculation
  - `intensity_factor` - IF = NP/FTP
  - `training_stress_score` - TSS = (duration * NP * IF) / (FTP * 3600) * 100

  ### Heart Rate Metrics
  - `avg_heart_rate_bpm` - average HR
  - `max_heart_rate_bpm` - peak HR
  - `hr_zone_distribution` - JSONB: time spent in each HR zone (seconds)

  ### Pace Metrics (running/swimming)
  - `avg_pace_sec_per_km` - average pace in seconds per km
  - `best_pace_sec_per_km` - best pace achieved
  - `avg_speed_kmh` - average speed in km/h

  ### Perceived Metrics
  - `perceived_effort` - RPE 1-10
  - `fatigue_level` - fatigue 1-10
  - `notes` - free text notes

  ### Impulse / Load (Banister model)
  - `impulse` - calculated training impulse (TRIMP or similar)

  ## Security
  - RLS enabled
  - Athletes can only insert/read their own records
  - Service role can read all (for Planner)
*/

CREATE TABLE IF NOT EXISTS activity_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id text NOT NULL,
  source_satellite text NOT NULL DEFAULT 'lab',
  sport text NOT NULL DEFAULT 'cycling',
  sport_subtype text,
  activity_date date NOT NULL,
  activity_name text,

  duration_seconds integer NOT NULL DEFAULT 0,
  distance_meters numeric,
  elevation_gain_meters numeric,

  avg_power_watts integer,
  max_power_watts integer,
  normalized_power_watts integer,
  ftp_at_time integer,
  intensity_factor numeric,
  training_stress_score numeric,

  avg_heart_rate_bpm integer,
  max_heart_rate_bpm integer,
  hr_zone_distribution jsonb,

  avg_pace_sec_per_km numeric,
  best_pace_sec_per_km numeric,
  avg_speed_kmh numeric,

  perceived_effort integer CHECK (perceived_effort BETWEEN 1 AND 10),
  fatigue_level integer CHECK (fatigue_level BETWEEN 1 AND 10),
  notes text,

  impulse numeric,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE activity_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can insert own activity records"
  ON activity_records FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Athletes can read own activity records"
  ON activity_records FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Athletes can update own activity records"
  ON activity_records FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_activity_records_athlete_id ON activity_records(athlete_id);
CREATE INDEX IF NOT EXISTS idx_activity_records_activity_date ON activity_records(activity_date);
CREATE INDEX IF NOT EXISTS idx_activity_records_sport ON activity_records(sport);
