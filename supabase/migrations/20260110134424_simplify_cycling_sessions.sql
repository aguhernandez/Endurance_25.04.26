/*
  # Simplify Cycling Sessions Table - Phase 1 Correct Design

  ## Changes Made
  This migration removes all derived metrics that depend on FTP.
  Only raw, immutable data is stored. All calculations happen on-the-fly.

  ## Removed Columns (Derived Metrics)
  - `normalized_power` - Removed (complex, not needed for phase 1)
  - `intensity_factor` - Removed (calculated on-the-fly as avg_power/FTP)
  - `training_load` - Removed (calculated on-the-fly)
  - `time_in_z1` through `time_in_z5` - Removed (zones depend on FTP)
  - `motivation` - Removed (not critical for phase 1)

  ## Kept Columns (Raw Data Only)
  - Session metadata: id, athlete_id, dates, names, status
  - Raw objective: duration_minutes, distance_km, avg_power_watts
  - Subjective: perceived_effort, fatigue_level, notes

  ## Why This Is Correct
  When FTP changes, all metrics recalculate automatically.
  No stale data. No database updates needed.
  Simple, interpretable, retroactive.
*/

-- Remove derived columns that depend on FTP
ALTER TABLE cycling_sessions 
  DROP COLUMN IF EXISTS normalized_power,
  DROP COLUMN IF EXISTS intensity_factor,
  DROP COLUMN IF EXISTS training_load,
  DROP COLUMN IF EXISTS time_in_z1,
  DROP COLUMN IF EXISTS time_in_z2,
  DROP COLUMN IF EXISTS time_in_z3,
  DROP COLUMN IF EXISTS time_in_z4,
  DROP COLUMN IF EXISTS time_in_z5,
  DROP COLUMN IF EXISTS motivation;

-- Drop the trigger that calculated metrics
DROP TRIGGER IF EXISTS calculate_metrics_on_insert_update ON cycling_sessions;

-- Drop the function that calculated metrics
DROP FUNCTION IF EXISTS calculate_session_metrics();

-- Add comment explaining the design
COMMENT ON TABLE cycling_sessions IS 'Stores only raw cycling session data. All derived metrics (intensity, load, zones) are calculated on-the-fly based on current FTP.';
