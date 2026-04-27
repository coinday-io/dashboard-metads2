# Affiliate Click Dashboard

A Next.js App Router MVP for managing affiliate products, redirect URLs, landing pages, click tracking, ad spend, reports, and private automation APIs.

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000/admin` for the dashboard.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Supabase

The `supabase/migrations` directory contains the production PostgreSQL schema, RLS policies, and indexes from the MVP spec. The app ships with local seed data so the dashboard and APIs work immediately without credentials.
