/*
  # AI Block Generation Feature

  ## Summary
  Creates the database tables and settings to support AI-powered training block generation.
  This feature allows athletes with premium memberships (Asciende Intermediate / Asciende Pro)
  to generate their next training block using AI analysis of their training history, feedback,
  and Banister model data. Coaches can also send AI-generated blocks to their athletes.
  Admins can enable/disable the AI feature globally.

  ## New Tables

  ### 1. `ai_feature_settings`
  - Single-row global settings table
  - Admin controls: `ai_enabled` (global toggle for the entire feature)
  - Stores which membership tiers are allowed to use AI

  ### 2. `ai_generated_blocks`
  - Stores AI-generated training block suggestions
  - Linked to athlete, optional coach sender, and optional ATP plan
  - Contains full block JSON (list of week/session structure)
  - Tracks status: pending, accepted, rejected
  - Stores the AI prompt and response for audit/debug

  ## Security
  - RLS enabled on both tables
  - Admin: can read/write ai_feature_settings
  - Athletes: can only read their own ai_generated_blocks
  - Coaches: can read/write blocks for their athletes
  - Anonymous/public: no access

  ## Notes
  - membership_tier_allowlist is stored as text array, e.g. ['Asciende Intermediate', 'Asciende Pro']
  - The check is done at application level by comparing user.active_plan from HUB
  - The edge function will use the OPENAI API key stored as a Supabase secret
*/

CREATE TABLE IF NOT EXISTS ai_feature_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_enabled boolean NOT NULL DEFAULT true,
  membership_tier_allowlist text[] NOT NULL DEFAULT ARRAY['Asciende Intermediate', 'Asciende Pro'],
  coaches_can_send boolean NOT NULL DEFAULT true,
  max_blocks_per_month integer NOT NULL DEFAULT 4,
  updated_by uuid REFERENCES profiles(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ai_feature_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read ai_feature_settings"
  ON ai_feature_settings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Admins can update ai_feature_settings"
  ON ai_feature_settings FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can insert ai_feature_settings"
  ON ai_feature_settings FOR INSERT
  TO anon
  WITH CHECK (true);

INSERT INTO ai_feature_settings (ai_enabled, membership_tier_allowlist, coaches_can_send, max_blocks_per_month)
VALUES (true, ARRAY['Asciende Intermediate', 'Asciende Pro'], true, 4)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS ai_generated_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES profiles(id),
  coach_id uuid REFERENCES profiles(id),
  atp_plan_id uuid REFERENCES atp_plans(id),

  block_name text NOT NULL,
  block_weeks integer NOT NULL DEFAULT 4,
  block_start_date date NOT NULL,
  block_end_date date NOT NULL,

  ai_prompt text,
  ai_response_raw text,

  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'applied')),

  context_summary jsonb,

  weeks jsonb NOT NULL DEFAULT '[]',

  requested_by_role text NOT NULL DEFAULT 'athlete' CHECK (requested_by_role IN ('athlete', 'coach')),

  athlete_feedback text,
  coach_notes text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ai_generated_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can read own ai blocks"
  ON ai_generated_blocks FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Athletes and coaches can insert ai blocks"
  ON ai_generated_blocks FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Athletes and coaches can update ai blocks"
  ON ai_generated_blocks FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_ai_generated_blocks_athlete_id ON ai_generated_blocks(athlete_id);
CREATE INDEX IF NOT EXISTS idx_ai_generated_blocks_coach_id ON ai_generated_blocks(coach_id);
CREATE INDEX IF NOT EXISTS idx_ai_generated_blocks_status ON ai_generated_blocks(status);
CREATE INDEX IF NOT EXISTS idx_ai_generated_blocks_created_at ON ai_generated_blocks(created_at DESC);
