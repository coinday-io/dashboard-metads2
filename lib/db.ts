import 'server-only';
import { adSpendReports as mockAdSpend, campaignReports as mockCampaigns, chartPoints as mockChartPoints, clickEvents as mockClicks, dashboardMetrics as mockMetrics, landingPages as mockLandings, products as mockProducts } from './data';
import { getServiceSupabase, isServiceRoleConfigured } from './supabase/server';
import type { AdSpendReport, ClickEvent, LandingPage, Product } from './types';

type ProductRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  destination_url: string;
  category: string | null;
  source_platform: string | null;
  status: 'active' | 'inactive';
  created_at: string;
};

type LandingRow = {
  id: string;
  title: string;
  slug: string;
  intro: string | null;
  status: 'draft' | 'published' | 'archived';
  disclosure_text: string | null;
  created_at: string;
};

type LandingProductRow = { landing_page_id: string; product_id: string; sort_order: number | null };

type ClickRow = {
  id: string;
  product_slug: string | null;
  landing_page_slug: string | null;
  redirect_slug: string | null;
  destination_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  device_type: string | null;
  country: string | null;
  is_duplicate: boolean | null;
  is_bot: boolean | null;
  created_at: string;
};

type AdSpendRow = {
  id: string;
  report_date: string;
  campaign_name: string;
  adset_name: string | null;
  ad_name: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  spend: number;
  impressions: number | null;
  link_clicks: number | null;
  landing_page_views: number | null;
};

function mapProduct(row: ProductRow, totals?: { totalClicks: number; affiliateClicks: number }): Product {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? '',
    imageUrl: row.image_url ?? '',
    destinationUrl: row.destination_url,
    category: row.category ?? '',
    sourcePlatform: row.source_platform ?? 'shopee',
    status: row.status,
    totalClicks: totals?.totalClicks ?? 0,
    affiliateClicks: totals?.affiliateClicks ?? 0,
    conversionRate: 0,
    createdAt: row.created_at,
  };
}

function mapLanding(row: LandingRow, productIds: string[], stats?: { views: number; buttonClicks: number }): LandingPage {
  const buttonClicks = stats?.buttonClicks ?? 0;
  const views = stats?.views ?? 0;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    intro: row.intro ?? '',
    status: row.status,
    products: productIds,
    views,
    buttonClicks,
    ctr: views > 0 ? Math.round((buttonClicks / views) * 1000) / 10 : 0,
    disclosureText: row.disclosure_text ?? '',
  };
}

function mapClick(row: ClickRow): ClickEvent {
  return {
    id: row.id,
    productSlug: row.product_slug ?? '',
    landingPageSlug: row.landing_page_slug ?? undefined,
    redirectSlug: row.redirect_slug ?? '',
    destinationUrl: row.destination_url ?? '',
    utmSource: row.utm_source ?? '',
    utmMedium: row.utm_medium ?? '',
    utmCampaign: row.utm_campaign ?? '',
    utmContent: row.utm_content ?? '',
    utmTerm: row.utm_term ?? '',
    referrer: row.referrer ?? '',
    deviceType: row.device_type ?? '',
    country: row.country ?? '',
    isDuplicate: Boolean(row.is_duplicate),
    isBot: Boolean(row.is_bot),
    createdAt: row.created_at,
  };
}

function mapAdSpend(row: AdSpendRow): AdSpendReport {
  return {
    id: row.id,
    reportDate: row.report_date,
    campaignName: row.campaign_name,
    adsetName: row.adset_name ?? '',
    adName: row.ad_name ?? '',
    utmCampaign: row.utm_campaign ?? '',
    utmContent: row.utm_content ?? '',
    spend: Number(row.spend ?? 0),
    impressions: row.impressions ?? 0,
    linkClicks: row.link_clicks ?? 0,
    landingPageViews: row.landing_page_views ?? 0,
  };
}

export async function listProducts(): Promise<Product[]> {
  const sb = getServiceSupabase();
  if (!sb) return mockProducts;
  const { data, error } = await sb.from('affiliate_products').select('*').order('created_at', { ascending: false });
  if (error || !data) return mockProducts;
  const slugs = data.map((row) => row.slug);
  const totals = await aggregateClickTotalsBySlug(slugs);
  return (data as ProductRow[]).map((row) => mapProduct(row, totals[row.slug]));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sb = getServiceSupabase();
  if (!sb) return mockProducts.find((p) => p.slug === slug) ?? null;
  const { data } = await sb.from('affiliate_products').select('*').eq('slug', slug).maybeSingle();
  if (!data) return null;
  return mapProduct(data as ProductRow);
}

export async function listLandingPages(): Promise<LandingPage[]> {
  const sb = getServiceSupabase();
  if (!sb) return mockLandings;
  const { data: pages } = await sb.from('landing_pages').select('*').order('created_at', { ascending: false });
  if (!pages) return mockLandings;
  const ids = pages.map((row: LandingRow) => row.id);
  const { data: links } = ids.length ? await sb.from('landing_page_products').select('*').in('landing_page_id', ids).order('sort_order', { ascending: true }) : { data: [] as LandingProductRow[] };
  const linkMap = new Map<string, string[]>();
  for (const link of (links ?? []) as LandingProductRow[]) {
    const arr = linkMap.get(link.landing_page_id) ?? [];
    arr.push(link.product_id);
    linkMap.set(link.landing_page_id, arr);
  }
  const slugs = pages.map((row: LandingRow) => row.slug);
  const stats = await aggregateLandingStats(slugs);
  return (pages as LandingRow[]).map((row) => mapLanding(row, linkMap.get(row.id) ?? [], stats[row.slug]));
}

export async function getLandingPageBySlug(slug: string): Promise<{ page: LandingPage; products: Product[] } | null> {
  const sb = getServiceSupabase();
  if (!sb) {
    const page = mockLandings.find((p) => p.slug === slug);
    if (!page) return null;
    const productList = mockProducts.filter((p) => page.products.includes(p.id));
    return { page, products: productList };
  }
  const { data: page } = await sb.from('landing_pages').select('*').eq('slug', slug).maybeSingle();
  if (!page) return null;
  const { data: links } = await sb.from('landing_page_products').select('product_id, sort_order').eq('landing_page_id', (page as LandingRow).id).order('sort_order', { ascending: true });
  const productIds = (links ?? []).map((l: { product_id: string }) => l.product_id);
  if (!productIds.length) return { page: mapLanding(page as LandingRow, []), products: [] };
  const { data: productRows } = await sb.from('affiliate_products').select('*').in('id', productIds);
  const productList = (productRows ?? []).map((row: ProductRow) => mapProduct(row));
  productList.sort((a, b) => productIds.indexOf(a.id) - productIds.indexOf(b.id));
  return { page: mapLanding(page as LandingRow, productIds), products: productList };
}

export async function listClicks(opts: { limit?: number; campaign?: string } = {}): Promise<ClickEvent[]> {
  const sb = getServiceSupabase();
  if (!sb) {
    return opts.campaign ? mockClicks.filter((c) => c.utmCampaign === opts.campaign) : mockClicks;
  }
  let query = sb.from('click_events').select('*').order('created_at', { ascending: false }).limit(opts.limit ?? 100);
  if (opts.campaign) query = query.eq('utm_campaign', opts.campaign);
  const { data } = await query;
  return ((data ?? []) as ClickRow[]).map(mapClick);
}

export async function listAdSpend(): Promise<AdSpendReport[]> {
  const sb = getServiceSupabase();
  if (!sb) return mockAdSpend;
  const { data } = await sb.from('ad_spend_reports').select('*').order('report_date', { ascending: false });
  return ((data ?? []) as AdSpendRow[]).map(mapAdSpend);
}

async function aggregateClickTotalsBySlug(slugs: string[]) {
  const totals: Record<string, { totalClicks: number; affiliateClicks: number }> = {};
  if (!slugs.length) return totals;
  const sb = getServiceSupabase();
  if (!sb) return totals;
  const { data } = await sb.from('click_events').select('product_slug, is_duplicate, is_bot').in('product_slug', slugs);
  for (const row of (data ?? []) as { product_slug: string; is_duplicate: boolean; is_bot: boolean }[]) {
    const slug = row.product_slug;
    if (!slug) continue;
    totals[slug] ??= { totalClicks: 0, affiliateClicks: 0 };
    totals[slug].totalClicks += 1;
    if (!row.is_duplicate && !row.is_bot) totals[slug].affiliateClicks += 1;
  }
  return totals;
}

async function aggregateLandingStats(slugs: string[]) {
  const stats: Record<string, { views: number; buttonClicks: number }> = {};
  if (!slugs.length) return stats;
  const sb = getServiceSupabase();
  if (!sb) return stats;
  const { data } = await sb.from('click_events').select('landing_page_slug, is_duplicate, is_bot').in('landing_page_slug', slugs);
  for (const row of (data ?? []) as { landing_page_slug: string; is_duplicate: boolean; is_bot: boolean }[]) {
    const slug = row.landing_page_slug;
    if (!slug) continue;
    stats[slug] ??= { views: 0, buttonClicks: 0 };
    stats[slug].views += 1;
    if (!row.is_duplicate && !row.is_bot) stats[slug].buttonClicks += 1;
  }
  return stats;
}

export async function getDashboardMetrics() {
  const sb = getServiceSupabase();
  if (!sb) return { metrics: mockMetrics, campaigns: mockCampaigns, chart: mockChartPoints };
  const { data: clicks } = await sb.from('click_events').select('product_slug, utm_campaign, is_duplicate, is_bot, created_at');
  const { data: ad } = await sb.from('ad_spend_reports').select('report_date, campaign_name, utm_campaign, spend, impressions, link_clicks, landing_page_views');
  const adRows = (ad ?? []) as AdSpendRow[];
  const clickRows = (clicks ?? []) as { product_slug: string | null; utm_campaign: string | null; is_duplicate: boolean | null; is_bot: boolean | null; created_at: string }[];
  if (!clickRows.length && !adRows.length) return { metrics: mockMetrics, campaigns: mockCampaigns, chart: mockChartPoints };

  const totalSpend = adRows.reduce((sum, row) => sum + Number(row.spend ?? 0), 0);
  const totalLinkClicks = adRows.reduce((sum, row) => sum + Number(row.link_clicks ?? 0), 0);
  const totalImpressions = adRows.reduce((sum, row) => sum + Number(row.impressions ?? 0), 0);
  const redirectClicks = clickRows.filter((c) => !c.is_duplicate && !c.is_bot).length;
  const duplicateRate = clickRows.length ? (clickRows.filter((c) => c.is_duplicate).length / clickRows.length) * 100 : 0;
  const botRate = clickRows.length ? (clickRows.filter((c) => c.is_bot).length / clickRows.length) * 100 : 0;
  const ctr = totalImpressions ? (totalLinkClicks / totalImpressions) * 100 : 0;
  const cpc = totalLinkClicks ? totalSpend / totalLinkClicks : 0;
  const conversions = redirectClicks;
  const roas = totalSpend ? (conversions * 1) / totalSpend : 0;

  const campaignMap = new Map<string, { spend: number; linkClicks: number; impressions: number; redirectClicks: number; affiliateClicks: number }>();
  for (const row of adRows) {
    const key = row.utm_campaign ?? row.campaign_name;
    const existing = campaignMap.get(key) ?? { spend: 0, linkClicks: 0, impressions: 0, redirectClicks: 0, affiliateClicks: 0 };
    existing.spend += Number(row.spend ?? 0);
    existing.linkClicks += Number(row.link_clicks ?? 0);
    existing.impressions += Number(row.impressions ?? 0);
    campaignMap.set(key, existing);
  }
  for (const c of clickRows) {
    const key = c.utm_campaign ?? '';
    const existing = campaignMap.get(key) ?? { spend: 0, linkClicks: 0, impressions: 0, redirectClicks: 0, affiliateClicks: 0 };
    existing.redirectClicks += 1;
    if (!c.is_duplicate && !c.is_bot) existing.affiliateClicks += 1;
    campaignMap.set(key, existing);
  }

  const campaigns = Array.from(campaignMap.entries()).map(([name, c]) => ({
    name,
    delivery: 'Active' as const,
    budget: c.spend,
    spend: c.spend,
    impressions: c.impressions,
    linkClicks: c.linkClicks,
    redirectClicks: c.redirectClicks,
    affiliateClicks: c.affiliateClicks,
    ctr: c.impressions ? (c.linkClicks / c.impressions) * 100 : 0,
    cpc: c.linkClicks ? c.spend / c.linkClicks : 0,
    costPerRedirectClick: c.redirectClicks ? c.spend / c.redirectClicks : 0,
    costPerAffiliateClick: c.affiliateClicks ? c.spend / c.affiliateClicks : 0,
    roas: c.spend ? c.affiliateClicks / c.spend : 0,
    conversions: c.affiliateClicks,
  }));

  const dayMap = new Map<string, { clicks: number; conversions: number }>();
  for (const c of clickRows) {
    const day = c.created_at.slice(0, 10);
    const existing = dayMap.get(day) ?? { clicks: 0, conversions: 0 };
    existing.clicks += 1;
    if (!c.is_duplicate && !c.is_bot) existing.conversions += 1;
    dayMap.set(day, existing);
  }
  const chart = Array.from(dayMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-7)
    .map(([day, v]) => ({ day, clicks: v.clicks, conversions: v.conversions, roas: v.clicks ? v.conversions / Math.max(v.clicks, 1) : 0 }));

  return {
    metrics: { ctr: Math.round(ctr * 100) / 100, cpc: Math.round(cpc * 100) / 100, clicks: totalLinkClicks, conversions, roas: Math.round(roas * 100) / 100, affiliateClicks: redirectClicks, redirectClicks, duplicateRate: Math.round(duplicateRate * 10) / 10, botRate: Math.round(botRate * 10) / 10 },
    campaigns: campaigns.length ? campaigns : mockCampaigns,
    chart: chart.length ? chart : mockChartPoints,
  };
}

export async function getSettings() {
  const sb = getServiceSupabase();
  if (!sb) return { site_name: 'Affiliate Click Dashboard', site_url: 'https://yourdomain.com', default_disclosure_text: 'Beberapa link di halaman ini adalah link affiliate.', meta_pixel_id: '', ga4_measurement_id: '', global_head_script: '', global_body_script: '' };
  const { data } = await sb.from('site_settings').select('*').limit(1).maybeSingle();
  if (!data) return { site_name: 'Affiliate Click Dashboard', site_url: '', default_disclosure_text: '', meta_pixel_id: '', ga4_measurement_id: '', global_head_script: '', global_body_script: '' };
  return data;
}

export async function listApiKeys() {
  const sb = getServiceSupabase();
  if (!sb) return [{ id: 'key_1', name: 'Hermes Agent Production Key', key_prefix: 'aff_live_a7f4', scopes: ['products:read', 'reports:read'], status: 'active', last_used_at: null, expires_at: null, created_at: '2026-04-27T00:00:00.000Z' }];
  const { data } = await sb.from('api_keys').select('id, name, key_prefix, scopes, status, last_used_at, expires_at, created_at').order('created_at', { ascending: false });
  return data ?? [];
}

export { isServiceRoleConfigured };
