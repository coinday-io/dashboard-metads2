import { apiError, created, ok, paginate } from '@/lib/api';
import { listLandingPages } from '@/lib/db';
import { slugify } from '@/lib/format';
import { getServerSupabase, getServiceSupabase } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  intro: z.string().optional(),
  disclosure_text: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  product_ids: z.array(z.string()).default([]),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const all = await listLandingPages();
  const { items, meta } = paginate(all, Number(url.searchParams.get('page') ?? 1), Number(url.searchParams.get('pageSize') ?? 25));
  return ok(items, meta);
}

export async function POST(request: Request) {
  const auth = await getServerSupabase();
  if (auth) {
    const { data: { user } } = await auth.auth.getUser();
    if (!user) return apiError('UNAUTHORIZED', 'Sign in required', 401);
  }
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return apiError('VALIDATION_ERROR', 'Invalid request body', 422, parsed.error.issues);
  const data = parsed.data;
  const slug = data.slug || slugify(data.title);
  const supabase = getServiceSupabase();
  if (!supabase) return apiError('SUPABASE_NOT_CONFIGURED', 'Set SUPABASE_SERVICE_ROLE_KEY to enable writes.', 503);
  const { data: page, error } = await supabase.from('landing_pages').insert({
    title: data.title,
    slug,
    intro: data.intro ?? null,
    disclosure_text: data.disclosure_text ?? null,
    status: data.status,
  }).select().single();
  if (error || !page) return apiError('INSERT_FAILED', error?.message ?? 'Insert failed', 500);
  if (data.product_ids.length) {
    const links = data.product_ids.map((product_id, index) => ({ landing_page_id: page.id, product_id, sort_order: index }));
    await supabase.from('landing_page_products').insert(links);
  }
  return created({ ...page, public_url: `/rekomendasi/${slug}`, product_ids: data.product_ids });
}
