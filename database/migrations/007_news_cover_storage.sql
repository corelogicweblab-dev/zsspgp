-- Public bucket for provincial news cover images (Information Office)
-- Run in Supabase SQL editor after 002_information_office_news.sql

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-covers',
  'news-covers',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Anyone can view covers
DROP POLICY IF EXISTS "Public read news covers" ON storage.objects;
CREATE POLICY "Public read news covers" ON storage.objects FOR SELECT
  USING (bucket_id = 'news-covers');

-- Authenticated info office / admins can upload
DROP POLICY IF EXISTS "Staff upload news covers" ON storage.objects;
CREATE POLICY "Staff upload news covers" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'news-covers'
    AND get_user_role() IN ('information_office', 'governor_super_admin', 'ict_admin')
  );

DROP POLICY IF EXISTS "Staff update news covers" ON storage.objects;
CREATE POLICY "Staff update news covers" ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'news-covers'
    AND get_user_role() IN ('information_office', 'governor_super_admin', 'ict_admin')
  );

DROP POLICY IF EXISTS "Staff delete news covers" ON storage.objects;
CREATE POLICY "Staff delete news covers" ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'news-covers'
    AND get_user_role() IN ('information_office', 'governor_super_admin', 'ict_admin')
  );
