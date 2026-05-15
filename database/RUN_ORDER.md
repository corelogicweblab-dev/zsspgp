# Database migration order

Run migrations **in this order** in the Supabase SQL Editor:

1. **`migrations/001_initial_schema.sql`** — creates `user_role` enum, tables, RLS, and helper functions
2. **`migrations/002_information_office_news.sql`** — adds `information_office` role and `news` table
3. **`migrations/004_users_add_role_column.sql`** — idinagdag ang column na `role` kapag kulang ang `public.users` (error: *column "role" does not exist*)
4. **`migrations/003_fix_auth_user_trigger.sql`** — fixes Auth “Database error creating new user” (trigger + RLS)
5. **`migrations/005_purok_street.sql`** — optional `purok_or_street` on `users` and `complaints`
6. **`seed.sql`** — optional department seed data

If you see `type "user_role" does not exist`, you skipped step 1. Run `001_initial_schema.sql` first, then re-run `002`.

If Postgres logs show **`column "role" of relation "users" does not exist`**, run `004_users_add_role_column.sql` first, then `003_fix_auth_user_trigger.sql`.

If Supabase Auth shows **“Database error creating new user”**, run `003_fix_auth_user_trigger.sql`, then check **Logs → Postgres** for the exact error.

**Do not** run `DROP TYPE user_role CASCADE` (or similar) to “fix” enums — it drops dependent tables and breaks the project. Use Postgres logs + migration `003` instead.

Optional metadata when creating the Governor user in the dashboard:

```json
{
  "full_name": "Provincial Governor",
  "role": "governor_super_admin"
}
```
