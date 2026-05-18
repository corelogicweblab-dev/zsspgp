-- Department portal accounts (one email + password per office, single /login page)
-- After running seed.sql, create each user in Supabase Auth → Users with the matching email and password.
-- Then ensure public.users has role + department_id:

-- Example (run per department after auth user exists; replace USER_UUID and DEPT id from departments table):
--
-- UPDATE users SET role = 'department_admin', department_id = (SELECT id FROM departments WHERE code = 'DRRM')
--   WHERE email = 'drrm@zamboangasibugay.gov.ph';
--
-- ICT admin:
-- UPDATE users SET role = 'ict_admin', department_id = (SELECT id FROM departments WHERE code = 'ICT')
--   WHERE email = 'ict@zamboangasibugay.gov.ph';
--
-- Information Office (PIO):
-- UPDATE users SET role = 'information_office', department_id = (SELECT id FROM departments WHERE code = 'INFO')
--   WHERE email = 'information@zamboangasibugay.gov.ph';

INSERT INTO departments (code, name, description, contact_email) VALUES
  ('INFO', 'Provincial Information Office', 'Official news, communications, and public information', 'information@zamboangasibugay.gov.ph')
ON CONFLICT (code) DO UPDATE SET contact_email = EXCLUDED.contact_email;
