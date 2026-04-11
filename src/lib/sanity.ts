import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}

export interface SanityBlogPost {
  _id: string
  title: string
  titleAr: string
  slug: { current: string }
  publishedAt: string
  category: string
  categoryAr: string
  excerpt: string
  excerptAr: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mainImage?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bodyAr: any[]
}

export const POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  titleAr,
  slug,
  publishedAt,
  category,
  categoryAr,
  excerpt,
  excerptAr,
  mainImage
}`

export const POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  titleAr,
  slug,
  publishedAt,
  category,
  categoryAr,
  excerpt,
  excerptAr,
  mainImage,
  body,
  bodyAr
}`

export const ALL_SLUGS_QUERY = `*[_type == "blogPost"] { "slug": slug.current }`
