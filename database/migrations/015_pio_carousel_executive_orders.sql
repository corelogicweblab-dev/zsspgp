-- PIO homepage carousel, executive orders, job application resumes

ALTER TABLE job_applications
  ADD COLUMN IF NOT EXISTS resume_url TEXT;

CREATE TABLE IF NOT EXISTS pio_carousel_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  caption TEXT,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS executive_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  image_url TEXT NOT NULL,
  document_url TEXT,
  order_number VARCHAR(120),
  published_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pio_carousel_sort ON pio_carousel_slides(sort_order, created_at);
CREATE INDEX IF NOT EXISTS idx_executive_orders_sort ON executive_orders(sort_order, published_at DESC);

ALTER TABLE pio_carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published carousel" ON pio_carousel_slides
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "PIO manage carousel" ON pio_carousel_slides
  FOR ALL TO authenticated
  USING (public.can_manage_info_announcements())
  WITH CHECK (public.can_manage_info_announcements());

CREATE POLICY "Public read published executive orders" ON executive_orders
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "PIO manage executive orders" ON executive_orders
  FOR ALL TO authenticated
  USING (public.can_manage_info_announcements())
  WITH CHECK (public.can_manage_info_announcements());

-- Storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'pio-carousel',
    'pio-carousel',
    true,
    6291456,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
  ),
  (
    'executive-order-covers',
    'executive-order-covers',
    true,
    6291456,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
  ),
  (
    'job-resumes',
    'job-resumes',
    false,
    10485760,
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]::text[]
  )
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read pio carousel storage" ON storage.objects FOR SELECT
  USING (bucket_id = 'pio-carousel');

CREATE POLICY "Public read executive order covers" ON storage.objects FOR SELECT
  USING (bucket_id = 'executive-order-covers');

CREATE POLICY "PIO upload pio carousel" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'pio-carousel' AND public.can_manage_info_announcements());

CREATE POLICY "PIO upload executive order covers" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'executive-order-covers' AND public.can_manage_info_announcements());

CREATE POLICY "Anyone upload job resume" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'job-resumes');

CREATE POLICY "Admins read job resumes" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'job-resumes'
    AND EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
        AND u.role IN ('governor_super_admin', 'ict_admin', 'information_office', 'department_admin')
    )
  );
