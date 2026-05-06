/*
  # Add zone system preference to profiles

  1. Changes
    - `profiles` table: new column `preferred_zone_system` (text, default '5')
      Stores the user's preferred zone display: '5' for 5-zone or '7' for 7-zone system.
      This preference is shown in Settings and used throughout the workout builder.

  2. Notes
    - Default is '5' for backward compatibility
    - Constraint ensures only '5' or '7' are valid values
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'preferred_zone_system'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preferred_zone_system text DEFAULT '5'
      CHECK (preferred_zone_system IN ('5', '7'));
  END IF;
END $$;
