import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Public, intentionally-unauthenticated API routes
const PUBLIC_API_PREFIXES = ['/api/public/', '/api/health', '/api/auth/'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdmin = pathname.startsWith('/admin');
  const isApi = pathname.startsWith('/api');
  const isLogin = pathname === '/admin/login';
  const isPublicApi = isApi && PUBLIC_API_PREFIXES.some((prefix) => prefix.endsWith('/') ? pathname.startsWith(prefix) : pathname === prefix);
  const isProtected = isAdmin || (isApi && !isPublicApi);
  if (!isProtected) return NextResponse.next();

  // No Supabase configured: allow all (mock-only mode for first deploy)
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return NextResponse.next();

  const response = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    if (isApi) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Sign in required', details: [] } },
        { status: 401 },
      );
    }
    if (!isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }
  if (user && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
