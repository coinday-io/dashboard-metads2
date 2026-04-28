import { apiError, created, ok, paginate, readJson } from '@/lib/api';
import { listProducts } from '@/lib/db';
import { slugify } from '@/lib/format';
import { getServerSupabase, getServiceSupabase } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  destination_url: z.string().url(),
  image_url: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  source_platform: z.string().default('shopee'),
  status: z.enum(['active', 'inactive']).default('active'),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') ?? 1);
  const pageSize = Number(url.searchParams.get('pageSize') ?? 25);
  const q = url.searchParams.get('q')?.toLowerCase();
  const all = await listProducts();
  const filtered = q ? all.filter((product) => product.title.toLowerCase().includes(q) || product.slug.includes(q)) : all;
  const enriched = filtered.map((product) => ({ ...product, redirect_url: `/go/${product.slug}` }));
  const { items, meta } = paginate(enriched, page, pageSize);
  return ok(items, meta);
}

export async function POST(request: Request) {
  const auth = await getServerSupabase();
  if (auth) {
    const { data: { user } } = await auth.auth.getUser();
    if (!user) return apiError('UNAUTHORIZED', 'Sign in required', 401);
  }
  const body = await readJson(request);
  if (!body.ok) return body.response;
  const parsed = schema.safeParse(body.data);
  if (!parsed.success) return apiError('VALIDATION_ERROR', 'Invalid request body', 422, parsed.error.issues);
  const data = parsed.data;
  const slug = data.slug || slugify(data.title);
  const supabase = getServiceSupabase();
  if (!supabase) return apiError('SUPABASE_NOT_CONFIGURED', 'Set SUPABASE_SERVICE_ROLE_KEY to enable writes.', 503);
  const { data: row, error } = await supabase.from('affiliate_products').insert({
    title: data.title,
    slug,
    description: data.description ?? null,
    image_url: data.image_url || null,
    destination_url: data.destination_url,
    category: data.category ?? null,
    source_platform: data.source_platform,
    status: data.status,
  }).select().single();
  if (error || !row) return apiError('INSERT_FAILED', error?.message ?? 'Insert failed', 500);
  return created({ ...row, redirect_url: `/go/${slug}` });
}
