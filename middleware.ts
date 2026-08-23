import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
  const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');

  // Skip middleware for internal assets, api routes, and health checks
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.') // static files like .svg, .png, .ico
  ) {
    return NextResponse.next();
  }

  // Handle www.ltsbags.com -> ltsbags.com
  const isWww = host.startsWith('www.ltsbags.com');
  const isHttp = proto === 'http';
  const isApex = host === 'ltsbags.com' || host.startsWith('ltsbags.com:');

  if (isWww || (isApex && isHttp)) {
    const canonicalTarget = new URL(url.pathname + url.search, 'https://ltsbags.com');
    return NextResponse.redirect(canonicalTarget, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
