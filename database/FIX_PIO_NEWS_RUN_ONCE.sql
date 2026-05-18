-- ZSSPGP — Run this ENTIRE file once in Supabase SQL Editor
-- Fixes PIO publish + image upload (RLS + user_role enum). Safe to re-run.

ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'information_office';

CREATE OR REPLACE FUNCTION public.is_information_office()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT role::text FROM public.users WHERE id = auth.uid()),
    ''
  ) = 'information_office';
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.can_manage_provincial_news()
RETURNS BOOLEAN AS $$
DECLARE
  r TEXT;
  dept_code TEXT;
  user_email TEXT;
BEGIN
  SELECT u.role::text, d.code, lower(trim(u.email))
  INTO r, dept_code, user_email
  FROM public.users u
  LEFT JOIN public.departments d ON d.id = u.department_id
  WHERE u.id = auth.uid();

  IF r IS NULL THEN
    RETURN FALSE;
  END IF;

  IF r IN ('information_office', 'governor_super_admin', 'ict_admin') THEN
    RETURN TRUE;
  END IF;

  IF r = 'department_admin' THEN
    IF dept_code = 'INFO' THEN
      RETURN TRUE;
    END IF;
    IF user_email = 'information@zamboangasibugay.gov.ph' THEN
      RETURN TRUE;
    END IF;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

GRANT EXECUTE ON FUNCTION public.can_manage_provincial_news() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_information_office() TO authenticated;

DROP POLICY IF EXISTS "Information office manages news" ON public.news;
DROP POLICY IF EXISTS "Provincial news managers" ON public.news;
DROP POLICY IF EXISTS "Provincial news managers select" ON public.news;
DROP POLICY IF EXISTS "Provincial news managers insert" ON public.news;
DROP POLICY IF EXISTS "Provincial news managers update" ON public.news;
DROP POLICY IF EXISTS "Provincial news managers delete" ON public.news;

CREATE POLICY "Provincial news managers select" ON public.news FOR SELECT TO authenticated
  USING (public.can_manage_provincial_news());

CREATE POLICY "Provincial news managers insert" ON public.news FOR INSERT TO authenticated
  WITH CHECK (public.can_manage_provincial_news());

CREATE POLICY "Provincial news managers update" ON public.news FOR UPDATE TO authenticated
  USING (public.can_manage_provincial_news())
  WITH CHECK (public.can_manage_provincial_news());

CREATE POLICY "Provincial news managers delete" ON public.news FOR DELETE TO authenticated
  USING (public.can_manage_provincial_news());

DROP POLICY IF EXISTS "Staff upload news covers" ON storage.objects;
DROP POLICY IF EXISTS "Staff update news covers" ON storage.objects;
DROP POLICY IF EXISTS "Staff delete news covers" ON storage.objects;
DROP POLICY IF EXISTS "PIO upload news covers" ON storage.objects;
DROP POLICY IF EXISTS "PIO update news covers" ON storage.objects;
DROP POLICY IF EXISTS "PIO delete news covers" ON storage.objects;

CREATE POLICY "PIO upload news covers" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'news-covers' AND public.can_manage_provincial_news());

CREATE POLICY "PIO update news covers" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'news-covers' AND public.can_manage_provincial_news());

CREATE POLICY "PIO delete news covers" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'news-covers' AND public.can_manage_provincial_news());
