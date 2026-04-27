export type Status = 'active' | 'inactive';

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  destinationUrl: string;
  category: string;
  sourcePlatform: string;
  status: Status;
  totalClicks: number;
  affiliateClicks: number;
  conversionRate: number;
  createdAt: string;
};

export type LandingPage = {
  id: string;
  title: string;
  slug: string;
  intro: string;
  status: 'draft' | 'published' | 'archived';
  products: string[];
  views: number;
  buttonClicks: number;
  ctr: number;
  disclosureText: string;
};

export type ClickEvent = {
  id: string;
  productSlug: string;
  landingPageSlug?: string;
  redirectSlug: string;
  destinationUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  referrer: string;
  deviceType: string;
  country: string;
  isDuplicate: boolean;
  isBot: boolean;
  createdAt: string;
};

export type AdSpendReport = {
  id: string;
  reportDate: string;
  campaignName: string;
  adsetName: string;
  adName: string;
  utmCampaign: string;
  utmContent: string;
  spend: number;
  impressions: number;
  linkClicks: number;
  landingPageViews: number;
};

export type CampaignReport = {
  name: string;
  delivery: 'Active' | 'Paused';
  budget: number;
  spend: number;
  impressions: number;
  linkClicks: number;
  redirectClicks: number;
  affiliateClicks: number;
  ctr: number;
  cpc: number;
  costPerRedirectClick: number;
  costPerAffiliateClick: number;
  roas: number;
  conversions: number;
};
