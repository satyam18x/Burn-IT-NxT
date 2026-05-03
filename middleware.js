import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');
  const isApiAdminRoute = pathname.startsWith('/api/admin');
  const isApiUserRoute = pathname.startsWith('/api/user');

  // If trying to access protected route without token
  if (isDashboardRoute || isAdminRoute || isApiAdminRoute || isApiUserRoute) {
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role check for admin routes
    if (isAdminRoute || isApiAdminRoute) {
      try {
        // Simple base64 decode for the payload (second part of JWT)
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        
        if (payload.role !== 'admin') {
          if (pathname.startsWith('/api/')) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
          }
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/user/:path*',
    '/login'
  ],
};
