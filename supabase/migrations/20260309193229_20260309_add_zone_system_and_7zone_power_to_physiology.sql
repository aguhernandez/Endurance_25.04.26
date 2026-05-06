/*
  # Add zone system fields to athlete_physiology

  ## Summary
  Adds support for 5-zone and 7-zone training systems synced from the Hub Biological Passport.

  ## Changes

  ### Modified Table: `athlete_physiology`
  - `zone_system` (text, default '5') — active zone display: '5' or '7'
  - `zone_base_method` (text) — zone calculation method from Hub (e.g., 'LT1_LT2_physiological')
  - Power zones Z6 and Z7 columns for 7-zone power support:
    - `power_z6_min`, `power_z6_max` (% FTP)
    - `power_z7_min`, `power_z7_max` (% FTP)
  - Zones 5-zone snapshots stored as JSONB for quick access:
    - `zones5_hr_json` (jsonb) — 5-zone HR array from Hub
    - `zones5_power_json` (jsonb) — 5-zone power array from Hub
    - `zones7_hr_json` (jsonb) — 7-zone HR array from Hub
    - `zones7_power_json` (jsonb) — 7-zone power array from Hub

  ## Notes
  - All new columns are nullable to not break existing rows
  - Legacy hr_z1..hr_z7 and power_z1..power_z5 columns remain untouched
  - zone_system defaults to '5' for backward compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_physiology' AND column_name = 'zone_system'
  ) THEN
    ALTER TABLE athlete_physiology ADD COLUMN zone_system text DEFAULT '5';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_physiology' AND column_name = 'zone_base_method'
  ) THEN
    ALTER TABLE athlete_physiology ADD COLUMN zone_base_method text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_physiology' AND column_name = 'power_z6_min'
  ) THEN
    ALTER TABLE athlete_physiology ADD COLUMN power_z6_min numeric;
    ALTER TABLE athlete_physiology ADD COLUMN power_z6_max numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_physiology' AND column_name = 'power_z7_min'
  ) THEN
    ALTER TABLE athlete_physiology ADD COLUMN power_z7_min numeric;
    ALTER TABLE athlete_physiology ADD COLUMN power_z7_max numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_physiology' AND column_name = 'zones5_hr_json'
  ) THEN
    ALTER TABLE athlete_physiology ADD COLUMN zones5_hr_json jsonb;
    ALTER TABLE athlete_physiology ADD COLUMN zones5_power_json jsonb;
    ALTER TABLE athlete_physiology ADD COLUMN zones7_hr_json jsonb;
    ALTER TABLE athlete_physiology ADD COLUMN zones7_power_json jsonb;
  END IF;
END $$;
