import { apiError, created, ok, readJson } from '@/lib/api';
import { listApiKeys } from '@/lib/db';
import { getServerSupabase, getServiceSupabase } from '@/lib/supabase/server';
import { createHash, randomBytes } from 'node:crypto';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  scopes: z.array(z.string()).default(['read']),
  expires_at: z.string().nullable().optional(),
});

export async function GET() {
  return ok(await listApiKeys());
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
  const supabase = getServiceSupabase();
  if (!supabase) return apiError('SUPABASE_NOT_CONFIGURED', 'Set SUPABASE_SERVICE_ROLE_KEY to enable writes.', 503);
  const raw = randomBytes(24).toString('hex');
  const key = `aff_live_${raw}`;
  const keyHash = createHash('sha256').update(key).digest('hex');
  const { data, error } = await supabase.from('api_keys').insert({
    name: parsed.data.name,
    key_prefix: key.slice(0, 13),
    key_hash: keyHash,
    scopes: parsed.data.scopes,
    expires_at: parsed.data.expires_at ?? null,
  }).select('id, name, key_prefix, scopes, status, created_at').single();
  if (error || !data) return apiError('INSERT_FAILED', error?.message ?? 'Insert failed', 500);
  return created({ ...data, key });
}
