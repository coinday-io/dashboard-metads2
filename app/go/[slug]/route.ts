import { findProductBySlug } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = findProductBySlug(slug);
  if (!product || product.status !== 'active') {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Redirect target not found', details: [] } }, { status: 404 });
  }

  const redirectUrl = new URL(product.destinationUrl);
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const value = request.nextUrl.searchParams.get(key);
    if (value) redirectUrl.searchParams.set(key, value);
  }

  return NextResponse.redirect(redirectUrl);
}
