import { ok, paginate } from '@/lib/api';
import { listClicks } from '@/lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const campaign = url.searchParams.get('campaign') ?? undefined;
  const all = await listClicks({ campaign, limit: 500 });
  const { items, meta } = paginate(all, Number(url.searchParams.get('page') ?? 1), Number(url.searchParams.get('pageSize') ?? 50));
  return ok(items, meta);
}
