/*
# Hub sync dedupe: hub_workout_id key + per-athlete last_synced_at

1. Plain-English
- Every workout imported from Asciende Hub now stores the Hub's original ID in a
  new `hub_workout_id` column, keyed per athlete. A unique index on
  (athlete_id, hub_workout_id) makes duplicate imports impossible at the
  database level, and lets the app save with upsert.
- A new `hub_last_synced_at` column on `profiles` records when each athlete was
  last pulled from the Hub, so repeated pulls within 10 minutes can be skipped
  and only recent/future workouts are re-checked.

2. Modified tables
- `workouts`: added `hub_workout_id text NULL` (original Hub workout/activity ID).
  Existing rows are backfilled from `hub_data->>'id'` when available (the Hub
  entity ID used by prior imports).
- `profiles`: added `hub_last_synced_at timestamptz NULL`.

3. Data cleanup before the unique index
- Existing duplicate rows with the same (athlete_id, hub_workout_id) are removed,
  keeping the OLDEST row of each group (per requirements). The unique index is
  only created after cleanup succeeds.

4. Security
- No RLS changes: new columns inherit the existing `workouts` and `profiles`
  policies.

5. Notes
- The existing partial unique index on `hub_matched_key` is kept; it guards the
  legacy match-key path. The new index is the canonical dedupe key going forward.
- Idempotent: safe to re-run.
*/

-- Add columns first
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS hub_workout_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hub_last_synced_at timestamptz;

-- Backfill hub_workout_id from hub_data for rows imported earlier
UPDATE workouts
SET hub_workout_id = hub_data->>'id'
WHERE hub_workout_id IS NULL
  AND hub_data->>'id' IS NOT NULL;

-- Also backfill from the legacy ext|... match key (last segment is the Hub ID)
UPDATE workouts
SET hub_workout_id = split_part(hub_matched_key, '|', 5)
WHERE hub_workout_id IS NULL
  AND hub_matched_key LIKE 'ext|%';

-- Remove duplicates keeping the oldest row per (athlete_id, hub_workout_id)
DELETE FROM workouts w
USING workouts d
WHERE d.hub_workout_id = w.hub_workout_id
  AND d.athlete_id = w.athlete_id
  AND w.hub_workout_id IS NOT NULL
  AND d.id <> w.id
  AND d.created_at < w.created_at;

-- Unique dedupe key: one planner workout per (athlete, Hub ID)
CREATE UNIQUE INDEX IF NOT EXISTS workouts_athlete_hub_workout_id_key
  ON workouts (athlete_id, hub_workout_id)
  WHERE hub_workout_id IS NOT NULL;

-- Fast lookup of loaded Hub IDs per athlete (used to compute "what is missing")
CREATE INDEX IF NOT EXISTS workouts_athlete_hub_workout_lookup
  ON workouts (athlete_id, hub_workout_id);