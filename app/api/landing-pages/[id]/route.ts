import { apiError, ok, readJson } from '@/lib/api';
import { getServerSupabase, getServiceSupabase } from '@/lib/supabase/server';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  intro: z.string().nullable().optional(),
  disclosure_text: z.string().nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  product_ids: z.array(z.string()).optional(),
});

async function requireAuth() {
  const auth = await getServerSupabase();
  if (!auth) return null;
  const { data: { user } } = await auth.auth.getUser();
  return user ? auth : false;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await requireAuth();
  if (authed === false) return apiError('UNAUTHORIZED', 'Sign in required', 401);
  const { id } = await params;
  const body = await readJson(request);
  if (!body.ok) return body.response;
  const parsed = updateSchema.safeParse(body.data);
  if (!parsed.success) return apiError('VALIDATION_ERROR', 'Invalid request body', 422, parsed.error.issues);
  const supabase = getServiceSupabase();
  if (!supabase) return apiError('SUPABASE_NOT_CONFIGURED', 'Set SUPABASE_SERVICE_ROLE_KEY to enable writes.', 503);
  const { product_ids, ...rest } = parsed.data;
  if (Object.keys(rest).length) {
    const { error } = await supabase.from('landing_pages').update(rest).eq('id', id);
    if (error) return apiError('UPDATE_FAILED', error.message, 500);
  }
  if (product_ids) {
    const { error: deleteError } = await supabase.from('landing_page_products').delete().eq('landing_page_id', id);
    if (deleteError) return apiError('DELETE_FAILED', deleteError.message, 500);
    if (product_ids.length) {
      const links = product_ids.map((product_id, index) => ({ landing_page_id: id, product_id, sort_order: index }));
      const { error: insertError } = await supabase.from('landing_page_products').insert(links);
      if (insertError) return apiError('INSERT_FAILED', insertError.message, 500);
    }
  }
  return ok({ id });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await requireAuth();
  if (authed === false) return apiError('UNAUTHORIZED', 'Sign in required', 401);
  const { id } = await params;
  const supabase = getServiceSupabase();
  if (!supabase) return apiError('SUPABASE_NOT_CONFIGURED', 'Set SUPABASE_SERVICE_ROLE_KEY to enable writes.', 503);
  const { error } = await supabase.from('landing_pages').delete().eq('id', id);
  if (error) return apiError('DELETE_FAILED', error.message, 500);
  return ok({ id });
}
