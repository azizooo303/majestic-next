// TODO: Replace with dynamic WooCommerce product fetch when API is connected
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://majestic-next.vercel.app'
  const locales = ['en', 'ar']

  const pages = [
    { path: '', priority: 1.0 },
    { path: '/shop', priority: 0.9 },
    { path: '/about', priority: 0.8 },
    { path: '/quotation', priority: 0.8 },
    { path: '/contact', priority: 0.7 },
    { path: '/projects', priority: 0.7 },
    { path: '/showrooms', priority: 0.7 },
    { path: '/riyadh', priority: 0.8 },
    { path: '/jeddah', priority: 0.8 },
    { path: '/dammam', priority: 0.7 },
    { path: '/khobar', priority: 0.7 },
    { path: '/brands', priority: 0.6 },
    { path: '/blog', priority: 0.6 },
    { path: '/faq', priority: 0.6 },
    { path: '/delivery', priority: 0.6 },
    { path: '/warranty', priority: 0.5 },
    { path: '/careers', priority: 0.5 },
  ]

  // Static product slug placeholders — replace with dynamic WooCommerce fetch when API is connected
  const productSlugs: string[] = [
    // e.g. 'enigma-executive-desk', 'ergomax-pro-chair'
    // These will be populated once the WooCommerce API is connected
  ]

  const productEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    productSlugs.map(slug => ({
      url: `${base}/${locale}/products/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  return [
    ...locales.flatMap(locale =>
      pages.map(({ path, priority }) => ({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority,
      }))
    ),
    ...productEntries,
  ]
}
