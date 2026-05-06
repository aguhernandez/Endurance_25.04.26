/*
  # Create admin_config table

  1. New Tables
    - `admin_config`
      - `id` (uuid, primary key)
      - `key` (text, unique) — config key name
      - `value` (text) — config value
      - `description` (text) — human readable description
      - `updated_by` (text) — admin user id who last changed it
      - `updated_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Only admin profiles can read/update (checked via profiles table role column)

  3. Seed
    - Insert default hub_planner_token row (empty value)
*/

CREATE TABLE IF NOT EXISTS admin_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  updated_by text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin_config"
  ON admin_config FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.role = 'admin'
      AND (
        profiles.hub_user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
        OR profiles.id::text = (current_setting('request.jwt.claims', true)::json->>'sub')
      )
    )
  );

CREATE POLICY "Admins can update admin_config"
  ON admin_config FOR UPDATE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.role = 'admin'
      AND (
        profiles.hub_user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
        OR profiles.id::text = (current_setting('request.jwt.claims', true)::json->>'sub')
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.role = 'admin'
      AND (
        profiles.hub_user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
        OR profiles.id::text = (current_setting('request.jwt.claims', true)::json->>'sub')
      )
    )
  );

INSERT INTO admin_config (key, value, description) VALUES
  ('hub_planner_token', '', 'Token de tipo "endurance" emitido por el Hub (X-Planner-Token)')
ON CONFLICT (key) DO NOTHING;
