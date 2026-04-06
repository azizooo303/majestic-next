/**
 * MAJESTIC SITE CONFIGURATION
 * ─────────────────────────────────────────────────────────────
 * Edit this file to control website settings without touching components.
 *
 * Sections:
 *   1. BRAND         — name, logo, domain, social links
 *   2. CONTACT       — phone, email, address, hours
 *   3. SHOWROOMS     — all showroom locations
 *   4. HERO SLIDES   — homepage hero carousel (EN + AR)
 *   5. STATS         — the "500+ clients / 15+ years" numbers
 *   6. NAV LINKS     — header + footer navigation
 *   7. SEO DEFAULTS  — fallback meta title/description
 */

// ─────────────────────────────────────────────────────────────
// 1. BRAND
// ─────────────────────────────────────────────────────────────
export const BRAND = {
  name: {
    en: "Majestic Furniture",
    ar: "ماجيستيك للأثاث",
  },
  tagline: {
    en: "Saudi Arabia's premier workspace furniture brand.",
    ar: "العلامة التجارية الرائدة في أثاث المكاتب بالمملكة العربية السعودية.",
  },
  domain: "https://lightyellow-mallard-240169.hostingersite.com",
  logoPath: "/images/majestic-logo-original.png",
  logoWhitePath: "/images/majestic-logo-white.png",
  logoBlackPath: "/images/majestic-logo-black.png",
  social: {
    instagram: "https://www.instagram.com/majestic.furniture.sa",
    linkedin: "",
    twitter: "",
  },
} as const;

// ─────────────────────────────────────────────────────────────
// 2. CONTACT
// ─────────────────────────────────────────────────────────────
export const CONTACT = {
  phone: {
    display: "+966 9200 12019",
    href: "tel:+96692001219",
  },
  email: {
    main: "info@majestic.com.sa",
    support: "hello@majestic.com.sa",
  },
  address: {
    en: "Arcade Centre, Al Rashidiah, Riyadh",
    ar: "أركيد سنتر، الرشيدية، الرياض",
    city: "Riyadh",
    country: "SA",
  },
  hours: {
    en: "Sun–Thu 9am–5pm",
    ar: "الأحد–الخميس، ٩ص–٥م",
  },
} as const;

// ─────────────────────────────────────────────────────────────
// 3. SHOWROOMS
// ─────────────────────────────────────────────────────────────
export const SHOWROOMS = [
  {
    id: "al-olaya",
    name: { en: "Riyadh — Al Olaya", ar: "الرياض — العليا" },
    address: {
      en: "King Fahad Road, Al Olaya District, Riyadh",
      ar: "طريق الملك فهد، حي العليا، الرياض",
    },
    phone: "+966 11 234 5678",
    mapsUrl: "",
    image: "/images/hero-tables.jpg",
    comingSoon: false,
  },
  {
    id: "al-malaz",
    name: { en: "Riyadh — Al Malaz", ar: "الرياض — الملز" },
    address: {
      en: "Al Malaz Street, Al Malaz District, Riyadh",
      ar: "شارع الملز، حي الملز، الرياض",
    },
    phone: "+966 11 345 6789",
    mapsUrl: "",
    image: "/images/hero-tables.jpg",
    comingSoon: false,
  },
  {
    id: "jeddah",
    name: { en: "Jeddah", ar: "جدة" },
    address: { en: "Jeddah, Saudi Arabia", ar: "جدة، المملكة العربية السعودية" },
    phone: "—",
    mapsUrl: "",
    image: "/images/hero-tables.jpg",
    comingSoon: true,
  },
] as const;

// ─────────────────────────────────────────────────────────────
// 4. HERO SLIDES
// Change images, headlines, CTAs here — no component editing needed.
// ─────────────────────────────────────────────────────────────
export const HERO_SLIDES = [
  {
    image: "/images/hero-desks.jpg",
    mobileImage: "/images/hero-desks-mobile.jpg",
    collection: { en: "Executive Desk Collection", ar: "تشكيلة المكاتب التنفيذية" },
    headline: { en: "Desks Built\nfor Authority", ar: "المكاتب التنفيذية" },
    tagline: {
      en: "Executive collections engineered for the modern Saudi workspace.",
      ar: "تشكيلات مكاتب تنفيذية لبيئات العمل المؤسسية السعودية.",
    },
    cta: { en: "Explore Executive Desks", ar: "استعرض المكاتب التنفيذية" },
    href: "/shop",
  },
  {
    image: "/images/hero-seating.jpg",
    mobileImage: "/images/hero-seating-mobile.jpg",
    collection: { en: "Seating Collection", ar: "تشكيلة الكراسي" },
    headline: { en: "Seating That\nPerforms", ar: "كراسي المهام والجلسات" },
    tagline: {
      en: "Ergonomic chairs built for focused comfort and extensive use.",
      ar: "كراسي مريحة وداعمة للجسم، مُصنَّعة للجلسات الطويلة والاستخدام المكثف.",
    },
    cta: { en: "Explore Seating", ar: "استعرض تشكيلة الكراسي" },
    href: "/shop?category=seating",
  },
  {
    image: "/images/hero-tables.jpg",
    mobileImage: "/images/hero-tables-mobile.jpg",
    collection: { en: "Meeting Tables", ar: "طاولات الاجتماعات" },
    headline: { en: "Tables That\nCommand Rooms", ar: "طاولات الاجتماعات والقاعات" },
    tagline: {
      en: "Conference and boardroom tables sized for every setting — from four seats to forty.",
      ar: "طاولات اجتماعات وقاعات إدارة — من أربعة مقاعد حتى أربعين — لكل حجم ونوع فضاء.",
    },
    cta: { en: "Explore Meeting Tables", ar: "استعرض طاولات الاجتماعات" },
    href: "/shop?category=tables",
  },
] as const;

// ─────────────────────────────────────────────────────────────
// 5. STATS (homepage + hero trust bar)
// ─────────────────────────────────────────────────────────────
export const STATS = [
  {
    value: 500,
    suffix: "+",
    label: { en: "Corporate Clients", ar: "شركة وحكومة مكومية" },
  },
  {
    value: 15,
    suffix: "+",
    label: { en: "Delivery & Install", ar: "توزيع في كل مكان" },
  },
  {
    value: 0,   // set to 0 to hide
    suffix: "",
    label: { en: "Riyadh & Beyond", ar: "الرياض وخارجها" },
  },
] as const;

// ─────────────────────────────────────────────────────────────
// 6. NAVIGATION
// ─────────────────────────────────────────────────────────────
export const NAV = {
  footer: {
    products: [
      { en: "Chairs", ar: "الكراسي", href: "/shop?category=seating" },
      { en: "Desks", ar: "المكاتب", href: "/shop?category=tables" },
      { en: "Storage", ar: "التخزين", href: "/shop?category=storage" },
      { en: "Workstations", ar: "محطات العمل", href: "/shop?category=workstations" },
      { en: "Acoustic Solutions", ar: "الحلول الصوتية", href: "/shop?category=acoustics" },
      { en: "Lounge", ar: "الاستقبال", href: "/shop?category=lounge" },
    ],
    company: [
      { en: "About", ar: "عن ماجيستيك", href: "/about" },
      { en: "Projects", ar: "المشاريع", href: "/projects" },
      { en: "Showrooms", ar: "المعارض", href: "/showrooms" },
      { en: "Blog", ar: "المدونة", href: "/blog" },
      { en: "Careers", ar: "الوظائف", href: "/careers" },
    ],
    support: [
      { en: "E-Quotation", ar: "طلب عرض سعر", href: "/quotation" },
      { en: "Delivery & Returns", ar: "التوصيل والإرجاع", href: "/delivery" },
      { en: "Warranty", ar: "الضمان", href: "/warranty" },
      { en: "Contact", ar: "تواصل معنا", href: "/contact" },
    ],
  },
} as const;

// ─────────────────────────────────────────────────────────────
// 7. SEO DEFAULTS
// ─────────────────────────────────────────────────────────────
export const SEO = {
  defaultTitle: {
    en: "Majestic Furniture — Premium Office Furniture Saudi Arabia",
    ar: "ماجيستيك للأثاث — أثاث مكاتب فاخر في السعودية",
  },
  defaultDescription: {
    en: "Saudi Arabia's premier destination for professional office furniture. Executive desks, ergonomic chairs, and workstations for elevated workspace environments.",
    ar: "الوجهة الأولى في المملكة العربية السعودية للأثاث المكتبي الاحترافي.",
  },
  twitterHandle: "@majesticsa",
  ogImage: "/images/og-image.jpg",
} as const;
