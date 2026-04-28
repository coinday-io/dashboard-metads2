import { apiError, ok } from '@/lib/api';
import { getServerSupabase, getServiceSupabase } from '@/lib/supabase/server';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getServerSupabase();
  if (auth) {
    const { data: { user } } = await auth.auth.getUser();
    if (!user) return apiError('UNAUTHORIZED', 'Sign in required', 401);
  }
  const { id } = await params;
  const supabase = getServiceSupabase();
  if (!supabase) return apiError('SUPABASE_NOT_CONFIGURED', 'Set SUPABASE_SERVICE_ROLE_KEY to enable writes.', 503);
  const { error } = await supabase.from('api_keys').update({ status: 'revoked' }).eq('id', id);
  if (error) return apiError('UPDATE_FAILED', error.message, 500);
  return ok({ id, status: 'revoked' });
}
