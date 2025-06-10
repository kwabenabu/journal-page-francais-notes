
-- Create trigger to automatically create profiles for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

-- Create the trigger that fires when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fix the existing user by creating their profile record
-- Replace 'kwabspam@gmail.com' with the actual user email if different
INSERT INTO public.profiles (id, email, display_name, theme_preference, language_preference, writing_goal, notifications_enabled)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data ->> 'display_name', split_part(email, '@', 1)),
  'auto',
  'en',
  300,
  true
FROM auth.users 
WHERE email = 'kwabspam@gmail.com'
ON CONFLICT (id) DO NOTHING;
