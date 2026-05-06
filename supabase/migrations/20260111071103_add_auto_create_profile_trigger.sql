/*
  # Add Auto-Create Profile Trigger

  1. Changes
    - Create a trigger function that automatically creates a profile when a user signs up
    - Attach trigger to auth.users table on INSERT
    - Profile is created with email from auth.users and default role 'athlete'
    
  2. Security
    - Profiles are created automatically, no manual insertion needed
    - Prevents duplicate key errors
    - Users can update their profile after creation
*/

-- Create function to auto-create profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'athlete')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
