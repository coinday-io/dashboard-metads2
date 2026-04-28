import { getProductBySlug } from '@/lib/db';
import { findProductBySlug } from '@/lib/data';
import { getServiceSupabase } from '@/lib/supabase/server';
import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BOT_PATTERN = /(bot|crawl|spider|slurp|http\s?client|curl|wget|python-requests|axios|headless|java\/|fbexternalhit|facebookexternal|telegrambot|whatsapp|pinterest|preview|scanner)/i;
const DUP_WINDOW_MS = 30 * 1000;

const recentClicks = new Map<string, number>();
const RECENT_CLICKS_MAX = 5_000;
let recentClicksWrites = 0;

function pruneRecentClicks(now: number) {
  for (const [key, ts] of recentClicks) {
    if (now - ts > DUP_WINDOW_MS) recentClicks.delete(key);
  }
  if (recentClicks.size > RECENT_CLICKS_MAX) {
    const overflow = recentClicks.size - RECENT_CLICKS_MAX;
    let removed = 0;
    for (const key of recentClicks.keys()) {
      if (removed++ >= overflow) break;
      recentClicks.delete(key);
    }
  }
}

function classifyDevice(ua: string) {
  const lower = ua.toLowerCase();
  if (/(mobile|iphone|ipod|android.*mobile)/.test(lower)) return 'mobile';
  if (/(ipad|tablet)/.test(lower)) return 'tablet';
  return 'desktop';
}

function classifyBrowser(ua: string) {
  if (/Edg\//.test(ua)) return 'edge';
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return 'chrome';
  if (/Firefox\//.test(ua)) return 'firefox';
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'safari';
  return 'other';
}

function classifyOs(ua: string) {
  if (/Windows/.test(ua)) return 'windows';
  if (/Mac OS X/.test(ua)) return 'macos';
  if (/Android/.test(ua)) return 'android';
  if (/(iPhone|iPad|iPod)/.test(ua)) return 'ios';
  if (/Linux/.test(ua)) return 'linux';
  return 'other';
}

function hashIp(ip: string, salt: string) {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = (await getProductBySlug(slug)) ?? findProductBySlug(slug);
  if (!product || product.status !== 'active') {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Redirect target not found', details: [] } }, { status: 404 });
  }

  const redirectUrl = new URL(product.destinationUrl);
  const utmSource = request.nextUrl.searchParams.get('utm_source');
  const utmMedium = request.nextUrl.searchParams.get('utm_medium');
  const utmCampaign = request.nextUrl.searchParams.get('utm_campaign');
  const utmContent = request.nextUrl.searchParams.get('utm_content');
  const utmTerm = request.nextUrl.searchParams.get('utm_term');
  const lpSlug = request.nextUrl.searchParams.get('lp');
  for (const [key, value] of [['utm_source', utmSource], ['utm_medium', utmMedium], ['utm_campaign', utmCampaign], ['utm_content', utmContent], ['utm_term', utmTerm]] as const) {
    if (value) redirectUrl.searchParams.set(key, value);
  }

  const supabase = getServiceSupabase();
  if (supabase) {
    const ua = request.headers.get('user-agent') ?? '';
    const ipHeader = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '';
    const ip = ipHeader.split(',')[0]?.trim() || 'unknown';
    const salt = process.env.IP_HASH_SALT ?? process.env.API_KEY_SECRET ?? 'aff-dashboard-default-salt';
    const ipHash = hashIp(ip, salt);
    const isBot = BOT_PATTERN.test(ua);
    const dupKey = `${ipHash}:${slug}`;
    const now = Date.now();
    const last = recentClicks.get(dupKey) ?? 0;
    const isDuplicate = now - last < DUP_WINDOW_MS;
    recentClicks.set(dupKey, now);
    recentClicksWrites += 1;
    if (recentClicksWrites >= 100) {
      recentClicksWrites = 0;
      pruneRecentClicks(now);
    }

    try {
      await supabase.from('click_events').insert({
        product_id: (product as unknown as { id: string }).id ?? null,
        product_slug: product.slug,
        landing_page_slug: lpSlug,
        redirect_slug: slug,
        destination_url: product.destinationUrl,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        utm_term: utmTerm,
        referrer: request.headers.get('referer') ?? null,
        user_agent: ua,
        ip_hash: ipHash,
        device_type: classifyDevice(ua),
        browser: classifyBrowser(ua),
        os: classifyOs(ua),
        is_duplicate: isDuplicate,
        is_bot: isBot,
      });
    } catch {
      // Logging is best-effort; never block the redirect.
    }
  }

  return NextResponse.redirect(redirectUrl, 307);
}
