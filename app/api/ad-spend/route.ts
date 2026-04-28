import { apiError, created, ok, paginate } from '@/lib/api';
import { listAdSpend } from '@/lib/db';
import { getServerSupabase, getServiceSupabase } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  report_date: z.string(),
  campaign_name: z.string().min(1),
  adset_name: z.string().optional(),
  ad_name: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  spend: z.coerce.number().nonnegative(),
  impressions: z.coerce.number().int().nonnegative().default(0),
  link_clicks: z.coerce.number().int().nonnegative().default(0),
  landing_page_views: z.coerce.number().int().nonnegative().default(0),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const all = await listAdSpend();
  const { items, meta } = paginate(all, Number(url.searchParams.get('page') ?? 1), Number(url.searchParams.get('pageSize') ?? 50));
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
  const supabase = getServiceSupabase();
  if (!supabase) return apiError('SUPABASE_NOT_CONFIGURED', 'Set SUPABASE_SERVICE_ROLE_KEY to enable writes.', 503);
  const { data, error } = await supabase.from('ad_spend_reports').insert(parsed.data).select().single();
  if (error || !data) return apiError('INSERT_FAILED', error?.message ?? 'Insert failed', 500);
  return created(data);
}
