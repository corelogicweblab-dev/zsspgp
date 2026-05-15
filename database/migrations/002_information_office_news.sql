-- Information Office role and provincial news
-- PREREQUISITE: Run 001_initial_schema.sql first (creates user_role enum and get_user_role())

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'information_office';

-- Provincial news (Information Office)
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured) WHERE is_featured = true;

CREATE TRIGGER tr_news_updated BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published news" ON news FOR SELECT TO authenticated
  USING (is_published = true);
CREATE POLICY "Public read published news anon" ON news FOR SELECT TO anon
  USING (is_published = true);

CREATE POLICY "Information office manages news" ON news FOR ALL TO authenticated
  USING (
    get_user_role() IN ('information_office', 'governor_super_admin', 'ict_admin')
  )
  WITH CHECK (
    get_user_role() IN ('information_office', 'governor_super_admin', 'ict_admin')
  );

-- Add Information Office department if missing
INSERT INTO departments (code, name, description, contact_email) VALUES
  ('INFO', 'Provincial Information Office', 'Official news, communications, and public information', 'information@zamboangasibugay.gov.ph')
ON CONFLICT (code) DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE news;
