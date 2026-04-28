-- Seed sample products / landing pages so the dashboard renders immediately,
-- and ensures a single site_settings row exists. Idempotent: re-runnable.

insert into affiliate_products (slug, title, description, destination_url, category, source_platform, status)
values
  ('viral-kitchen-organizer', 'Produk Viral Kitchen Organizer', 'Rak dapur minimalis dengan komisi affiliate tinggi.', 'https://shopee.co.id/', 'Home', 'shopee', 'active'),
  ('smart-led-strip-rgb', 'Smart LED Strip RGB', 'Lampu dekorasi kamar untuk audience Gen Z.', 'https://shopee.co.id/', 'Electronics', 'shopee', 'active'),
  ('mini-portable-blender', 'Mini Portable Blender', 'Produk wellness praktis untuk konten video pendek.', 'https://shopee.co.id/', 'Lifestyle', 'shopee', 'active'),
  ('travel-cable-pouch', 'Travel Cable Pouch', 'Aksesoris travel murah dengan repeat buyer kuat.', 'https://shopee.co.id/', 'Travel', 'shopee', 'inactive')
on conflict (slug) do nothing;

insert into landing_pages (slug, title, intro, status, disclosure_text)
values
  ('produk-viral', 'Rekomendasi Produk Viral Minggu Ini', 'Kumpulan produk Shopee paling menarik untuk traffic Meta Ads minggu ini.', 'published', 'Beberapa link di halaman ini adalah link affiliate. Kami bisa menerima komisi tanpa biaya tambahan untuk kamu.'),
  ('top-finds', 'Top Finds Rumah & Gadget', 'Landing page curated untuk audience broad Indonesia.', 'published', 'Halaman ini berisi rekomendasi affiliate.')
on conflict (slug) do nothing;

-- Wire the first landing page to the first 3 products.
insert into landing_page_products (landing_page_id, product_id, sort_order)
select lp.id, p.id, p.rn - 1
from (select id from landing_pages where slug = 'produk-viral') lp
cross join lateral (
  select id, row_number() over (order by created_at) as rn
  from affiliate_products
  where slug in ('viral-kitchen-organizer', 'smart-led-strip-rgb', 'mini-portable-blender')
) p
on conflict (landing_page_id, product_id) do nothing;

insert into site_settings (site_name, site_url, default_disclosure_text)
select 'Affiliate Click Dashboard', '', 'Beberapa link di halaman ini adalah link affiliate. Saya bisa menerima komisi jika kamu membeli melalui link tersebut, tanpa biaya tambahan untuk kamu.'
where not exists (select 1 from site_settings);

-- Allow public (anon) reads of published landing pages and active products,
-- so the public /rekomendasi/[slug] route can fetch them via anon key if needed.
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Public can read published landing_pages' and tablename = 'landing_pages') then
    create policy "Public can read published landing_pages" on landing_pages for select to anon using (status = 'published');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public can read active affiliate_products' and tablename = 'affiliate_products') then
    create policy "Public can read active affiliate_products" on affiliate_products for select to anon using (status = 'active');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public can read landing_page_products' and tablename = 'landing_page_products') then
    create policy "Public can read landing_page_products" on landing_page_products for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public can read site_settings' and tablename = 'site_settings') then
    create policy "Public can read site_settings" on site_settings for select to anon using (true);
  end if;
end $$;
