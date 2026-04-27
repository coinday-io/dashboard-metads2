import { ok } from '@/lib/api';
import { campaignReports, dashboardMetrics } from '@/lib/data';

export function GET() {
  const spend = campaignReports.reduce((sum, row) => sum + row.spend, 0);
  const redirectClicks = campaignReports.reduce((sum, row) => sum + row.redirectClicks, 0);
  const affiliateClicks = campaignReports.reduce((sum, row) => sum + row.affiliateClicks, 0);
  return ok({ spend, link_clicks: dashboardMetrics.clicks, redirect_clicks: redirectClicks, affiliate_clicks: affiliateClicks, cost_per_redirect_click: spend / redirectClicks, cost_per_affiliate_click: spend / affiliateClicks, duplicate_rate: dashboardMetrics.duplicateRate, bot_rate: dashboardMetrics.botRate, roas: dashboardMetrics.roas });
}
