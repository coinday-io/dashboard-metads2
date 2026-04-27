import { created, ok, paginate } from '@/lib/api';
import { clickEvents } from '@/lib/data';
import { z } from 'zod';

const schema = z.object({ product_slug: z.string(), redirect_slug: z.string(), utm_campaign: z.string().optional() });

export function GET(request: Request) {
  const url = new URL(request.url);
  const campaign = url.searchParams.get('campaign');
  const rows = campaign ? clickEvents.filter((event) => event.utmCampaign === campaign) : clickEvents;
  const { items, meta } = paginate(rows, Number(url.searchParams.get('page') ?? 1), Number(url.searchParams.get('pageSize') ?? 25));
  return ok(items, meta);
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request body', details: parsed.error.issues } }, { status: 422 });
  return created({ id: crypto.randomUUID(), ...parsed.data, created_at: new Date().toISOString() });
}
