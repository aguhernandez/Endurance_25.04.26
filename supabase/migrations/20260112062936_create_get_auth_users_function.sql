/*
  # Create get_auth_users Function

  1. New Functions
    - `get_auth_users` - Returns list of all authenticated users from auth.users
    
  2. Security
    - Only accessible by admin users
    - Returns basic user information (id, email, metadata)
    
  3. Notes
    - This function allows admins to sync auth users with profiles table
    - Returns user metadata for profile creation
*/

-- Create function to get auth users (admin only)
CREATE OR REPLACE FUNCTION get_auth_users()
RETURNS TABLE (
  id uuid,
  email text,
  raw_user_meta_data jsonb
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can access this function';
  END IF;

  -- Return users from auth schema
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.raw_user_meta_data
  FROM auth.users au
  ORDER BY au.created_at DESC;
END;
$$;
