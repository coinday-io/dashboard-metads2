import { ok } from '@/lib/api';
import { campaignReports } from '@/lib/data';

export function GET() {
  return ok(campaignReports);
}
