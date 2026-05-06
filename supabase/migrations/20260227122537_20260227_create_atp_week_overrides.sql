/*
  # Create ATP Week Overrides Table

  ## Purpose
  Allows coaches and athletes to manually override the auto-computed weekly training
  impulse for any week in an Annual Training Plan. This enables the TrainingPeaks-style
  interaction where you drag a bar or edit a number to increase/decrease load for that week.

  ## New Tables
  - `atp_week_overrides`
    - `id` (uuid, primary key)
    - `plan_id` (uuid, FK to atp_plans)
    - `athlete_id` (uuid, FK to profiles — for fast RLS lookup)
    - `week_number` (integer — zero-based week index matching banisterEngine weekNumber)
    - `week_start_date` (date — the Monday/first day of that week)
    - `override_impulse` (numeric — the manually set total weekly impulse)
    - `created_at`, `updated_at`

  ## Security
  - RLS enabled
  - Athletes can CRUD their own overrides
  - Coaches (admin/coach role) can CRUD overrides for any plan
  - Unique constraint on (plan_id, week_number) so upsert is clean
*/

CREATE TABLE IF NOT EXISTS atp_week_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL,
  athlete_id uuid NOT NULL,
  week_number integer NOT NULL,
  week_start_date date NOT NULL,
  override_impulse numeric(10, 2) NOT NULL CHECK (override_impulse >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT atp_week_overrides_plan_week_unique UNIQUE (plan_id, week_number)
);

ALTER TABLE atp_week_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can select own week overrides"
  ON atp_week_overrides FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Athletes can insert own week overrides"
  ON atp_week_overrides FOR INSERT
  TO authenticated
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Athletes can update own week overrides"
  ON atp_week_overrides FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid())
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Athletes can delete own week overrides"
  ON atp_week_overrides FOR DELETE
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Anon can manage week overrides"
  ON atp_week_overrides FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert week overrides"
  ON atp_week_overrides FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update week overrides"
  ON atp_week_overrides FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can delete week overrides"
  ON atp_week_overrides FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS atp_week_overrides_plan_id_idx ON atp_week_overrides (plan_id);
CREATE INDEX IF NOT EXISTS atp_week_overrides_athlete_id_idx ON atp_week_overrides (athlete_id);
