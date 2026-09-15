ALTER TABLE workouts ADD COLUMN IF NOT EXISTS compliance_status text DEFAULT NULL;

COMMENT ON COLUMN workouts.compliance_status IS 'Set during Hub sync: completed (green), modified (yellow), missed (red)';
