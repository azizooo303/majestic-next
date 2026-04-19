import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing)

// Prefixes that must never be redirected to /en/
const BYPASS_PREFIXES = [
  '/en',
  '/ar',
  '/api',
  '/_next',
  '/_vercel',
  '/images',
  '/fonts',
  '/icons',
  '/favicon',
  '/sitemap',
  '/robots',
  '/manifest',
  '/3d',
]

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip intl for API and internal Next.js routes
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return withSecurityHeaders(NextResponse.next())
  }

  // Redirect bare paths (no locale prefix) to /en equivalent
  // e.g. /shop -> /en/shop, /about -> /en/about
  const hasBypassPrefix = BYPASS_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(prefix + '/')
  )

  if (!hasBypassPrefix) {
    const url = request.nextUrl.clone()
    url.pathname = `/en${pathname}`
    return withSecurityHeaders(NextResponse.redirect(url, 308))
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
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob: https://vercel.live https://va.vercel-scripts.com https://ajax.googleapis.com https://www.gstatic.com",
      "worker-src 'self' blob:",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://res.cloudinary.com https://*.supabase.co https://lightyellow-mallard-240169.hostingersite.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://lightyellow-mallard-240169.hostingersite.com https://*.sentry.io https://vercel.live wss://ws-us3.pusher.com https://www.gstatic.com https://ajax.googleapis.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  )
  return response
}

export const config = {
  // Match everything except static file extensions so the middleware
  // can intercept bare paths and redirect them to /en/.
  // Static assets (.js, .css, .png, etc.) are excluded to avoid
  // redirecting _next/static chunks or public-folder files.
  matcher: [
    '/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|ttf|otf|css|js|map|txt|xml|json|webmanifest|glb|gltf|usdz|fbx|obj|bin|hdr|exr|ktx2|drc|wasm)).*)',
  ],
}
