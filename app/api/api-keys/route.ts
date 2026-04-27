import { created, ok } from '@/lib/api';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(1), scopes: z.array(z.string()).default(['read']), expires_at: z.string().nullable().optional() });
const keys = [{ id: 'key_1', name: 'Hermes Agent Production Key', key_prefix: 'aff_live_a7f4', scopes: ['products:read', 'reports:read'], status: 'active', last_used_at: null, expires_at: null, created_at: '2026-04-27T00:00:00.000Z' }];

export function GET() { return ok(keys); }

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request body', details: parsed.error.issues } }, { status: 422 });
  const key = `aff_live_${crypto.randomUUID().replaceAll('-', '')}`;
  return created({ id: crypto.randomUUID(), name: parsed.data.name, key, key_prefix: key.slice(0, 13), scopes: parsed.data.scopes, created_at: new Date().toISOString() });
}
