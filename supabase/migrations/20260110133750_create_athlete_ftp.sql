/*
  # Create Athlete FTP Table

  1. New Tables
    - `athlete_ftp`
      - `athlete_id` (uuid, primary key) → references auth.users
      - `current_ftp_watts` (integer, required)
      - `updated_at` (timestamptz)
      - `updated_by` (uuid) → references auth.users (coach or athlete who updated it)

  2. Security
    - Enable RLS on `athlete_ftp` table
    - Athletes can read and update their own FTP
    - Coaches can read and update all athlete FTP values
  
  3. Important Notes
    - Only one FTP value per athlete (current)
    - When FTP changes, calculations in sessions are recalculated automatically
    - Both coach and athlete can modify FTP
*/

-- Create athlete_ftp table
CREATE TABLE IF NOT EXISTS athlete_ftp (
  athlete_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_ftp_watts integer NOT NULL CHECK (current_ftp_watts > 0),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE athlete_ftp ENABLE ROW LEVEL SECURITY;

-- Athletes can read their own FTP
CREATE POLICY "Athletes can read own FTP"
  ON athlete_ftp
  FOR SELECT
  TO authenticated
  USING (auth.uid() = athlete_id);

-- Coaches can read all FTP values
CREATE POLICY "Coaches can read all FTP"
  ON athlete_ftp
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'coach'
    )
  );

-- Athletes can update their own FTP
CREATE POLICY "Athletes can update own FTP"
  ON athlete_ftp
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

-- Coaches can update all FTP values
CREATE POLICY "Coaches can update all FTP"
  ON athlete_ftp
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'coach'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'coach'
    )
  );

-- Athletes can insert their own FTP
CREATE POLICY "Athletes can insert own FTP"
  ON athlete_ftp
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = athlete_id);

-- Coaches can insert FTP for any athlete
CREATE POLICY "Coaches can insert FTP for athletes"
  ON athlete_ftp
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'coach'
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER set_ftp_updated_at
  BEFORE UPDATE ON athlete_ftp
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();