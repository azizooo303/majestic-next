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

// ─── Types ────────────────────────────────────────────────────────────────────

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

export interface SanityHeroSlide {
  _id: string
  order: number
  collectionEn: string
  collectionAr: string
  headlineEn: string
  headlineAr: string
  taglineEn?: string
  taglineAr?: string
  ctaEn?: string
  ctaAr?: string
  ctaLink?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageDesktopEn?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageDesktopAr?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageMobileEn?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageMobileAr?: any
}

export interface SanitySpacePanel {
  _id: string
  order: number
  labelEn: string
  labelAr: string
  link?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any
}

export interface SanityCollectionCard {
  _id: string
  order: number
  nameEn: string
  nameAr: string
  descriptionEn?: string
  descriptionAr?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any
  link?: string
}

export interface SanityCraftsmanshipImage {
  _id: string
  order: number
  altEn?: string
  altAr?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any
}

export interface SanityProjectStat {
  _key: string
  value: string
  labelEn: string
  labelAr: string
}

export interface SanityProjectCaseStudy {
  _id: string
  order: number
  titleEn: string
  titleAr: string
  descriptionEn?: string
  descriptionAr?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any
  stats?: SanityProjectStat[]
}

export interface SanityBrandPillar {
  _id: string
  number: string
  titleEn: string
  titleAr: string
  bodyEn?: string
  bodyAr?: string
}

export interface SanityMaterialFinish {
  _id: string
  order: number
  nameEn: string
  nameAr: string
  swatchHex?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any
}

export interface SanityInsightCard {
  _id: string
  order: number
  tagEn?: string
  tagAr?: string
  titleEn: string
  titleAr: string
  publishedDate?: string
  link?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any
}

export interface SanitySiteStat {
  _id: string
  order: number
  value: string
  labelEn: string
  labelAr: string
}

export interface SanityFaqItem {
  _id: string
  order: number
  category?: string
  questionEn: string
  questionAr: string
  answerEn: string
  answerAr: string
}

export interface SanityShowroom {
  _id: string
  order: number
  nameEn: string
  nameAr: string
  addressEn?: string
  addressAr?: string
  hoursEn?: string
  hoursAr?: string
  phone?: string
  mapsUrl?: string
  isComingSoon?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any
}

export interface SanityAboutStat {
  _key: string
  value: string
  labelEn: string
  labelAr: string
}

export interface SanityAboutValue {
  _key: string
  icon?: string
  titleEn: string
  titleAr: string
  descriptionEn?: string
  descriptionAr?: string
}

export interface SanityAboutPage {
  heroTitleEn?: string
  heroTitleAr?: string
  storyHeadingEn?: string
  storyHeadingAr?: string
  storyBodyEn?: string
  storyBodyAr?: string
  storySupportingEn?: string
  storySupportingAr?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storyImage?: any
  stats?: SanityAboutStat[]
  values?: SanityAboutValue[]
  ctaHeadingEn?: string
  ctaHeadingAr?: string
  ctaBodyEn?: string
  ctaBodyAr?: string
}

export interface SanityHomepageHeadings {
  spacesLabelEn?: string
  spacesLabelAr?: string
  collectionsLabelEn?: string
  collectionsLabelAr?: string
  collectionsHeadingEn?: string
  collectionsHeadingAr?: string
  craftsmanshipOverlineEn?: string
  craftsmanshipOverlineAr?: string
  craftsmanshipTaglineEn?: string
  craftsmanshipTaglineAr?: string
  projectsLabelEn?: string
  projectsLabelAr?: string
  projectsHeadingEn?: string
  projectsHeadingAr?: string
  standardLabelEn?: string
  standardLabelAr?: string
  standardHeadingEn?: string
  standardHeadingAr?: string
  materialsLabelEn?: string
  materialsLabelAr?: string
  materialsHeadingEn?: string
  materialsHeadingAr?: string
  insightsLabelEn?: string
  insightsLabelAr?: string
  insightsHeadingEn?: string
  insightsHeadingAr?: string
}

export interface SanityHomepagePromoBanner {
  headlineEn?: string
  headlineAr?: string
  bodyEn?: string
  bodyAr?: string
  ctaEn?: string
  ctaAr?: string
  ctaLink?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any
}

export interface SanityHomepage {
  sectionHeadings?: SanityHomepageHeadings
  promoBanner?: SanityHomepagePromoBanner
  consultationCta?: {
    headingEn?: string
    headingAr?: string
    bodyEn?: string
    bodyAr?: string
  }
}

// ─── Blog Queries ─────────────────────────────────────────────────────────────

export const POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id, title, titleAr, slug, publishedAt, category, categoryAr, excerpt, excerptAr, mainImage
}`

export const POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id, title, titleAr, slug, publishedAt, category, categoryAr, excerpt, excerptAr, mainImage, body, bodyAr
}`

export const ALL_SLUGS_QUERY = `*[_type == "blogPost"] { "slug": slug.current }`

// ─── Site Content Queries ─────────────────────────────────────────────────────

export const HERO_SLIDES_QUERY = `*[_type == "heroSlide"] | order(order asc) {
  _id, order, collectionEn, collectionAr, headlineEn, headlineAr,
  taglineEn, taglineAr, ctaEn, ctaAr, ctaLink,
  imageDesktopEn, imageDesktopAr, imageMobileEn, imageMobileAr
}`

export const SPACE_PANELS_QUERY = `*[_type == "spacePanel"] | order(order asc) {
  _id, order, labelEn, labelAr, link, image
}`

export const COLLECTION_CARDS_QUERY = `*[_type == "collectionCard"] | order(order asc) {
  _id, order, nameEn, nameAr, descriptionEn, descriptionAr, image, link
}`

export const CRAFTSMANSHIP_IMAGES_QUERY = `*[_type == "craftsmanshipImage"] | order(order asc) {
  _id, order, altEn, altAr, image
}`

export const PROJECT_CASE_STUDIES_QUERY = `*[_type == "projectCaseStudy"] | order(order asc) {
  _id, order, titleEn, titleAr, descriptionEn, descriptionAr, image, stats
}`

export const BRAND_PILLARS_QUERY = `*[_type == "brandPillar"] | order(number asc) {
  _id, number, titleEn, titleAr, bodyEn, bodyAr
}`

export const MATERIAL_FINISHES_QUERY = `*[_type == "materialFinish"] | order(order asc) {
  _id, order, nameEn, nameAr, swatchHex, image
}`

export const INSIGHT_CARDS_QUERY = `*[_type == "insightCard"] | order(order asc) {
  _id, order, tagEn, tagAr, titleEn, titleAr, publishedDate, link, image
}`

export const SITE_STATS_QUERY = `*[_type == "siteStat"] | order(order asc) {
  _id, order, value, labelEn, labelAr
}`

export const FAQ_QUERY = `*[_type == "faqItem"] | order(order asc) {
  _id, order, category, questionEn, questionAr, answerEn, answerAr
}`

export const SHOWROOMS_QUERY = `*[_type == "showroom"] | order(order asc) {
  _id, order, nameEn, nameAr, addressEn, addressAr, hoursEn, hoursAr, phone, mapsUrl, isComingSoon, image
}`

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0] {
  heroTitleEn, heroTitleAr,
  storyHeadingEn, storyHeadingAr,
  storyBodyEn, storyBodyAr,
  storySupportingEn, storySupportingAr,
  storyImage, stats, values,
  ctaHeadingEn, ctaHeadingAr, ctaBodyEn, ctaBodyAr
}`

export const HOMEPAGE_QUERY = `*[_type == "homepage"][0] {
  sectionHeadings, promoBanner, consultationCta
}`
