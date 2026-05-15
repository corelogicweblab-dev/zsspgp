# ZSSPGP Web Admin

Next.js App Router frontend for the Zamboanga Sibugay Smart Provincial Governance Platform.

## Development

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_USE_MOCK_DATA` | `true` for demo without Supabase |

## Deploy on Render

This app is configured for [Render](https://render.com) (see root `render.yaml`).

### Blueprint (recommended)

1. Push the repo to GitHub.
2. In Render: **New** → **Blueprint** → connect [corelogicweblab-dev/zsspgp](https://github.com/corelogicweblab-dev/zsspgp).
3. Set secret env vars when prompted:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` when Supabase is ready.

### Manual Web Service

| Setting | Value |
|---------|--------|
| **Root Directory** | `web-admin` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Node Version** | 20 |

Render sets `PORT` automatically; `next start` uses it in production.

### After deploy

- Add your Render URL to Supabase **Authentication → URL Configuration** (site URL + redirect URLs).
- Example: `https://zsspgp-web.onrender.com`
