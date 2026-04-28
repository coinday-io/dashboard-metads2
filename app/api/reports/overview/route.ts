import { ok } from '@/lib/api';
import { getDashboardMetrics } from '@/lib/db';

export async function GET() {
  const { metrics } = await getDashboardMetrics();
  return ok({
    spend: 0,
    link_clicks: metrics.clicks,
    redirect_clicks: metrics.redirectClicks,
    affiliate_clicks: metrics.affiliateClicks,
    cost_per_redirect_click: metrics.cpc,
    cost_per_affiliate_click: metrics.cpc,
    duplicate_rate: metrics.duplicateRate,
    bot_rate: metrics.botRate,
    roas: metrics.roas,
    ctr: metrics.ctr,
    cpc: metrics.cpc,
  });
}
