/*
  # Add admin role to profiles

  1. Changes
    - Modify profiles table to support 'admin' role
    - Drop and recreate the role check constraint
  
  2. Security
    - No changes to RLS policies
*/

-- Drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add the new constraint with admin role
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role = ANY (ARRAY['athlete'::text, 'coach'::text, 'admin'::text]));
