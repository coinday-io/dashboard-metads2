# Test Report — Affiliate Click Dashboard MVP (PR #1)

**Branch tested:** `devin/1777329608-build-dashboard` @ commit `1b5df17`
**Environment:** Local `npm run dev` on `http://localhost:3000`
**Devin session:** https://app.devin.ai/sessions/921739d53aa041218985a807bd90a186

## Summary
All 4 tests passed end-to-end. The admin overview, sidebar navigation, public landing page, redirect (with UTM forwarding), and the unknown-slug 404 branch all behaved as expected. CI is green; the only review nit (dead `text-emerald-600 : text-emerald-600` ternary on KPI cards) was addressed in commit `1b5df17` before testing.

## Results

- **It should render the admin overview matching the Meta Ads Manager mock** — passed
- **It should navigate between admin pages via sidebar** — passed (Reports, Audiences/Products, Ad Sets all render)
- **It should render the public landing page with mock products** — passed
- **It should redirect /go/viral-kitchen-organizer to shopee.co.id with UTMs preserved** — passed
- **It should return 404 NOT_FOUND for an unknown /go slug** — passed

## Out of scope (explicitly untested)
- Live Supabase / RLS — mock data layer only.
- Auth on `/admin/*` — placeholder login page only.
- Click-event persistence — mock dataset is read-only.

These match the PR description and were scoped out in the test plan.

---

## Evidence

### Test 1 — Admin overview matches the mock

| Top of `/admin` | Scrolled — Campaigns table + builder |
|---|---|
| ![Admin overview top](https://app.devin.ai/attachments/d673a907-93d6-4ab1-8c39-ad4b06b154e5/screenshot_d9451dc944e84528912b4698806b1768.png) | ![Admin overview scrolled](https://app.devin.ai/attachments/0a2a3404-468c-41e6-973c-1a2ecd0ff653/screenshot_7bea23e9e91c441d856fa131b9241eaf.png) |
| Sidebar (Meta + Overview/Campaigns/Ad Sets/Ads/Audiences/Reports/Attribution/Billing/Pixels/Settings), KPIs **2.45%, $0.62, 24,532, 1,253, 4.32** with sparklines, Performance Over Time, Top Campaigns ranked by ROAS (Acme \| Prospecting \| US 5.21 etc.), and the Landing Page & Redirect Builder right pane (Add Section rail + canvas + Settings/Styles inspector). | Campaigns table with Active/Paused badges (Acme \| Advantage+ \| US shows `Paused`, the rest `Active`) and the builder's Form Section / Footer below the fold. |

### Test 2 — Sidebar navigation

| Reports (`/admin/reports`) | Audiences (`/admin/products`) |
|---|---|
| ![Reports page](https://app.devin.ai/attachments/789ec747-57c7-4742-8d61-b54f6fd37693/screenshot_5da6089004004be2af24e9e47be113aa.png) | _No screenshot — verified via DOM that `/admin/products` rendered the Affiliate Products table with `/go/<slug>` redirect URLs and active/inactive badges._ |
| Cost / Redirect Click `$0.36`, Cost / Affiliate Click `$0.42`, Duplicate Rate `3.6%`, Bot Rate `1.2%`, Click Trend chart, Campaign Economics + Top Products tables. | Renders 4 affiliate products with `/go/...` URLs, click counts, and active/inactive status. |

### Test 3 — Public landing page

| `/rekomendasi/produk-viral` |
|---|
| ![Public landing page](https://app.devin.ai/attachments/ec0cbd08-6d93-4bf7-9cdb-18b887cd4800/screenshot_aa8b425cb54e43dca3ab5afdaad896b5.png) |
| Navy hero with **Affiliate Picks** eyebrow + title **"Rekomendasi Produk Viral Minggu Ini"**, three product cards (Produk Viral Kitchen Organizer / Smart LED Strip RGB / Mini Portable Blender), each with a blue **"Cek di Shopee"** CTA, and the affiliate disclosure banner at the bottom. |

### Test 4 — `/go/[slug]` redirect + UTM forwarding

| 🟢 Active slug → shopee.co.id w/ UTMs | 🟢 Unknown slug → 404 JSON |
|---|---|
| ![Redirect to shopee.co.id with UTMs](https://app.devin.ai/attachments/dcfdd63a-630f-4404-9ced-4821c7adf84f/screenshot_247caf723d7048c790882f6917652159.png) | ![404 NOT_FOUND JSON](https://app.devin.ai/attachments/96d51c19-5104-4d96-b949-b2b9849bc54f/screenshot_0d4da6e54e3d47e9944891f0cc6cd987.png) |
| URL bar shows `shopee.co.id/?utm_source=landing&utm_medium=affiliate&utm_campaign=produk-viral` after clicking "Cek di Shopee" — UTM params from the landing-page link were forwarded to the destination. (Page is blank because the VM has no outbound internet to shopee.co.id; the redirect itself is what's under test.) | `/go/this-slug-does-not-exist` returns HTTP 404 with body `{"success":false,"error":{"code":"NOT_FOUND","message":"Redirect target not found","details":[]}}`. |

---

## Notes for the reviewer
- The `Acme | Advantage+ | US` row in the Campaigns table is intentionally `Paused` (gray badge) so the "off" state of the toggle is visible; the other four rows are `Active`.
- The KPI card trend colors now use `direction` (icon) + `favorable` (color) so a future negative trend will render `text-red-600`. The current dataset has only favorable trends (matching the design mock), so all five render in green.
- A short screen recording covering the full flow above is attached to the Devin session message.
