-- News media fields + Information Office department_admin CRUD
-- Run after 002, 007

ALTER TABLE news
  ADD COLUMN IF NOT EXISTS media_url TEXT,
  ADD COLUMN IF NOT EXISTS media_type VARCHAR(20) CHECK (media_type IS NULL OR media_type IN ('image', 'video'));

COMMENT ON COLUMN news.title IS 'Headline';
COMMENT ON COLUMN news.media_url IS 'Optional inline image or video URL';
COMMENT ON COLUMN news.cover_image_url IS 'Thumbnail / cover for cards and headlines';

-- Use text casts — safe when information_office enum value not yet added (see 011)
CREATE OR REPLACE FUNCTION can_manage_provincial_news()
RETURNS BOOLEAN AS $$
  SELECT
    COALESCE((SELECT role::text FROM users WHERE id = auth.uid()), '') IN (
      'information_office', 'governor_super_admin', 'ict_admin'
    )
    OR (
      COALESCE((SELECT role::text FROM users WHERE id = auth.uid()), '') = 'department_admin'
      AND EXISTS (
        SELECT 1 FROM users u
        JOIN departments d ON d.id = u.department_id
        WHERE u.id = auth.uid() AND d.code = 'INFO'
      )
    )
    OR (
      COALESCE((SELECT role::text FROM users WHERE id = auth.uid()), '') = 'department_admin'
      AND lower(trim((SELECT email FROM users WHERE id = auth.uid()))) =
        'information@zamboangasibugay.gov.ph'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

DROP POLICY IF EXISTS "Information office manages news" ON news;
CREATE POLICY "Provincial news managers" ON news FOR ALL TO authenticated
  USING (can_manage_provincial_news())
  WITH CHECK (can_manage_provincial_news());

-- Storage: allow short video uploads in news-covers bucket
UPDATE storage.buckets
SET
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]::text[]
WHERE id = 'news-covers';

DROP POLICY IF EXISTS "Staff upload news covers" ON storage.objects;
CREATE POLICY "Staff upload news covers" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'news-covers'
    AND can_manage_provincial_news()
  );

DROP POLICY IF EXISTS "Staff update news covers" ON storage.objects;
CREATE POLICY "Staff update news covers" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'news-covers' AND can_manage_provincial_news());

DROP POLICY IF EXISTS "Staff delete news covers" ON storage.objects;
CREATE POLICY "Staff delete news covers" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'news-covers' AND can_manage_provincial_news());
