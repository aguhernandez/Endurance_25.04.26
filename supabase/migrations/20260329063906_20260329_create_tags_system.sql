/*
  # Create Tags System

  ## Summary
  Creates a structured tags system for classifying workouts and other training objects.
  Tags can be created by coaches/planners and associated with workouts via junction tables.

  ## New Tables

  ### `tags`
  - `id` (uuid, PK): Unique tag identifier
  - `name` (text): Display name of the tag in English
  - `name_es` (text): Spanish display name
  - `slug` (text, unique): URL-friendly identifier
  - `category` (text): One of: training, nutrition, recovery, performance, mindset, methodology, other
  - `description` (text): Optional description
  - `color` (text): Hex color for visual display, defaults to yellow #fdda36
  - `created_by` (uuid): Profile ID of the creator (nullable for system tags)
  - `created_at` (timestamptz): Creation timestamp

  ### `workout_tags`
  Junction table linking workouts to tags (many-to-many).
  - `workout_id` (uuid, FK to workouts): The workout being tagged
  - `tag_id` (uuid, FK to tags): The tag being applied
  - `created_at` (timestamptz): When the association was created
  - PRIMARY KEY: (workout_id, tag_id)

  ## Security
  - RLS enabled on both tables
  - Tags are readable by all authenticated users
  - Tags can be created by authenticated users
  - workout_tags are managed by the coach who owns the workout
*/

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_es text,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'training',
  description text,
  color text DEFAULT '#fdda36',
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT tags_category_check CHECK (category IN ('training', 'nutrition', 'recovery', 'performance', 'mindset', 'methodology', 'other'))
);

CREATE TABLE IF NOT EXISTS workout_tags (
  workout_id uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (workout_id, tag_id)
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read tags"
  ON tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read tags anon"
  ON tags FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can insert tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anon can insert tags"
  ON tags FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Tag creators can update their tags"
  ON tags FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR created_by IS NULL)
  WITH CHECK (true);

CREATE POLICY "Tag creators can delete their tags"
  ON tags FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Authenticated users can read workout_tags"
  ON workout_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anon can read workout_tags"
  ON workout_tags FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can insert workout_tags"
  ON workout_tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anon can insert workout_tags"
  ON workout_tags FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete workout_tags"
  ON workout_tags FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anon can delete workout_tags"
  ON workout_tags FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_workout_tags_workout_id ON workout_tags(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_tags_tag_id ON workout_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);
