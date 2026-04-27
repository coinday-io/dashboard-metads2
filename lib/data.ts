import type { AdSpendReport, CampaignReport, ClickEvent, LandingPage, Product } from './types';

export const products: Product[] = [
  { id: 'p1', title: 'Produk Viral Kitchen Organizer', slug: 'viral-kitchen-organizer', description: 'Rak dapur minimalis dengan komisi affiliate tinggi.', imageUrl: '/product-kitchen.svg', destinationUrl: 'https://shopee.co.id/', category: 'Home', sourcePlatform: 'shopee', status: 'active', totalClicks: 8240, affiliateClicks: 3862, conversionRate: 4.8, createdAt: '2026-04-18' },
  { id: 'p2', title: 'Smart LED Strip RGB', slug: 'smart-led-strip-rgb', description: 'Lampu dekorasi kamar untuk audience Gen Z.', imageUrl: '/product-led.svg', destinationUrl: 'https://shopee.co.id/', category: 'Electronics', sourcePlatform: 'shopee', status: 'active', totalClicks: 6120, affiliateClicks: 2774, conversionRate: 3.9, createdAt: '2026-04-19' },
  { id: 'p3', title: 'Mini Portable Blender', slug: 'mini-portable-blender', description: 'Produk wellness praktis untuk konten video pendek.', imageUrl: '/product-blender.svg', destinationUrl: 'https://shopee.co.id/', category: 'Lifestyle', sourcePlatform: 'shopee', status: 'active', totalClicks: 5218, affiliateClicks: 2346, conversionRate: 3.4, createdAt: '2026-04-20' },
  { id: 'p4', title: 'Travel Cable Pouch', slug: 'travel-cable-pouch', description: 'Aksesoris travel murah dengan repeat buyer kuat.', imageUrl: '/product-pouch.svg', destinationUrl: 'https://shopee.co.id/', category: 'Travel', sourcePlatform: 'shopee', status: 'inactive', totalClicks: 3196, affiliateClicks: 1084, conversionRate: 2.1, createdAt: '2026-04-21' },
];

export const landingPages: LandingPage[] = [
  { id: 'lp1', title: 'Rekomendasi Produk Viral Minggu Ini', slug: 'produk-viral', intro: 'Kumpulan produk Shopee paling menarik untuk traffic Meta Ads minggu ini.', status: 'published', products: ['p1', 'p2', 'p3'], views: 18420, buttonClicks: 7256, ctr: 39.4, disclosureText: 'Beberapa link di halaman ini adalah link affiliate. Kami bisa menerima komisi tanpa biaya tambahan untuk kamu.' },
  { id: 'lp2', title: 'Top Finds Rumah & Gadget', slug: 'top-finds', intro: 'Landing page curated untuk audience broad Indonesia.', status: 'published', products: ['p1', 'p4'], views: 9420, buttonClicks: 2984, ctr: 31.7, disclosureText: 'Halaman ini berisi rekomendasi affiliate.' },
  { id: 'lp3', title: 'Barang Unik Flash Deal', slug: 'barang-unik', intro: 'Draft campaign untuk creative testing berikutnya.', status: 'draft', products: ['p2', 'p3'], views: 0, buttonClicks: 0, ctr: 0, disclosureText: 'Beberapa link adalah link affiliate.' },
];

export const clickEvents: ClickEvent[] = [
  { id: 'c1', productSlug: 'viral-kitchen-organizer', landingPageSlug: 'produk-viral', redirectSlug: 'viral-kitchen-organizer', destinationUrl: 'https://shopee.co.id/', utmSource: 'meta', utmMedium: 'paid', utmCampaign: 'acme_prospecting_us', utmContent: 'video_01', utmTerm: 'broad_id', referrer: 'facebook.com', deviceType: 'mobile', country: 'ID', isDuplicate: false, isBot: false, createdAt: '2026-04-27T09:12:00.000Z' },
  { id: 'c2', productSlug: 'smart-led-strip-rgb', landingPageSlug: 'produk-viral', redirectSlug: 'smart-led-strip-rgb', destinationUrl: 'https://shopee.co.id/', utmSource: 'meta', utmMedium: 'paid', utmCampaign: 'acme_retargeting_all', utmContent: 'carousel_02', utmTerm: 'warm_id', referrer: 'instagram.com', deviceType: 'mobile', country: 'ID', isDuplicate: false, isBot: false, createdAt: '2026-04-27T10:22:00.000Z' },
  { id: 'c3', productSlug: 'mini-portable-blender', landingPageSlug: 'top-finds', redirectSlug: 'mini-portable-blender', destinationUrl: 'https://shopee.co.id/', utmSource: 'meta', utmMedium: 'paid', utmCampaign: 'acme_lookalike_1', utmContent: 'image_03', utmTerm: 'lka_id', referrer: 'facebook.com', deviceType: 'desktop', country: 'ID', isDuplicate: false, isBot: false, createdAt: '2026-04-27T11:08:00.000Z' },
  { id: 'c4', productSlug: 'travel-cable-pouch', landingPageSlug: 'top-finds', redirectSlug: 'travel-cable-pouch', destinationUrl: 'https://shopee.co.id/', utmSource: 'meta', utmMedium: 'paid', utmCampaign: 'acme_advantage_us', utmContent: 'video_04', utmTerm: 'auto_id', referrer: 'facebook.com', deviceType: 'mobile', country: 'ID', isDuplicate: true, isBot: false, createdAt: '2026-04-27T12:40:00.000Z' },
  { id: 'c5', productSlug: 'viral-kitchen-organizer', landingPageSlug: 'produk-viral', redirectSlug: 'viral-kitchen-organizer', destinationUrl: 'https://shopee.co.id/', utmSource: 'meta', utmMedium: 'paid', utmCampaign: 'acme_conversions_us', utmContent: 'video_05', utmTerm: 'purchase_id', referrer: 'instagram.com', deviceType: 'mobile', country: 'ID', isDuplicate: false, isBot: false, createdAt: '2026-04-27T13:05:00.000Z' },
];

export const adSpendReports: AdSpendReport[] = [
  { id: 'a1', reportDate: '2026-04-27', campaignName: 'Acme | Prospecting | US', adsetName: 'Broad Indonesia', adName: 'Video 01', utmCampaign: 'acme_prospecting_us', utmContent: 'video_01', spend: 120, impressions: 22540, linkClicks: 586, landingPageViews: 524 },
  { id: 'a2', reportDate: '2026-04-27', campaignName: 'Acme | Retargeting | All', adsetName: 'Warm Visitors', adName: 'Carousel 02', utmCampaign: 'acme_retargeting_all', utmContent: 'carousel_02', spend: 80, impressions: 15420, linkClicks: 421, landingPageViews: 386 },
  { id: 'a3', reportDate: '2026-04-27', campaignName: 'Acme | Lookalike | 1%', adsetName: 'LAL Purchasers', adName: 'Image 03', utmCampaign: 'acme_lookalike_1', utmContent: 'image_03', spend: 100, impressions: 12880, linkClicks: 246, landingPageViews: 211 },
  { id: 'a4', reportDate: '2026-04-27', campaignName: 'Acme | Advantage+ | US', adsetName: 'Advantage+', adName: 'Video 04', utmCampaign: 'acme_advantage_us', utmContent: 'video_04', spend: 90, impressions: 10400, linkClicks: 193, landingPageViews: 168 },
  { id: 'a5', reportDate: '2026-04-27', campaignName: 'Acme | Conversions | US', adsetName: 'Purchase Optimized', adName: 'Video 05', utmCampaign: 'acme_conversions_us', utmContent: 'video_05', spend: 60, impressions: 8560, linkClicks: 178, landingPageViews: 153 },
];

export const campaignReports: CampaignReport[] = [
  { name: 'Acme | Prospecting | US', delivery: 'Active', budget: 120, spend: 120, impressions: 22540, linkClicks: 586, redirectClicks: 542, affiliateClicks: 493, ctr: 2.61, cpc: 0.58, costPerRedirectClick: 0.22, costPerAffiliateClick: 0.24, roas: 5.21, conversions: 586 },
  { name: 'Acme | Retargeting | All', delivery: 'Active', budget: 80, spend: 80, impressions: 15420, linkClicks: 421, redirectClicks: 403, affiliateClicks: 372, ctr: 3.11, cpc: 0.48, costPerRedirectClick: 0.2, costPerAffiliateClick: 0.22, roas: 4.08, conversions: 421 },
  { name: 'Acme | Lookalike | 1%', delivery: 'Active', budget: 100, spend: 100, impressions: 12880, linkClicks: 246, redirectClicks: 229, affiliateClicks: 210, ctr: 2.34, cpc: 0.61, costPerRedirectClick: 0.44, costPerAffiliateClick: 0.48, roas: 3.75, conversions: 246 },
  { name: 'Acme | Advantage+ | US', delivery: 'Paused', budget: 90, spend: 90, impressions: 10400, linkClicks: 193, redirectClicks: 166, affiliateClicks: 142, ctr: 1.98, cpc: 0.7, costPerRedirectClick: 0.54, costPerAffiliateClick: 0.63, roas: 3.12, conversions: 193 },
  { name: 'Acme | Conversions | US', delivery: 'Active', budget: 60, spend: 60, impressions: 8560, linkClicks: 178, redirectClicks: 158, affiliateClicks: 147, ctr: 2.17, cpc: 0.65, costPerRedirectClick: 0.38, costPerAffiliateClick: 0.41, roas: 2.44, conversions: 178 },
];

export const chartPoints = [
  { day: 'May 12', clicks: 3100, conversions: 1500, roas: 1.2 },
  { day: 'May 13', clicks: 3700, conversions: 2300, roas: 1.7 },
  { day: 'May 14', clicks: 4050, conversions: 2700, roas: 2.6 },
  { day: 'May 15', clicks: 5600, conversions: 3750, roas: 1.5 },
  { day: 'May 16', clicks: 5000, conversions: 3100, roas: 1.4 },
  { day: 'May 17', clicks: 4300, conversions: 3050, roas: 2.3 },
  { day: 'May 18', clicks: 6000, conversions: 3500, roas: 4.3 },
];

export const dashboardMetrics = {
  ctr: 2.45,
  cpc: 0.62,
  clicks: 24532,
  conversions: 1253,
  roas: 4.32,
  affiliateClicks: 10789,
  redirectClicks: 12498,
  duplicateRate: 3.6,
  botRate: 1.2,
};

export function findProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function findLandingPageBySlug(slug: string) {
  return landingPages.find((page) => page.slug === slug);
}
