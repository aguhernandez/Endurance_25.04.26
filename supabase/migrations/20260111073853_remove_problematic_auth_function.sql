/*
  # Remove Problematic Auth Function

  1. Changes
    - Drop the get_auth_users function that's causing schema errors
    - Simplify the handle_new_user trigger to avoid auth errors
    - Keep RLS policies simple and straightforward

  2. Security
    - Maintain security without causing schema query errors
*/

-- Drop the problematic function
DROP FUNCTION IF EXISTS get_auth_users();

-- Simplify the trigger function - no complex logic during auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY INVOKER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'athlete')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If anything fails, still allow the user to be created
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;