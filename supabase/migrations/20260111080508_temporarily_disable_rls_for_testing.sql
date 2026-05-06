/*
  # Temporarily Disable RLS for Testing
  
  1. Purpose
    - Disable RLS on profiles table to test if RLS policies are causing the auth error
    - This is a diagnostic migration to isolate the problem
    
  2. Changes
    - Disable RLS on profiles table
    
  3. Security
    - This is TEMPORARY for testing only
    - Will be re-enabled once we identify the issue
*/

-- Temporarily disable RLS to test if this is the cause of the auth error
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
