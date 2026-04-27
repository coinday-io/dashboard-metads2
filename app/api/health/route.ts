import { ok } from '@/lib/api';

export function GET() {
  return ok({ status: 'ok', app: 'Affiliate Click Dashboard', timestamp: new Date().toISOString() });
}
