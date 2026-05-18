-- Information Office announcements: public read, INFO managers write

CREATE OR REPLACE FUNCTION public.can_manage_info_announcements()
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

  IF r IS NULL THEN RETURN FALSE; END IF;

  IF r = 'information_office' THEN RETURN TRUE; END IF;

  IF r = 'department_admin' AND dept_code = 'INFO' THEN RETURN TRUE; END IF;

  IF r = 'department_admin' AND user_email = 'information@zamboangasibugay.gov.ph' THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

GRANT EXECUTE ON FUNCTION public.can_manage_info_announcements() TO authenticated;

DROP POLICY IF EXISTS "View published announcements" ON public.announcements;
DROP POLICY IF EXISTS "Manage announcements" ON public.announcements;
DROP POLICY IF EXISTS "Public read published announcements" ON public.announcements;
DROP POLICY IF EXISTS "INFO manage announcements" ON public.announcements;

CREATE POLICY "Public read published announcements" ON public.announcements
  FOR SELECT TO anon, authenticated
  USING (
    is_published = true
    AND (expires_at IS NULL OR expires_at > NOW())
  );

CREATE POLICY "INFO manage announcements" ON public.announcements
  FOR ALL TO authenticated
  USING (public.can_manage_info_announcements())
  WITH CHECK (public.can_manage_info_announcements());
