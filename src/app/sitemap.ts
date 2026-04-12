import { MetadataRoute } from 'next'
import { getProducts, WCProduct } from '@/lib/woocommerce'
import { client, ALL_SLUGS_QUERY } from '@/lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://majestic-next.vercel.app').trim().replace(/\/$/, '')
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
    { path: '/faq', priority: 0.6 },
    { path: '/delivery', priority: 0.6 },
    { path: '/warranty', priority: 0.5 },
    { path: '/careers', priority: 0.5 },
    { path: '/materials', priority: 0.5 },
    { path: '/product-care', priority: 0.5 },
    { path: '/inspirations', priority: 0.6 },
    { path: '/blog', priority: 0.6 },
    { path: '/privacy', priority: 0.3 },
    { path: '/terms', priority: 0.3 },
  ]

  let products: WCProduct[] = []
  try {
    products = await getProducts({ per_page: 100 })
  } catch (err) {
    console.error('[sitemap] Failed to fetch products, generating sitemap without product entries:', err)
  }

  const productEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    products.map(product => ({
      url: `${base}/${locale}/shop/${product.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  let blogSlugs: string[] = []
  try {
    const slugResults: { slug: string }[] = await client.fetch(ALL_SLUGS_QUERY)
    blogSlugs = slugResults.map(s => s.slug)
  } catch (err) {
    console.error('[sitemap] Failed to fetch blog slugs from Sanity:', err)
    blogSlugs = ['ergonomic-workspace-guide', 'executive-desk-buying-guide', 'office-design-trends-2024']
  }
  const blogEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    blogSlugs.map(slug => ({
      url: `${base}/${locale}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
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
    ...blogEntries,
    ...productEntries,
  ]
}
