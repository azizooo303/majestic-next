/**
 * Schema and defaults for all admin-managed site content.
 * site.ts controls static/typed config; this file controls live-editable content.
 */

export interface BilingualText {
  en: string
  ar: string
}

export interface HeroSlideContent {
  image: string
  mobileImage: string
  collection: BilingualText
  headline: BilingualText
  tagline: BilingualText
  cta: BilingualText
  href: string
}

export interface ShowroomContent {
  id: string
  name: BilingualText
  address: BilingualText
  phone: string
  mapsUrl: string
  comingSoon: boolean
}

export interface StatContent {
  value: number
  suffix: string
  label: BilingualText
  visible: boolean
}

export interface AnnouncementBar {
  enabled: boolean
  message: BilingualText
  bgColor: string
  link: string
}

export interface SectionVisibility {
  spaceTypology: boolean
  collections: boolean
  craftsmanshipBand: boolean
  projectScale: boolean
  materialSelector: boolean
  insightEditorial: boolean
  consultationCta: boolean
}

export interface ContactContent {
  phone: string
  phoneHref: string
  email: string
  addressEn: string
  addressAr: string
  hoursEn: string
  hoursAr: string
}

export interface SiteContent {
  heroSlides: HeroSlideContent[]
  announcement: AnnouncementBar
  contact: ContactContent
  showrooms: ShowroomContent[]
  stats: StatContent[]
  sections: SectionVisibility
  fontScale: 'sm' | 'md' | 'lg'
}

export const SITE_DEFAULTS: SiteContent = {
  heroSlides: [
    {
      image: '/images/hero-desks.jpg',
      mobileImage: '/images/hero-desks-mobile.jpg',
      collection: { en: 'Executive Desk Collection', ar: 'تشكيلة المكاتب التنفيذية' },
      headline: { en: 'Desks Built\nfor Authority', ar: 'المكاتب التنفيذية' },
      tagline: {
        en: 'Executive collections engineered for the modern Saudi workspace.',
        ar: 'تشكيلات مكاتب تنفيذية لبيئات العمل المؤسسية السعودية.',
      },
      cta: { en: 'Explore Executive Desks', ar: 'استعرض المكاتب التنفيذية' },
      href: '/shop',
    },
    {
      image: '/images/hero-seating.jpg',
      mobileImage: '/images/hero-seating-mobile.jpg',
      collection: { en: 'Seating Collection', ar: 'تشكيلة الكراسي' },
      headline: { en: 'Seating That\nPerforms', ar: 'كراسي المهام والجلسات' },
      tagline: {
        en: 'Ergonomic chairs built for focused comfort and extensive use.',
        ar: 'كراسي مريحة وداعمة للجسم، مُصنَّعة للجلسات الطويلة.',
      },
      cta: { en: 'Explore Seating', ar: 'استعرض تشكيلة الكراسي' },
      href: '/shop?category=seating',
    },
    {
      image: '/images/hero-tables.jpg',
      mobileImage: '/images/hero-tables-mobile.jpg',
      collection: { en: 'Meeting Tables', ar: 'طاولات الاجتماعات' },
      headline: { en: 'Tables That\nCommand Rooms', ar: 'طاولات الاجتماعات والقاعات' },
      tagline: {
        en: 'Conference and boardroom tables for every setting.',
        ar: 'طاولات اجتماعات وقاعات إدارة — لكل حجم ونوع فضاء.',
      },
      cta: { en: 'Explore Meeting Tables', ar: 'استعرض طاولات الاجتماعات' },
      href: '/shop?category=tables',
    },
  ],
  announcement: {
    enabled: false,
    message: { en: '', ar: '' },
    bgColor: '#2C2C2C',
    link: '',
  },
  contact: {
    phone: '+966 9200 12019',
    phoneHref: 'tel:+96692001219',
    email: 'info@majestic.com.sa',
    addressEn: 'Arcade Centre, Al Rashidiah, Riyadh',
    addressAr: 'أركيد سنتر، الرشيدية، الرياض',
    hoursEn: 'Sun–Thu 9am–5pm',
    hoursAr: 'الأحد–الخميس، ٩ص–٥م',
  },
  showrooms: [
    {
      id: 'al-olaya',
      name: { en: 'Riyadh — Al Olaya', ar: 'الرياض — العليا' },
      address: { en: 'King Fahad Road, Al Olaya District, Riyadh', ar: 'طريق الملك فهد، حي العليا، الرياض' },
      phone: '+966 11 234 5678',
      mapsUrl: '',
      comingSoon: false,
    },
    {
      id: 'al-malaz',
      name: { en: 'Riyadh — Al Malaz', ar: 'الرياض — الملز' },
      address: { en: 'Al Malaz Street, Al Malaz District, Riyadh', ar: 'شارع الملز، حي الملز، الرياض' },
      phone: '+966 11 345 6789',
      mapsUrl: '',
      comingSoon: false,
    },
    {
      id: 'jeddah',
      name: { en: 'Jeddah', ar: 'جدة' },
      address: { en: 'Jeddah, Saudi Arabia', ar: 'جدة، المملكة العربية السعودية' },
      phone: '—',
      mapsUrl: '',
      comingSoon: true,
    },
  ],
  stats: [
    { value: 500, suffix: '+', label: { en: 'Corporate Clients', ar: 'شركة وحكومة' }, visible: true },
    { value: 15, suffix: '+', label: { en: 'Years in Market', ar: 'سنة في السوق' }, visible: true },
    { value: 0, suffix: '', label: { en: 'Riyadh & Beyond', ar: 'الرياض وخارجها' }, visible: false },
  ],
  sections: {
    spaceTypology: true,
    collections: true,
    craftsmanshipBand: true,
    projectScale: true,
    materialSelector: true,
    insightEditorial: true,
    consultationCta: true,
  },
  fontScale: 'md',
}
