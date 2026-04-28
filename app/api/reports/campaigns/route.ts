import { ok } from '@/lib/api';
import { getDashboardMetrics } from '@/lib/db';

export async function GET() {
  const { campaigns } = await getDashboardMetrics();
  return ok(campaigns);
}
