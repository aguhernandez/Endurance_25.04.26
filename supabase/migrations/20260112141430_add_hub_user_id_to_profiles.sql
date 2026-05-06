/*
  # Add HUB User ID to Profiles

  1. Changes
    - Add `hub_user_id` column to `profiles` table
    - This column will store the user ID from the centralized HUB
    - It will be unique to ensure one-to-one mapping
    - Nullable to allow for migration of existing data
  
  2. Security
    - No changes to RLS policies in this migration
    - Policies will be updated in a subsequent migration
*/

-- Add hub_user_id column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS hub_user_id text UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_hub_user_id 
ON profiles(hub_user_id);
