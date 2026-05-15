-- Allow Provincial Information Office to read province-wide complaints and incidents (communications / situational awareness).

CREATE OR REPLACE FUNCTION is_information_office()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'information_office';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

DROP POLICY IF EXISTS "Citizens view own complaints" ON complaints;
CREATE POLICY "Citizens view own complaints" ON complaints FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR is_admin()
    OR is_governor()
    OR is_information_office()
    OR (is_department_staff() AND assigned_department_id = (SELECT department_id FROM users WHERE id = auth.uid()))
  );

DROP POLICY IF EXISTS "View incidents by role" ON incidents;
CREATE POLICY "View incidents by role" ON incidents FOR SELECT TO authenticated
  USING (
    reported_by = auth.uid()
    OR is_admin()
    OR is_governor()
    OR is_information_office()
    OR is_department_staff()
  );
