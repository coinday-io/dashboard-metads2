import { ok } from '@/lib/api';

const settings = { site_name: 'Affiliate Click Dashboard', site_url: 'https://yourdomain.com', default_disclosure_text: 'Beberapa link di halaman ini adalah link affiliate.', meta_pixel_id: '', ga4_measurement_id: '', global_head_script: '', global_body_script: '' };

export function GET() { return ok(settings); }

export async function PATCH(request: Request) { return ok({ ...settings, ...(await request.json()) }); }
