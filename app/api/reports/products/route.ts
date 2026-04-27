import { ok } from '@/lib/api';
import { products } from '@/lib/data';

export function GET() {
  return ok(products.map((product) => ({ title: product.title, slug: product.slug, clicks: product.totalClicks, affiliate_clicks: product.affiliateClicks, conversion_rate: product.conversionRate })));
}
