import { created, ok, paginate } from '@/lib/api';
import { landingPages } from '@/lib/data';
import { slugify } from '@/lib/format';
import { z } from 'zod';

const schema = z.object({ title: z.string().min(1), slug: z.string().optional(), intro: z.string().optional(), status: z.enum(['draft', 'published', 'archived']).default('draft'), products: z.array(z.object({ product_id: z.string(), sort_order: z.number().optional(), custom_cta: z.string().optional() })).default([]) });

export function GET(request: Request) {
  const url = new URL(request.url);
  const { items, meta } = paginate(landingPages, Number(url.searchParams.get('page') ?? 1), Number(url.searchParams.get('pageSize') ?? 25));
  return ok(items, meta);
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request body', details: parsed.error.issues } }, { status: 422 });
  return created({ id: crypto.randomUUID(), ...parsed.data, slug: parsed.data.slug ?? slugify(parsed.data.title), public_url: `/rekomendasi/${parsed.data.slug ?? slugify(parsed.data.title)}` });
}
