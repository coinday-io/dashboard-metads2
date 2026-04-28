# Test Plan — Affiliate Click Dashboard MVP (PR #1)

## What's being tested
A brand-new Next.js dashboard built to match the supplied Meta Ads Manager mock. The PR adds an admin overview UI, sidebar navigation, a Landing Page & Redirect Builder pane, public `/rekomendasi/[slug]` landing pages, and a `/go/[slug]` redirect endpoint backed by an in-memory mock dataset.

## Target environment
Local dev server (`npm run dev` on `http://localhost:3000`) running off branch `devin/1777329608-build-dashboard`.

---

## Test 1 — Admin overview matches the reference mock
**Steps**
1. Navigate to `http://localhost:3000/admin`.

**Pass criteria (all must hold)**
- Dark navy left sidebar with "Meta" wordmark/icon, "Acme Growth" account dropdown in the top bar.
- Sidebar nav items in this exact order: Overview, Campaigns, Ad Sets, Ads, Audiences, Reports, Attribution, Billing, Pixels, Settings, with Overview highlighted.
- Five KPI cards in the order: **CTR (Link)**, **CPC (Link)**, **Clicks (Link)**, **Conversions**, **ROAS (Purchase)**, each showing a number, an arrow + percentage delta, and a sparkline svg.
- Numeric values from mock data: **2.45%**, **$0.62**, **24,532**, **1,253**, **4.32**.
- "Performance Over Time" card with three colored series labels: Clicks (Link), Conversions, ROAS (Purchase).
- "Top Campaigns" card with a "By ROAS" select and at least 5 campaign rows ranked by ROAS — top entry text contains "Acme | Prospecting | US" and "5.21".
- Campaigns table with columns: (toggle), Campaign, Delivery, Budget, Results, CTR (Link), CPC (Link), ROAS (Purchase). One row labeled "Acme | Advantage+ | US" must be `Paused` (gray badge), all others `Active` (green badge).
- Right pane contains "Landing Page & Redirect Builder" with "Add Section" rail (Hero, Text, Image, Form, Benefits, Testimonials, FAQ, Footer, Divider) and Settings/Styles inspector with controls Section ID `hero-01`, Visibility, Layout, Columns, Background `#F6F7F9`, Spacing.

**Why this is adversarial**: a broken layout, wrong sidebar order, missing builder pane, or different KPI numbers would make this test visibly fail.

---

## Test 2 — Sidebar navigates between admin pages
**Steps**
1. From `/admin`, click each sidebar entry in turn: Campaigns, Ad Sets, Ads, Audiences, Reports, Attribution, Billing, Pixels, Settings.

**Pass criteria**
- Each click navigates to a path under `/admin/...` and renders without a runtime / 404 error.
- The page heading visibly changes between clicks (i.e. each route renders distinct content, not a cached overview).

---

## Test 3 — Public landing page renders mock products
**Steps**
1. Navigate to `http://localhost:3000/rekomendasi/produk-viral`.

**Pass criteria**
- Hero shows the title **"Rekomendasi Produk Viral Minggu Ini"** and an "Affiliate Picks" eyebrow.
- Three product cards are rendered (mock data: Viral Kitchen Organizer, Smart LED Strip RGB, Mini Portable Blender).
- Each card has a blue **"Cek di Shopee"** CTA button.
- Disclosure banner contains the text "link affiliate".

---

## Test 4 — Redirect endpoint logs and forwards (the core MVP behavior)
**Steps**
1. Hover the first card's "Cek di Shopee" CTA on `/rekomendasi/produk-viral` and confirm the href is `/go/viral-kitchen-organizer?utm_source=landing&utm_medium=affiliate&utm_campaign=produk-viral`.
2. Click the CTA.

**Pass criteria**
- Browser is redirected to a URL on `shopee.co.id` (the mock destination).
- The final URL preserves the UTM params from step 1 (`utm_source=landing`, `utm_medium=affiliate`, `utm_campaign=produk-viral`).

**Negative case**
3. In a new tab, navigate to `http://localhost:3000/go/this-slug-does-not-exist`.
- Expect an HTTP 404 response with JSON body containing `"code":"NOT_FOUND"`.

**Why this is adversarial**: tests both the happy-path 307 redirect with UTM forwarding and the 404 branch — a redirect that drops UTMs, redirects to the wrong host, or fails to 404 unknown slugs would fail visibly.

---

## Out of scope for this run
- Live Supabase / RLS behavior (mock data layer only).
- Auth on `/admin/*` (placeholder login page only).
- Click logging persistence (mock dataset is read-only).

These are explicitly noted in the PR description and will be marked `untested` in the report.
