import { apiError, ok, readJson } from '@/lib/api';
import { getServerSupabase, getServiceSupabase } from '@/lib/supabase/server';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  destination_url: z.string().url().optional(),
  image_url: z.string().url().nullable().optional().or(z.literal('')),
  category: z.string().nullable().optional(),
  source_platform: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
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
  const { data, error } = await supabase.from('affiliate_products').update(parsed.data).eq('id', id).select().single();
  if (error || !data) return apiError('UPDATE_FAILED', error?.message ?? 'Update failed', 500);
  return ok(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await requireAuth();
  if (authed === false) return apiError('UNAUTHORIZED', 'Sign in required', 401);
  const { id } = await params;
  const supabase = getServiceSupabase();
  if (!supabase) return apiError('SUPABASE_NOT_CONFIGURED', 'Set SUPABASE_SERVICE_ROLE_KEY to enable writes.', 503);
  const { error } = await supabase.from('affiliate_products').delete().eq('id', id);
  if (error) return apiError('DELETE_FAILED', error.message, 500);
  return ok({ id });
}
