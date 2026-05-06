/*
  # Weekly Adjustments and Notes System

  1. New Tables
    - `weekly_adjustments`
      - Stores coach/athlete notes and adjustments for each week
      - Links to athlete and week number from ATP
      - Tracks load adjustments, recovery notes, and next week recommendations

  2. Security
    - Enable RLS on `weekly_adjustments` table
    - Athletes can view and update their own weekly notes
    - Coaches can view and update notes for their athletes
    - Admins can view and update all notes

  3. Important Notes
    - Week number aligns with ATP week numbering
    - Supports coach feedback and athlete self-reflection
    - Tracks reason for adjustments (injury, illness, fatigue, etc.)
    - Includes readiness score for next week planning
*/

-- Create weekly_adjustments table
CREATE TABLE IF NOT EXISTS weekly_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_number integer NOT NULL,
  week_start_date date NOT NULL,
  week_end_date date NOT NULL,

  -- Actual vs Planned Analysis
  load_variance_pct numeric(5,2) DEFAULT 0,
  ca_variance numeric(8,2) DEFAULT 0,
  af_variance numeric(8,2) DEFAULT 0,
  rb_variance numeric(8,2) DEFAULT 0,

  -- Athlete Feedback
  athlete_notes text,
  perceived_difficulty integer CHECK (perceived_difficulty >= 1 AND perceived_difficulty <= 10),
  sleep_quality integer CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 10),
  motivation_level integer CHECK (motivation_level >= 1 AND motivation_level <= 10),
  injury_concerns text,

  -- Coach Feedback
  coach_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  coach_notes text,
  adjustment_reason text,
  next_week_recommendation text,

  -- Readiness for Next Week
  readiness_score integer CHECK (readiness_score >= 1 AND readiness_score <= 10),
  recommended_load_adjustment numeric(5,2) DEFAULT 0,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(athlete_id, week_number)
);

-- Enable RLS
ALTER TABLE weekly_adjustments ENABLE ROW LEVEL SECURITY;

-- Athletes can view and update their own weekly adjustments
CREATE POLICY "Athletes can view own weekly adjustments"
  ON weekly_adjustments
  FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Athletes can insert own weekly adjustments"
  ON weekly_adjustments
  FOR INSERT
  TO authenticated
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Athletes can update own weekly adjustments"
  ON weekly_adjustments
  FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid())
  WITH CHECK (athlete_id = auth.uid());

-- Coaches and admins can view all weekly adjustments
CREATE POLICY "Coaches can view all weekly adjustments"
  ON weekly_adjustments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );

-- Coaches can update weekly adjustments (add coach notes)
CREATE POLICY "Coaches can update weekly adjustments"
  ON weekly_adjustments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );

-- Coaches can insert weekly adjustments for their athletes
CREATE POLICY "Coaches can insert weekly adjustments"
  ON weekly_adjustments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_weekly_adjustments_athlete_week
  ON weekly_adjustments(athlete_id, week_number);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_weekly_adjustments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_weekly_adjustments_updated_at
  BEFORE UPDATE ON weekly_adjustments
  FOR EACH ROW
  EXECUTE FUNCTION update_weekly_adjustments_updated_at();