import { created, ok, paginate } from '@/lib/api';
import { adSpendReports } from '@/lib/data';
import { z } from 'zod';

const schema = z.object({ report_date: z.string(), campaign_name: z.string(), spend: z.number(), impressions: z.number().default(0), link_clicks: z.number().default(0), landing_page_views: z.number().default(0), utm_campaign: z.string().optional(), utm_content: z.string().optional() });

export function GET(request: Request) {
  const url = new URL(request.url);
  const { items, meta } = paginate(adSpendReports, Number(url.searchParams.get('page') ?? 1), Number(url.searchParams.get('pageSize') ?? 25));
  return ok(items, meta);
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request body', details: parsed.error.issues } }, { status: 422 });
  return created({ id: crypto.randomUUID(), ...parsed.data });
}
