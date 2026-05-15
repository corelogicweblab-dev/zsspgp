-- Fix: ERROR: column "role" of relation "users" does not exist
--
-- Nangyayari kapag may `public.users` pero hindi galing sa buong 001 schema
-- (kulang ang columns). Ang trigger na `handle_new_user()` ay nag-i-insert ng `role`.
--
-- I-run sa Supabase SQL Editor BAGO o KASAMA ng `003_fix_auth_user_trigger.sql`
-- (mas maigi: 004 muna, tapos 003 para sure ang function + trigger).
--
-- Kung wala pa talagang `public.users`, patakbuhin muna ang buong `001_initial_schema.sql`.

-- 1) Siguraduhing may enum `user_role`
DO $$
BEGIN
  CREATE TYPE public.user_role AS ENUM (
    'governor_super_admin',
    'ict_admin',
    'department_admin',
    'staff',
    'citizen'
  );
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END;
$$;

ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'information_office';

-- 2) Idagdag ang `role` kung wala pa
DO $$
BEGIN
  IF to_regclass('public.users') IS NULL THEN
    RAISE EXCEPTION 'public.users table not found. Run 001_initial_schema.sql first.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'role'
  ) THEN
    ALTER TABLE public.users
      ADD COLUMN role public.user_role NOT NULL DEFAULT 'citizen'::public.user_role;
  END IF;
END;
$$;

-- 3) Kadikit na fix: `full_name` at `email` kailangan ng trigger (NOT NULL sa 001)
DO $$
BEGIN
  IF to_regclass('public.users') IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.users
      ADD COLUMN email varchar(255) NOT NULL DEFAULT 'pending@local.invalid';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.users
      ADD COLUMN full_name varchar(255) NOT NULL DEFAULT 'User';
  END IF;
END;
$$;
