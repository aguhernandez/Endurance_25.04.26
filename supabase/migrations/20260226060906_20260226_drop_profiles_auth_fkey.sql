/*
  # Drop profiles foreign key to auth.users

  ## Problem
  The profiles table had a FOREIGN KEY (id) REFERENCES auth.users(id).
  Satellite apps use HUB authentication, not Supabase Auth, so there are
  no rows in auth.users. This caused every INSERT into profiles to fail
  with a 409 constraint violation.

  ## Changes
  - Drop the foreign key constraint profiles_id_fkey if it exists
  - No data is lost or modified
*/

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
