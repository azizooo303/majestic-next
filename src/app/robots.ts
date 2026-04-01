import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/cart', '/checkout'] }
    ],
    sitemap: 'https://thedeskco.net/sitemap.xml',
  }
}
