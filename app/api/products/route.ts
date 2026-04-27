import { created, ok, paginate } from '@/lib/api';
import { products } from '@/lib/data';
import { slugify } from '@/lib/format';
import { z } from 'zod';

const schema = z.object({ title: z.string().min(1), slug: z.string().optional(), destination_url: z.string().url(), source_platform: z.string().default('shopee'), status: z.enum(['active', 'inactive']).default('active') });

export function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') ?? 1);
  const pageSize = Number(url.searchParams.get('pageSize') ?? 25);
  const q = url.searchParams.get('q')?.toLowerCase();
  const rows = q ? products.filter((product) => product.title.toLowerCase().includes(q) || product.slug.includes(q)) : products;
  const { items, meta } = paginate(rows.map((product) => ({ ...product, redirect_url: `/go/${product.slug}` })), page, pageSize);
  return ok(items, meta);
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request body', details: parsed.error.issues } }, { status: 422 });
  const data = parsed.data;
  return created({ id: crypto.randomUUID(), title: data.title, slug: data.slug ?? slugify(data.title), destination_url: data.destination_url, source_platform: data.source_platform, status: data.status, redirect_url: `/go/${data.slug ?? slugify(data.title)}` });
}
