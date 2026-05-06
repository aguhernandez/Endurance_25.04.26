/*
  # Fix Circular RLS Policies

  1. Changes
    - Remove the circular policy that was causing authentication errors
    - This migration is now a no-op as the policy is handled in later migrations

  2. Security
    - Security is maintained through later migrations
*/

-- Drop the problematic policy (this was circular and caused auth errors)
DROP POLICY IF EXISTS "Coaches and admins can read all profiles" ON profiles;

-- NOTE: The correct policies are created in migration 20260111093000_completely_fix_auth_with_simple_policies.sql
