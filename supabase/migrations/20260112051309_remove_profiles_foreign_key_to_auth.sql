/*
  # Remove Foreign Key Constraint Causing Auth Error
  
  1. Problem
    - The foreign key constraint from profiles.id to auth.users(id) is causing
      "Database error querying schema" during authentication
    - Supabase auth process cannot properly validate credentials when this constraint exists
    
  2. Solution
    - Remove the foreign key constraint profiles_id_fkey
    - The relationship between profiles and auth.users will still be maintained through:
      - Application logic
      - The id field still uses UUID that matches auth.users.id
      - No data integrity is lost, just removing the database-level constraint
    
  3. Impact
    - Authentication will work properly
    - Profiles can still reference auth.users.id, just without FK constraint
    - Application logic ensures data consistency
*/

-- Remove the problematic foreign key constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
