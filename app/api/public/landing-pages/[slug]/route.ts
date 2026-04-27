import { apiError, ok } from '@/lib/api';
import { findLandingPageBySlug, products } from '@/lib/data';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findLandingPageBySlug(slug);
  if (!page || page.status !== 'published') return apiError('NOT_FOUND', 'Landing page not found', 404);
  return ok({ title: page.title, slug: page.slug, intro: page.intro, disclosure_text: page.disclosureText, products: products.filter((product) => page.products.includes(product.id) && product.status === 'active').map((product) => ({ title: product.title, slug: product.slug, description: product.description, image_url: product.imageUrl, cta: 'Cek di Shopee', redirect_url: `/go/${product.slug}` })) });
}
