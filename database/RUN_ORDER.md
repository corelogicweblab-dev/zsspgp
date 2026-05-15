# Database migration order

Run migrations **in this order** in the Supabase SQL Editor:

1. **`migrations/001_initial_schema.sql`** — creates `user_role` enum, tables, RLS, and helper functions
2. **`migrations/002_information_office_news.sql`** — adds `information_office` role and `news` table
3. **`seed.sql`** — optional department seed data

If you see `type "user_role" does not exist`, you skipped step 1. Run `001_initial_schema.sql` first, then re-run `002`.
