import { ok } from '@/lib/api';
import { listProducts } from '@/lib/db';

export async function GET() {
  const products = await listProducts();
  return ok(products.map((product) => ({ title: product.title, slug: product.slug, clicks: product.totalClicks, affiliate_clicks: product.affiliateClicks, conversion_rate: product.conversionRate })));
}
