import { apiError, ok } from '@/lib/api';
import { getLandingPageBySlug } from '@/lib/db';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getLandingPageBySlug(slug);
  if (!result || result.page.status !== 'published') return apiError('NOT_FOUND', 'Landing page not found', 404);
  return ok({ page: result.page, products: result.products });
}
