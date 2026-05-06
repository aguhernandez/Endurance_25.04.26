/*
  # Training Program Templates System
  
  Creates a comprehensive library of pre-built training programs for different
  objectives and disciplines.

  1. New Tables
    - `program_templates`
      - `id` (uuid, primary key)
      - `name` (text) - Program name
      - `description` (text) - Detailed description
      - `objective` (text) - Base, VO2max, Threshold, Race Prep
      - `discipline` (text) - cycling, running, swimming, triathlon
      - `duration_weeks` (int) - Program length
      - `sessions_per_week` (int) - Recommended frequency
      - `level` (text) - beginner, intermediate, advanced
      - `weekly_structure` (jsonb) - Week-by-week plan
      - `is_featured` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `program_templates`
    - Allow public read access for all users
    - Only admins can create/edit templates
*/

CREATE TABLE IF NOT EXISTS program_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  objective text NOT NULL CHECK (objective IN ('base', 'vo2max', 'threshold', 'race_prep')),
  discipline text NOT NULL CHECK (discipline IN ('cycling', 'running', 'swimming', 'triathlon')),
  duration_weeks int NOT NULL CHECK (duration_weeks > 0 AND duration_weeks <= 52),
  sessions_per_week int NOT NULL CHECK (sessions_per_week > 0 AND sessions_per_week <= 14),
  level text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  weekly_structure jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE program_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view program templates"
  ON program_templates
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert program templates"
  ON program_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update program templates"
  ON program_templates
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete program templates"
  ON program_templates
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_program_templates_objective ON program_templates(objective);
CREATE INDEX IF NOT EXISTS idx_program_templates_discipline ON program_templates(discipline);
CREATE INDEX IF NOT EXISTS idx_program_templates_level ON program_templates(level);
CREATE INDEX IF NOT EXISTS idx_program_templates_featured ON program_templates(is_featured) WHERE is_featured = true;
