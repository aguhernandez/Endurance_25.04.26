/*
  # Add function to get auth users

  1. Changes
    - Create a function that allows admins to query auth.users table
    - Returns user id, email, and metadata needed for profile sync
    
  2. Security
    - Only accessible by authenticated users with admin role
    - Uses SECURITY DEFINER to access auth schema
*/

-- Create function to get auth users (admin only)
CREATE OR REPLACE FUNCTION get_auth_users()
RETURNS TABLE (
  id uuid,
  email text,
  raw_user_meta_data jsonb,
  created_at timestamptz
) 
SECURITY DEFINER
SET search_path = auth, public
AS $$
BEGIN
  -- Check if the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'coach'
  ) THEN
    RAISE EXCEPTION 'Only admins can access this function';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data,
    u.created_at
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql;
