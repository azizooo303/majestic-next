import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing)

async function createAdminToken(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode('majestic-admin-2026'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(password))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export default async function middleware(request: NextRequest) {
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

      const expected = await createAdminToken(adminPassword)
      const valid = timingSafeEqual(sessionCookie.value, expected)

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
    '/admin',
    '/admin/:path*',
    '/api/admin/:path*',
    '/',
    '/(en|ar)/:path*',
  ],
}
