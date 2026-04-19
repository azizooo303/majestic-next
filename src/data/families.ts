/**
 * Fallback family list + 3D asset manifest.
 * Used when WC variable product fetch fails OR for static render at build time.
 *
 * Source of truth (post-Wave-2-sync): WC REST API variable products.
 * This file mirrors Odoo for offline/fallback cases.
 *
 * Update policy: regenerate when families change in Odoo (rare).
 */

export type DeskFamily = {
  sku: string;                  // Odoo/WC default_code (DESK-CRATOS)
  slug: string;                 // URL slug (cratos)
  nameEn: string;
  nameAr: string;
  tagline?: {en: string; ar: string};
  configs: string[];            // valid Config values for this family
  hasGlb: boolean;              // true if 3D viewer can render
  glbUrl?: string;              // path in /public/models/
  heroImage?: string;           // fallback image if no GLB
  priority: number;             // shop grid ordering (lower = earlier)
  status: "live" | "new" | "coming-soon";
};

export const DESK_FAMILIES: DeskFamily[] = [
  {
    sku: "DESK-CRATOS",
    slug: "cratos",
    nameEn: "Cratos Desk",
    nameAr: "مكتب كراتوس",
    tagline: {en: "Best-selling executive desk", ar: "الأكثر مبيعاً — مكتب تنفيذي"},
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: true,
    glbUrl: "/models/desk-cratos.glb",
    heroImage: "/images/shop/cratos-hero.webp",
    priority: 1,
    status: "live",
  },
  {
    sku: "DESK-TRUVA",
    slug: "truva",
    nameEn: "Truva Desk",
    nameAr: "مكتب تروفا",
    tagline: {en: "Second-tier classic", ar: "كلاسيكي من الطبقة الثانية"},
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: false,
    heroImage: "/images/shop/truva-hero.webp",
    priority: 2,
    status: "live",
  },
  {
    sku: "DESK-ALPHA",
    slug: "alpha",
    nameEn: "Alpha Desk",
    nameAr: "مكتب ألفا",
    tagline: {en: "Alpha Plus executive with chrome legs", ar: "ألفا بلس التنفيذي بأرجل كروم"},
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: false,
    heroImage: "/images/shop/alpha-hero.webp",
    priority: 3,
    status: "live",
  },
  {
    sku: "DESK-LYRA",
    slug: "lyra",
    nameEn: "Lyra Desk",
    nameAr: "مكتب ليرا",
    tagline: {en: "Layra GS executive", ar: "ليرا جي إس التنفيذي"},
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: false,
    heroImage: "/images/shop/lyra-hero.webp",
    priority: 4,
    status: "live",
  },
  {
    sku: "DESK-SKY",
    slug: "sky",
    nameEn: "Sky Desk",
    nameAr: "مكتب سكاي",
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: false,
    heroImage: "/images/shop/sky-hero.webp",
    priority: 5,
    status: "live",
  },
  {
    sku: "DESK-GRAVITY",
    slug: "gravity",
    nameEn: "Gravity Desk",
    nameAr: "مكتب غرافيتي",
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: false,
    heroImage: "/images/shop/gravity-hero.webp",
    priority: 6,
    status: "live",
  },
  {
    sku: "DESK-MAXIMUS",
    slug: "maximus",
    nameEn: "Maximus Desk",
    nameAr: "مكتب ماكسيموس",
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: false,
    heroImage: "/images/shop/maximus-hero.webp",
    priority: 7,
    status: "live",
  },
  {
    sku: "DESK-PASCAL",
    slug: "pascal",
    nameEn: "Pascal Desk",
    nameAr: "مكتب باسكال",
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: false,
    heroImage: "/images/shop/pascal-hero.webp",
    priority: 8,
    status: "live",
  },
  {
    sku: "DESK-TESLA",
    slug: "tesla",
    nameEn: "Tesla Desk",
    nameAr: "مكتب تيسلا",
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: false,
    heroImage: "/images/shop/tesla-hero.webp",
    priority: 9,
    status: "live",
  },
  {
    sku: "DESK-FLAT",
    slug: "flat",
    nameEn: "Flat Desk",
    nameAr: "مكتب فلات",
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: false,
    heroImage: "/images/shop/flat-hero.webp",
    priority: 10,
    status: "live",
  },
  {
    sku: "DESK-NEWLINE",
    slug: "newline",
    nameEn: "Newline Desk",
    nameAr: "مكتب نيوليين",
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: false,
    priority: 11,
    status: "new",
  },
  {
    sku: "DESK-DAVINCI",
    slug: "davinci",
    nameEn: "Da Vinci Desk",
    nameAr: "مكتب دافنشي",
    tagline: {en: "Artist-inspired executive design", ar: "تصميم تنفيذي مستوحى من الفن"},
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: false,
    priority: 12,
    status: "new",
  },
  {
    sku: "DESK-DIAMOND",
    slug: "diamond",
    nameEn: "Diamond Desk",
    nameAr: "مكتب دايموند",
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: false,
    priority: 13,
    status: "new",
  },
  {
    sku: "DESK-NEPTON",
    slug: "nepton",
    nameEn: "Nepton Desk",
    nameAr: "مكتب نبتون",
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: false,
    priority: 14,
    status: "new",
  },
  {
    sku: "DESK-SIMPLE",
    slug: "simple",
    nameEn: "Simple Desk",
    nameAr: "مكتب سيمبل",
    tagline: {en: "Entry-level elegance", ar: "أناقة المستوى الأول"},
    configs: ["Executive", "Manager", "Operator", "Custom (Contact Us)"],
    hasGlb: false,
    priority: 15,
    status: "new",
  },
  {
    sku: "DESK-NEWTON",
    slug: "newton",
    nameEn: "Newton Height-Adjustable Desk",
    nameAr: "مكتب نيوتن القابل للتعديل",
    tagline: {en: "Motorised height-adjustable workstation", ar: "محطة عمل قابلة للتعديل بالمحرك"},
    configs: ["Height-Adjustable", "Custom (Contact Us)"],  // special — no EXEC/MGR/OPR tiers
    hasGlb: true,
    glbUrl: "/models/desk-newton.glb",
    priority: 16,
    status: "live",
  },
];

// Config extra_prices (mirrors Odoo Config attribute values)
export const CONFIG_EXTRA_PRICES: Record<string, number> = {
  "Executive": 2500,
  "Manager": 1000,
  "Operator": 0,
  "L-Shape": 2000,
  "U-Shape": 3500,
  "Conference": 1500,
  "Custom (Contact Us)": 0,      // quote path, no direct price
  "Height-Adjustable": 3000,     // Newton only (placeholder)
};

// 32 MFC finishes with Egger/Kastamonu supplier codes
export const DESK_TOP_FINISHES = [
  "Premium White", "Natural Hamilton Oak", "Light Rustic Oak", "Grey Bardolino Oak",
  "Natural Hamilton Walnut", "Vicenza Oak", "Cashmere Grey", "Light Grey",
  "Basalt Grey", "Platinum Grey", "Soft Black", "Graphite Grey",
  "Onyx Grey", "Africa Walnut", "Anatolia Walnut", "Italian Walnut",
  "Lefkas Oak", "Antique White", "Ibiza", "Dakota",
  "Garda", "Amalfi", "Armada", "Acapulco",
  "Belmonte", "Cabana", "Argos", "Alpine",
  "White Oak", "Cherry", "Aris Anthracite", "Devine Oak",
] as const;

export const LEG_COLORS = [
  "Black Powder Coat",
  "White Powder Coat",
  "Silver Powder Coat",
  "Polished Chrome",
] as const;

// Invalid combo exclusions (from Odoo product_template_attribute_exclusion)
export type Exclusion = {
  family: string;       // e.g. "ALPHA" or "ALL_DESKS"
  config?: string;
  size?: string;
  legColor?: string;
  reason: string;
};

export const DESK_EXCLUSIONS: Exclusion[] = [
  // Too small
  {family: "ALL_DESKS", config: "Executive", size: "120x60", reason: "EXEC desk too small"},
  {family: "ALL_DESKS", config: "Executive", size: "140x60", reason: "EXEC desk too small"},
  {family: "ALL_DESKS", config: "L-Shape", size: "120x60", reason: "L-Shape needs 160cm+"},
  {family: "ALL_DESKS", config: "L-Shape", size: "140x70", reason: "L-Shape needs 160cm+"},
  {family: "ALL_DESKS", config: "U-Shape", size: "120x60", reason: "U-Shape needs 180cm+"},
  {family: "ALL_DESKS", config: "U-Shape", size: "140x70", reason: "U-Shape needs 180cm+"},
  {family: "ALL_DESKS", config: "U-Shape", size: "160x80", reason: "U-Shape needs 180cm+"},
  // Newton specific
  {family: "NEWTON", config: "Conference", reason: "Newton HA frame does not support conference"},
  {family: "NEWTON", config: "L-Shape", reason: "Newton HA frame does not support L-shape"},
  {family: "NEWTON", config: "U-Shape", reason: "Newton HA frame does not support U-shape"},
  // Alpha chrome-only
  {family: "ALPHA", config: "Executive", legColor: "Black Powder Coat", reason: "Alpha Plus ships with chrome legs only"},
  {family: "ALPHA", config: "Executive", legColor: "White Powder Coat", reason: "Alpha Plus ships with chrome legs only"},
  {family: "ALPHA", config: "Executive", legColor: "Silver Powder Coat", reason: "Alpha Plus ships with chrome legs only"},
];

export function isValidCombo(
  family: string,
  config: string,
  size: string,
  legColor: string,
): {valid: boolean; reason?: string} {
  for (const e of DESK_EXCLUSIONS) {
    const familyMatch = e.family === "ALL_DESKS" || e.family === family.replace("DESK-", "");
    if (!familyMatch) continue;
    const configMatch = !e.config || e.config === config;
    const sizeMatch = !e.size || e.size === size;
    const legMatch = !e.legColor || e.legColor === legColor;
    if (configMatch && sizeMatch && legMatch) {
      return {valid: false, reason: e.reason};
    }
  }
  return {valid: true};
}
