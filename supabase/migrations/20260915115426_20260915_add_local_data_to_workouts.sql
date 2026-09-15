/* Store the local workout snapshot used for Hub comparison. */
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS local_data jsonb;
