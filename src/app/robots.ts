import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/cart', '/checkout'] }
    ],
    sitemap: `${(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://majestic-next.vercel.app').trim().replace(/\/$/, '')}/sitemap.xml`,
  }
}
