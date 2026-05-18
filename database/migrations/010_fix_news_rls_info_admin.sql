-- Fix news + storage RLS for Information Office department_admin (e.g. information@…)
-- Run in Supabase SQL Editor if publish shows "new row violates row-level security policy"

CREATE OR REPLACE FUNCTION can_manage_provincial_news()
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

GRANT EXECUTE ON FUNCTION can_manage_provincial_news() TO authenticated;
GRANT EXECUTE ON FUNCTION can_manage_provincial_news() TO anon;

-- News table policies
DROP POLICY IF EXISTS "Information office manages news" ON news;
DROP POLICY IF EXISTS "Provincial news managers" ON news;

CREATE POLICY "Provincial news managers select" ON news FOR SELECT TO authenticated
  USING (can_manage_provincial_news());

CREATE POLICY "Provincial news managers insert" ON news FOR INSERT TO authenticated
  WITH CHECK (can_manage_provincial_news());

CREATE POLICY "Provincial news managers update" ON news FOR UPDATE TO authenticated
  USING (can_manage_provincial_news())
  WITH CHECK (can_manage_provincial_news());

CREATE POLICY "Provincial news managers delete" ON news FOR DELETE TO authenticated
  USING (can_manage_provincial_news());

-- Storage bucket (news-covers) — replace 007 role list with can_manage_provincial_news()
DROP POLICY IF EXISTS "Staff upload news covers" ON storage.objects;
DROP POLICY IF EXISTS "Staff update news covers" ON storage.objects;
DROP POLICY IF EXISTS "Staff delete news covers" ON storage.objects;

CREATE POLICY "PIO upload news covers" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'news-covers' AND can_manage_provincial_news());

CREATE POLICY "PIO update news covers" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'news-covers' AND can_manage_provincial_news());

CREATE POLICY "PIO delete news covers" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'news-covers' AND can_manage_provincial_news());
