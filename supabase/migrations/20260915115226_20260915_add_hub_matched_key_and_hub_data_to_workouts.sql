/*
# Add hub_matched_key and hub_data columns to workouts

1. New Columns
- `hub_matched_key` (text, nullable) — composite key `date|athleteId|exerciseType` used to skip already-matched workouts during Hub pull
- `hub_data` (jsonb, nullable) — stores the raw Hub version of the workout for later comparison

2. Purpose
- When pulling from the Hub, if a workout has already been matched (same date + user + exercise type), it is skipped instead of re-processed
- Both the Hub version and local version are preserved so they can be compared later

3. Security
- No RLS policy changes needed — these are just data columns on the existing workouts table
*/

ALTER TABLE workouts ADD COLUMN IF NOT EXISTS hub_matched_key text;
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS hub_data jsonb;
