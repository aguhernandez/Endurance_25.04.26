/*
  # Remove Auth Trigger Completely

  1. Changes
    - Drop the trigger on auth.users that's causing schema errors during authentication
    - Drop the handle_new_user function
    - Profiles will be created manually from the application after successful auth

  2. Reason
    - The trigger interferes with Supabase's authentication process
    - Causes "Database error querying schema" during login attempts
    - Safer to handle profile creation from application code

  3. Security
    - RLS policies remain in place
    - No security compromise, just different timing for profile creation
*/

-- Drop the trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS handle_new_user();
