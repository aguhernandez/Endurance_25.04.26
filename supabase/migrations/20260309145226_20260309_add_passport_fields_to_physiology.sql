/*
  # Add biological passport fields to athlete_physiology

  ## Summary
  Adds missing physiological fields that come from the Hub biological passport:
  - lt1_hr: Lactate Threshold 1 heart rate (bpm)
  - vam: Velocidad Ascensión Media - mean ascent speed (m/h)
  - pam: Potencia Aeróbica Máxima - maximal aerobic power (watts)

  ## Modified Tables
  - athlete_physiology: adds lt1_hr, vam, pam columns
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_physiology' AND column_name = 'lt1_hr'
  ) THEN
    ALTER TABLE athlete_physiology ADD COLUMN lt1_hr integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_physiology' AND column_name = 'vam'
  ) THEN
    ALTER TABLE athlete_physiology ADD COLUMN vam numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_physiology' AND column_name = 'pam'
  ) THEN
    ALTER TABLE athlete_physiology ADD COLUMN pam numeric;
  END IF;
END $$;
