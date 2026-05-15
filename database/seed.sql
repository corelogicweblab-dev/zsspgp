-- Seed data for ZSSPGP MVP
-- Run after migrations and creating auth users in Supabase Dashboard

INSERT INTO departments (code, name, description, head_name, contact_email) VALUES
  ('DRRM', 'Disaster Risk Reduction & Management', 'Emergency response and disaster preparedness', 'Engr. Maria Santos', 'drrm@zamboangasibugay.gov.ph'),
  ('TOURISM', 'Tourism Office', 'Provincial tourism promotion and development', 'Ms. Ana Reyes', 'tourism@zamboangasibugay.gov.ph'),
  ('HEALTH', 'Provincial Health Office', 'Public health services and programs', 'Dr. Juan Dela Cruz', 'health@zamboangasibugay.gov.ph'),
  ('AGRI', 'Agriculture Office', 'Agricultural development and support', 'Engr. Pedro Garcia', 'agriculture@zamboangasibugay.gov.ph'),
  ('ICT', 'Information & Communications Technology', 'Digital governance and IT services', 'Engr. Roberto Lim', 'ict@zamboangasibugay.gov.ph')
ON CONFLICT (code) DO NOTHING;

-- Sample announcements (requires admin user id - replace after auth setup)
-- INSERT INTO announcements (title, content, is_published, published_at) VALUES
--   ('Provincial Disaster Preparedness Week', 'The Provincial Government announces Disaster Preparedness Week from May 20-27, 2026.', true, NOW()),
--   ('Citizen Complaint Portal Now Live', 'Report concerns directly through the ZSSPGP platform.', true, NOW());
