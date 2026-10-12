-- Add unique constraint on hub_matched_key so ON CONFLICT upserts work
CREATE UNIQUE INDEX IF NOT EXISTS workouts_hub_matched_key_key ON workouts (hub_matched_key) WHERE hub_matched_key IS NOT NULL;