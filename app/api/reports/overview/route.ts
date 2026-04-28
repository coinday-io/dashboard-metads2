import { ok } from '@/lib/api';
import { getDashboardMetrics } from '@/lib/db';

export async function GET() {
  const { metrics } = await getDashboardMetrics();
  return ok({
    spend: metrics.spend,
    link_clicks: metrics.clicks,
    redirect_clicks: metrics.redirectClicks,
    affiliate_clicks: metrics.affiliateClicks,
    cost_per_redirect_click: metrics.costPerRedirectClick,
    cost_per_affiliate_click: metrics.costPerAffiliateClick,
    duplicate_rate: metrics.duplicateRate,
    bot_rate: metrics.botRate,
    roas: metrics.roas,
    ctr: metrics.ctr,
    cpc: metrics.cpc,
  });
}
