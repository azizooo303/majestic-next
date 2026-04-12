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
  imageAr?: string
  mobileImageAr?: string
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
      image: '/images/hero_executive_suite.png',
      mobileImage: '/images/hero_executive_suite.png',
      imageAr: '/images/hero_executive_suite.png',
      mobileImageAr: '/images/hero_executive_suite.png',
      collection: { en: 'Executive Desk Collection', ar: 'تشكيلة المكاتب التنفيذية' },
      headline: { en: 'Desks Built\nfor Authority', ar: 'مكاتب تحمل توقيع القيادة' },
      tagline: {
        en: 'Executive workstations engineered for the modern Saudi boardroom.',
        ar: 'محطات عمل تنفيذية مصممة لبيئات الأعمال السعودية الحديثة.',
      },
      cta: { en: 'Explore Executive Desks', ar: 'استعرض المكاتب التنفيذية' },
      href: '/shop?category=desks',
    },
    {
      image: '/images/hero_boardroom.png',
      mobileImage: '/images/hero_boardroom.png',
      imageAr: '/images/hero_boardroom.png',
      mobileImageAr: '/images/hero_boardroom.png',
      collection: { en: 'Meeting & Conference Tables', ar: 'طاولات الاجتماعات والقاعات' },
      headline: { en: 'Tables That\nCommand Rooms', ar: 'طاولات تقود قاعاتها' },
      tagline: {
        en: 'Conference and boardroom tables engineered for decisions that matter.',
        ar: 'طاولات اجتماعات وقاعات إدارة — مصممة للقرارات التي تصنع الفارق.',
      },
      cta: { en: 'Explore Meeting Tables', ar: 'استعرض طاولات الاجتماعات' },
      href: '/shop?category=tables',
    },
    {
      image: '/images/hero_workstation_floor.png',
      mobileImage: '/images/hero_workstation_floor.png',
      imageAr: '/images/hero_workstation_floor.png',
      mobileImageAr: '/images/hero_workstation_floor.png',
      collection: { en: 'Workstation Systems', ar: 'أنظمة محطات العمل' },
      headline: { en: 'Workstations\nThat Scale', ar: 'محطات عمل تنمو معك' },
      tagline: {
        en: 'Modular workstation systems with integrated acoustics — the full Majestic floor.',
        ar: 'أنظمة محطات عمل معيارية بحلول صوتية متكاملة — الأرضية المؤسسية الكاملة.',
      },
      cta: { en: 'Explore Workstations', ar: 'استعرض محطات العمل' },
      href: '/shop?category=workstations',
    },
    {
      image: '/images/hero_reception_lounge.png',
      mobileImage: '/images/hero_reception_lounge.png',
      imageAr: '/images/hero_reception_lounge.png',
      mobileImageAr: '/images/hero_reception_lounge.png',
      collection: { en: 'Reception & Lounge', ar: 'الاستقبال والصالات' },
      headline: { en: 'First Impressions,\nEngineered', ar: 'استقبال بمعايير أعلى' },
      tagline: {
        en: 'Reception and lounge pieces that set the tone from the door.',
        ar: 'قطع استقبال وصالات تحدد الانطباع الأول من لحظة الدخول.',
      },
      cta: { en: 'Explore Reception', ar: 'استعرض مجموعة الاستقبال' },
      href: '/shop?category=reception',
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
    hoursEn: 'Sun–Thu 9am–9pm',
    hoursAr: 'الأحد–الخميس، ٩ص–٩م',
  },
  showrooms: [
    {
      id: 'al-olaya',
      name: { en: 'Riyadh — Al Olaya', ar: 'الرياض — العليا' },
      address: { en: 'King Fahad Road, Al Olaya District, Riyadh', ar: 'طريق الملك فهد، حي العليا، الرياض' },
      phone: '+966 9200 12019',
      mapsUrl: '',
      comingSoon: false,
    },
    {
      id: 'al-malaz',
      name: { en: 'Riyadh — Al Malaz', ar: 'الرياض — الملز' },
      address: { en: 'Al Malaz Street, Al Malaz District, Riyadh', ar: 'شارع الملز، حي الملز، الرياض' },
      phone: '+966 9200 12019',
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
