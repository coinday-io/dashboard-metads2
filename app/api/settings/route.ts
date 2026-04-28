import { apiError, ok, readJson } from '@/lib/api';
import { getSettings } from '@/lib/db';
import { getServerSupabase, getServiceSupabase } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  site_name: z.string().optional(),
  site_url: z.string().optional(),
  default_disclosure_text: z.string().optional(),
  meta_pixel_id: z.string().optional(),
  ga4_measurement_id: z.string().optional(),
  global_head_script: z.string().optional(),
  global_body_script: z.string().optional(),
});

export async function GET() {
  return ok(await getSettings());
}

export async function PATCH(request: Request) {
  const auth = await getServerSupabase();
  if (auth) {
    const { data: { user } } = await auth.auth.getUser();
    if (!user) return apiError('UNAUTHORIZED', 'Sign in required', 401);
  }
  const body = await readJson(request);
  if (!body.ok) return body.response;
  const parsed = schema.safeParse(body.data);
  if (!parsed.success) return apiError('VALIDATION_ERROR', 'Invalid request body', 422, parsed.error.issues);
  const supabase = getServiceSupabase();
  if (!supabase) return apiError('SUPABASE_NOT_CONFIGURED', 'Set SUPABASE_SERVICE_ROLE_KEY to enable writes.', 503);
  const { data: existing } = await supabase.from('site_settings').select('id').limit(1).maybeSingle();
  let data;
  if (existing) {
    const res = await supabase.from('site_settings').update({ ...parsed.data, updated_at: new Date().toISOString() }).eq('id', existing.id).select().single();
    data = res.data;
    if (res.error) return apiError('UPDATE_FAILED', res.error.message, 500);
  } else {
    const res = await supabase.from('site_settings').insert(parsed.data).select().single();
    data = res.data;
    if (res.error) return apiError('INSERT_FAILED', res.error.message, 500);
  }
  return ok(data);
}
