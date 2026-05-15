# ZSSPGP Backend

Primary backend is **Supabase** (PostgreSQL + Auth + Realtime + Storage).

## API Surface

| Endpoint | Description |
|----------|-------------|
| `web-admin/src/app/api/complaints` | Complaints REST API |
| `web-admin/src/app/api/incidents` | Incidents REST API |
| Supabase Client | Direct client access with RLS |

## Edge Functions (Future)

Recommended Supabase Edge Functions:

- `send-notification` — Email/push dispatch
- `escalate-incident` — Critical incident workflows
- `generate-report` — PDF department reports

## Environment

Configure in Supabase Dashboard and mirror in `web-admin/.env.local` (or Render service environment variables).
