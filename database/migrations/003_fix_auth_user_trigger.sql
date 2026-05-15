-- Fix: Supabase Auth "Database error creating new user"
--
-- Root cause is almost always the AFTER INSERT trigger on auth.users that INSERTs into public.users.
-- Typical failures: RLS blocking the insert, invalid ::user_role cast from metadata, or duplicate id.
--
-- SAFE: This script does NOT use DROP TYPE ... CASCADE (that would destroy your whole schema).
-- Run in Supabase SQL Editor AFTER 001 and 002.
--
-- If it still fails: Dashboard → Logs → Postgres (exact error at create-user time).

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
  meta_role := NULLIF(btrim(NEW.raw_user_meta_data->>'role'), '');

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
    COALESCE(NULLIF(btrim(COALESCE(NEW.email, '')), ''), 'unknown@pending.local'),
    COALESCE(
      NULLIF(btrim(NEW.raw_user_meta_data->>'full_name'), ''),
      NULLIF(btrim(split_part(COALESCE(NEW.email, 'user@local'), '@', 1)), ''),
      'User'
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

-- Triggers run under Supabase Auth context; RLS can block inserts without an explicit policy.
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

-- Defensive grants (policies above are what Postgres enforces under RLS)
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT INSERT ON TABLE public.users TO supabase_auth_admin;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
