/*
  # Allow anonymous access to workouts and workout_steps

  1. Changes
    - Add anon policies for workouts (SELECT, INSERT, UPDATE, DELETE)
    - Add anon policies for workout_steps (SELECT, INSERT, UPDATE, DELETE)

  2. Reason
    - This app uses hub-based authentication (not Supabase auth), so the
      Supabase client runs as anon role. Existing policies only cover
      `authenticated` role, blocking all inserts for this app.
*/

-- Workouts: anon policies
CREATE POLICY "Anonymous can read workouts"
  ON workouts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous can create workouts"
  ON workouts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous can update workouts"
  ON workouts FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous can delete workouts"
  ON workouts FOR DELETE
  TO anon
  USING (true);

-- Workout steps: anon policies
CREATE POLICY "Anonymous can read workout_steps"
  ON workout_steps FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous can create workout_steps"
  ON workout_steps FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous can update workout_steps"
  ON workout_steps FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous can delete workout_steps"
  ON workout_steps FOR DELETE
  TO anon
  USING (true);
