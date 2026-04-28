# Affiliate Click Dashboard

A Next.js App Router dashboard for managing affiliate products, redirect URLs, landing pages, click tracking, ad spend, performance reports, and private automation APIs. Backed by Supabase (Postgres + Auth) with a graceful "demo mode" fallback when credentials are missing.

---

## Quick start (local)

```bash
npm install
cp .env.local.example .env.local   # then fill in Supabase keys
npm run dev
```

Open `http://localhost:3000/admin` for the dashboard, `http://localhost:3000/rekomendasi/produk-viral` for a sample public landing page.

If `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are unset, the app runs in **demo mode** with mock data — the admin login gate is bypassed and every API write returns a 503. Set the keys to flip to a real backend.

## Checks

```bash
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run build      # Next production build
```

---

## Supabase setup (step-by-step)

> 5–10 minutes. You only do this once.

### 1. Create the Supabase project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and click **New project**.
2. Pick a region close to your users (Singapore for ID/SEA traffic).
3. Set a strong database password and save it in your password manager.
4. Wait until the project finishes provisioning.

### 2. Apply the database schema
1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Paste the entire contents of `supabase/migrations/20260427000000_affiliate_dashboard.sql` and click **Run**. This creates the tables, indexes, and Row Level Security policies.
3. Open another **New query**, paste `supabase/migrations/20260428000000_seed_and_helpers.sql`, and click **Run**. This seeds 4 sample products + 2 landing pages and adds public-read policies so `/rekomendasi/[slug]` works.

### 3. Grab API credentials
Open **Project Settings → API**:

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | "Project URL" |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | "anon / public" key |
| `SUPABASE_SERVICE_ROLE_KEY` | "service_role" key — **never** expose to the browser |

### 4. Create your first admin user
The dashboard uses Supabase Auth (email + password) to gate `/admin/*`.

1. Open **Authentication → Users → Add user → Create new user**.
2. Enter your email + password and tick **Auto Confirm User**.
3. (Optional, recommended) **Authentication → Providers → Email**: turn off "Enable signups" so only invited users can log in.

That's it for Supabase.

---

## Vercel setup (step-by-step)

### 1. Connect the repo
1. In Vercel, **Add New Project → Import Git Repository → coinday-io/dashboard-metads2**.
2. Framework: **Next.js** (auto-detected).
3. Root directory: leave as repo root.

### 2. Set environment variables
Under **Settings → Environment Variables**, add the following for **all three environments** (Production, Preview, Development):

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://dashboard-metads2.vercel.app` (your Vercel domain) |
| `NEXT_PUBLIC_SUPABASE_URL` | from Supabase API settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | from Supabase API settings |
| `IP_HASH_SALT` | run `openssl rand -hex 32` and paste the result |
| `API_KEY_SECRET` | run `openssl rand -hex 32` and paste the result |

### 3. Make sure Vercel detects the framework as Next.js
Under **Settings → Build & Development Settings**:
- **Framework Preset**: `Next.js`
- **Build Command**: leave blank (uses `next build` automatically)
- **Output Directory**: leave blank (Next.js uses `.next`, not `public`)
- **Install Command**: leave blank (uses `npm install`)

The repo also ships a `vercel.json` that pins these values, so a fresh import should work without any manual settings.

If you previously imported the project as a static site you may have an explicit `Output Directory: public` saved — clear it (or delete the project and re-import) so Vercel uses `.next`.

### 4. Make sure Vercel deploys the right branch
The default branch must contain the application code. After this PR is merged into `main` (or whichever branch you configure as default in **Settings → Git → Production Branch**), Vercel will build and deploy automatically.

### 5. Re-deploy
Vercel will redeploy automatically on every push. To trigger a redeploy without a new commit, click **Deployments → ⋯ → Redeploy** on the latest deployment.

---

## Day-to-day usage

| Where | What it does |
| --- | --- |
| `/admin/login` | Sign in with the Supabase user you created |
| `/admin` | Overview metrics, top campaigns, builder pane |
| `/admin/products` | Create / edit / delete affiliate products. Each product gets a `/go/<slug>` short link. |
| `/admin/landing-pages` | Build curated landing pages, attach products, publish/unpublish |
| `/admin/clicks` | Live feed of click events with bot/duplicate flags |
| `/admin/ad-spend` | Manually log Meta Ads spend per campaign/day |
| `/admin/reports` | CPC, CPRC, ROAS, duplicate/bot rates |
| `/admin/api-keys` | Generate scoped API keys for Hermes / automation |
| `/admin/settings` | Site name, default disclosure, Meta Pixel, GA4 |
| `/rekomendasi/<slug>` | Public landing page with affiliate CTAs |
| `/go/<slug>` | 307 redirect to the Shopee URL with UTM persistence + click logging |
| `/api/*` | JSON API for products, landing pages, ad spend, reports, settings, api keys |

---

## How click tracking works

When a user opens `/go/<slug>?utm_source=...`:

1. The handler looks up the product (Supabase first, mock fallback).
2. UTM params are forwarded onto the destination URL.
3. If `SUPABASE_SERVICE_ROLE_KEY` is set, a row is inserted into `click_events` containing the hashed IP, device/browser/OS, UTM params, referer, and bot/duplicate flags. Logging is best-effort — a failed insert never blocks the redirect.
4. The user is 307-redirected to the destination.

The dashboard reads from `click_events` and `ad_spend_reports` to compute CTR, CPC, conversions, ROAS, and duplicate/bot rate.

---

## Troubleshooting

- **Vercel returns 404 on every page** — your default branch is empty or stale. Make sure the branch with the app code is set as **Production Branch** in Vercel and redeploy.
- **`/admin/*` redirects me to `/admin/login` even after signing in** — confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in **all** Vercel environments (Production + Preview + Development), then redeploy. The middleware needs them to verify the cookie session.
- **"SUPABASE_NOT_CONFIGURED" when creating products** — the service role key is missing. Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel and redeploy.
- **Public `/rekomendasi/*` page returns 404** — make sure landing page status is `published` and the slug is correct. The seed data ships `produk-viral` and `top-finds` as published examples.
- **Click events never show up in `/admin/clicks`** — confirm `SUPABASE_SERVICE_ROLE_KEY` is set in production. Without it, the redirect still works but logging is skipped.

---

## Tech stack

- Next.js 15 (App Router, server components)
- Tailwind CSS + lucide-react icons
- Supabase (Postgres, Auth, Row Level Security) via `@supabase/ssr` + `@supabase/supabase-js`
- Zod for API request validation
