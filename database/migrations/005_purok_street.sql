-- Optional address detail for users and complaints (purok / street line)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'purok_or_street'
  ) THEN
    ALTER TABLE public.users ADD COLUMN purok_or_street VARCHAR(255);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'complaints' AND column_name = 'purok_or_street'
  ) THEN
    ALTER TABLE public.complaints ADD COLUMN purok_or_street VARCHAR(255);
  END IF;
END;
$$;
