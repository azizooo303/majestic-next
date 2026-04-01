import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://thedeskco.net'
  const locales = ['en', 'ar']
  const pages = [
    { path: '', priority: 1.0 },
    { path: '/shop', priority: 0.9 },
    { path: '/about', priority: 0.7 },
    { path: '/contact', priority: 0.7 },
    { path: '/projects', priority: 0.7 },
    { path: '/brands', priority: 0.6 },
    { path: '/showrooms', priority: 0.7 },
    { path: '/blog', priority: 0.6 },
    { path: '/faq', priority: 0.5 },
    { path: '/careers', priority: 0.5 },
  ]
  return locales.flatMap(locale =>
    pages.map(({ path, priority }) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority,
    }))
  )
}
