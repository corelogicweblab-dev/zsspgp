-- Fix: "Database error creating new user" in Supabase Auth
-- Cause: handle_new_user() trigger fails (RLS, invalid role cast, or missing profile row).
-- Run in Supabase SQL Editor AFTER 001 and 002.

-- Safe role cast + conflict handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role public.user_role := 'citizen';
  meta_role text;
BEGIN
  meta_role := NULLIF(trim(NEW.raw_user_meta_data->>'role'), '');

  IF meta_role IS NOT NULL THEN
    BEGIN
      assigned_role := meta_role::public.user_role;
    EXCEPTION
      WHEN invalid_text_representation THEN
        assigned_role := 'citizen';
    END;
  END IF;

  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(
      NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''),
      split_part(COALESCE(NEW.email, 'user@local'), '@', 1)
    ),
    assigned_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- Allow Auth service to create profile rows (dashboard + signup)
DROP POLICY IF EXISTS "Auth service inserts users" ON public.users;
CREATE POLICY "Auth service inserts users"
  ON public.users
  FOR INSERT
  TO supabase_auth_admin
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role inserts users" ON public.users;
CREATE POLICY "Service role inserts users"
  ON public.users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Re-attach trigger if missing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
