-- PIO announcements: hiring, advisories, events, and other categories

ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS category VARCHAR(32) NOT NULL DEFAULT 'general';

ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS link_url TEXT;

ALTER TABLE public.announcements
  DROP CONSTRAINT IF EXISTS announcements_category_check;

ALTER TABLE public.announcements
  ADD CONSTRAINT announcements_category_check CHECK (
    category IN (
      'general',
      'hiring',
      'advisory',
      'event',
      'emergency',
      'procurement',
      'holiday'
    )
  );

CREATE INDEX IF NOT EXISTS idx_announcements_category ON public.announcements (category);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON public.announcements (is_published, published_at DESC);
