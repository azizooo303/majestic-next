import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing)

async function createAdminToken(password: string): Promise<string> {
  const secret = process.env.ADMIN_HMAC_SECRET
  if (!secret) throw new Error('ADMIN_HMAC_SECRET env var is not set')
  const encoder = new TextEncoder()
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
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
    return withSecurityHeaders(NextResponse.next())
  }

  return withSecurityHeaders(intlMiddleware(request))
}

function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  return response
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
