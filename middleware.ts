import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Get session from cookie
  const sessionToken = req.cookies.get('session')?.value;
  const hasSession = !!sessionToken;

  // Only protect specific app routes that require authentication
  const protectedRoutes = ['/app/billing', '/app/settings'];
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));
  
  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }

  // Redirect authenticated users away from auth pages
  if (req.nextUrl.pathname.startsWith('/auth') && hasSession) {
    return NextResponse.redirect(new URL('/app', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/billing/:path*', '/app/settings/:path*', '/auth/:path*']
};