import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'

const intlMiddleware = createMiddleware(routing)

function createAdminToken(password: string): string {
  return crypto
    .createHmac('sha256', 'majestic-admin-2026')
    .update(password)
    .digest('hex')
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login'
    if (!isLoginPage) {
      const adminPassword = process.env.ADMIN_PASSWORD
      const sessionCookie = request.cookies.get('majestic_admin')

      if (!adminPassword || !sessionCookie) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      const expected = createAdminToken(adminPassword)
      let valid = false
      try {
        valid = crypto.timingSafeEqual(
          Buffer.from(sessionCookie.value),
          Buffer.from(expected)
        )
      } catch {
        valid = false
      }

      if (!valid) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }
    return NextResponse.next()
  }

  // Skip intl for API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/',
    '/(en|ar)/:path*',
  ],
}
