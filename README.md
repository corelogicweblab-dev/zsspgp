# Zamboanga Sibugay Smart Provincial Governance Platform (ZSSPGP)

Enterprise-grade MVP for provincial digital governance — governor command center, department portals, citizen complaints, DRRM incident reporting, notifications, and mobile citizen access.

## Monorepo Structure

```
ZSSPGP/
├── web-admin/          # Next.js App Router (Render)
├── mobile-app/         # React Native Expo (Expo Router)
├── database/           # PostgreSQL migrations & seed (Supabase)
├── backend/            # Supabase edge functions & API notes
└── README.md
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Web | Next.js 15, TypeScript, Tailwind CSS, shadcn-style UI, Framer Motion, Recharts |
| Mobile | React Native Expo, Expo Router |
| Backend | Supabase (Auth, PostgreSQL, RLS, Realtime, Storage) |
| Deploy | Render, Supabase Cloud, Cloudflare-ready |

## Quick Start (Demo Mode)

Mock data works without Supabase for presentations.

### Web Admin

```bash
cd web-admin
cp .env.local.example .env.local
npm install
npm run dev
```

**Production:** [https://zsspgp.onrender.com](https://zsspgp.onrender.com) — local dev: `npm run dev` → [http://localhost:3000](http://localhost:3000)

- **Landing:** `/`
- **Governor Dashboard:** `/admin/governor`
- **Login:** `/login` (mock: any email/password)
- **Citizen complaints:** `/complaints`

### Mobile App

```bash
cd mobile-app
npm install
npx expo start
```

### Database (Production)

1. Create a [Supabase](https://supabase.com) project
2. Run `database/migrations/001_initial_schema.sql` in SQL Editor
3. Run `database/seed.sql`
4. Set env vars in `web-admin/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_USE_MOCK_DATA=false
```

## Logo

Place the official seal at:

- `web-admin/public/zamboangasibugaylogo.png`
- `mobile-app/assets/images/zamboangasibugaylogo.png`

Regenerate placeholder: `node web-admin/public/generate-logo.mjs`

## User Roles

| Role | Access |
|------|--------|
| Governor Super Admin | Full provincial dashboard, analytics, oversight |
| ICT Admin | Users, roles, system notifications |
| Department Admin | Department portal, reports, incidents |
| Staff | Limited department operations |
| Citizen | Complaints, tracking, announcements, alerts |

## Core Modules

1. **Governor Dashboard** — Stats, charts, incidents, complaints, activity, notifications
2. **Department Portals** — DRRM, Tourism, Health, Agriculture, ICT
3. **Citizen Complaints** — Submit, track, admin response
4. **DRRM Incidents** — Severity levels, emergency alerts, management
5. **Notifications** — In-app, broadcast, announcements
6. **Mobile App** — Home, complaints, alerts, notifications, profile

## Deployment

### Render (Web)

**Option A — Blueprint (repo root `render.yaml`)**

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
2. Connect `corelogicweblab-dev/zsspgp`
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the service env

**Option B — Manual Web Service**

| Setting | Value |
|---------|--------|
| Root Directory | `web-admin` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |

Set the same env vars as in `web-admin/.env.local.example` in the Render service **Environment** tab.

### Supabase

- Apply migrations from `database/migrations/`
- Enable Realtime on `complaints`, `incidents`, `notifications`
- Configure Auth email templates and redirect URLs

### Expo (Mobile)

```bash
cd mobile-app
eas build --platform android
```

## Security

- JWT via Supabase Auth
- Row Level Security (RLS) on all tables
- Role-based route protection (middleware)
- Activity logging for audit trails

## License

Provincial Government of Zamboanga Sibugay — MVP Pilot © 2026
