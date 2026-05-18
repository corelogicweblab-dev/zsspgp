-- Job applications (hiring) + citizen public broadcasts

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  municipality VARCHAR(255),
  barangay VARCHAR(255),
  position_applied VARCHAR(500),
  cover_letter TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_applications_announcement ON job_applications(announcement_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_created ON job_applications(created_at DESC);

CREATE TABLE IF NOT EXISTS public_broadcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  source VARCHAR(64) NOT NULL DEFAULT 'provincial',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_public_broadcasts_created ON public_broadcasts(created_at DESC);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_broadcasts ENABLE ROW LEVEL SECURITY;

-- Anyone may submit an application for a published hiring post
CREATE POLICY "Public insert job applications"
  ON job_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Governor / ICT / INFO admins view applications
CREATE POLICY "Admins read job applications"
  ON job_applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
        AND u.role IN ('governor_super_admin', 'ict_admin', 'information_office', 'department_admin')
    )
  );

CREATE POLICY "Governor update job application status"
  ON job_applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
        AND u.role IN ('governor_super_admin', 'ict_admin')
    )
  );

-- Public broadcasts readable by everyone
CREATE POLICY "Public read broadcasts"
  ON public_broadcasts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins insert broadcasts"
  ON public_broadcasts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
        AND u.role IN ('governor_super_admin', 'ict_admin', 'information_office', 'department_admin')
    )
  );
