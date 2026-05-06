/*
  # Temporarily Open Profiles Read Access

  1. Changes
    - Temporarily allow all authenticated users to read all profiles
    - This is for diagnosing the circular RLS issue
    - Will be restricted again after diagnosis
    
  2. Security
    - Temporary measure for debugging
    - Will be tightened after confirming this fixes the issue
*/

-- Drop the problematic coach/admin policy
DROP POLICY IF EXISTS "Coaches and admins can read all profiles" ON profiles;

-- Temporarily allow all authenticated users to read all profiles
CREATE POLICY "All authenticated users can read profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);
