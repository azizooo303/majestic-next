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
  /** Canonical breadcrumb path for the configurator route.
   *  Shape: ['Home', 'Shop', '<Category>', '<Sub-category>', '<FamilyName>']
   *  Defined at family level — NOT pulled from WC category (which varies by product variant).
   *  TODO: move to Odoo product catalog when catalog taxonomy is stable. */
  breadcrumb: string[];
  /** Arabic breadcrumb — same shape as breadcrumb, all strings in Arabic. */
  breadcrumbAr: string[];
};

export const DESK_FAMILIES: DeskFamily[] = [
  {
    sku: "DESK-CRATOS",
    slug: "cratos",
    nameEn: "Cratos Desk",
    nameAr: "مكتب كراتوس",
    tagline: {en: "Best-selling executive desk", ar: "الأكثر مبيعاً — مكتب تنفيذي"},
    configs: ["Operator", "Manager", "L-Shape", "Meeting 6-Person", "Meeting (Large)", "Workstation 6-Person", "Custom (Contact Us)"],
    hasGlb: true,
    glbUrl: "/3d/cratos-executive/model.glb",
    heroImage: "/images/shop/cratos-hero.webp",
    priority: 1,
    status: "live",
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Cratos"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "كراتوس"],
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
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Truva"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "تروفا"],
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
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Alpha"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "ألفا"],
  },
  {
    sku: "DESK-LYRA",
    slug: "lyra",
    nameEn: "Lyra Desk",
    nameAr: "مكتب ليرا",
    tagline: {en: "Layra GS executive", ar: "ليرا جي إس التنفيذي"},
    configs: ["Executive", "Storage Credenza", "Tall Credenza", "Coffee Table", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: true,
    heroImage: "/images/shop/lyra-hero.webp",
    priority: 4,
    status: "live",
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Lyra"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "ليرا"],
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
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Sky"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "سكاي"],
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
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Gravity"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "غرافيتي"],
  },
  {
    sku: "DESK-MAXIMUS",
    slug: "maximus",
    nameEn: "Maximus Desk",
    nameAr: "مكتب ماكسيموس",
    configs: ["L-Shape", "Executive", "Manager", "Operator", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: true,
    heroImage: "/images/shop/maximus-hero.webp",
    priority: 7,
    status: "live",
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Maximus"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "ماكسيموس"],
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
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Pascal"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "باسكال"],
  },
  {
    sku: "DESK-TESLA",
    slug: "tesla",
    nameEn: "Tesla Desk",
    nameAr: "مكتب تيسلا",
    configs: ["Meeting 4-Person", "Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: true,
    heroImage: "/images/shop/tesla-hero.webp",
    priority: 9,
    status: "live",
    breadcrumb: ["Home", "Shop", "Desks", "Meeting Tables", "Tesla"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "طاولات الاجتماعات", "تيسلا"],
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
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Flat"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "فلات"],
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
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Newline"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "نيوليين"],
  },
  {
    sku: "DESK-DAVINCI",
    slug: "davinci",
    nameEn: "Da Vinci Desk",
    nameAr: "مكتب دافنشي",
    tagline: {en: "Artist-inspired executive design", ar: "تصميم تنفيذي مستوحى من الفن"},
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: true,
    priority: 12,
    status: "live",
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Da Vinci"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "دافنشي"],
  },
  {
    sku: "DESK-DIAMOND",
    slug: "diamond",
    nameEn: "Diamond Desk",
    nameAr: "مكتب دايموند",
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: true,
    priority: 13,
    status: "live",
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Diamond"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "دايموند"],
  },
  {
    sku: "DESK-NEPTON",
    slug: "nepton",
    nameEn: "Nepton Desk",
    nameAr: "مكتب نبتون",
    configs: ["Executive", "Manager", "Operator", "L-Shape", "U-Shape", "Conference", "Custom (Contact Us)"],
    hasGlb: true,
    priority: 14,
    status: "live",
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Nepton"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "نبتون"],
  },
  {
    sku: "DESK-SIMPLE",
    slug: "simple",
    nameEn: "Simple Desk",
    nameAr: "مكتب سيمبل",
    tagline: {en: "Entry-level elegance", ar: "أناقة المستوى الأول"},
    configs: ["Operator", "Manager", "L-Shape", "Meeting 4-Person", "Meeting 10-Person", "Workstation 4-Person", "Coffee Table (1000)", "Coffee Table (500)", "Custom (Contact Us)"],
    hasGlb: true,
    priority: 15,
    status: "live",
    breadcrumb: ["Home", "Shop", "Desks", "Executive Desks", "Simple"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "المكاتب التنفيذية", "سيمبل"],
  },
  {
    sku: "DESK-NEWTON",
    slug: "newton",
    nameEn: "Newton Height-Adjustable Desk",
    nameAr: "مكتب نيوتن القابل للتعديل",
    tagline: {en: "Motorised height-adjustable workstation", ar: "محطة عمل قابلة للتعديل بالمحرك"},
    configs: ["Executive", "Height-Adjustable", "Custom (Contact Us)"],
    hasGlb: true,
    priority: 16,
    status: "live",
    breadcrumb: ["Home", "Shop", "Desks", "Height-Adjustable", "Newton"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "قابل للتعديل", "نيوتن"],
  },
  {
    sku: "DESK-SEMINA",
    slug: "semina",
    nameEn: "Semina Desk System",
    nameAr: "نظام مكاتب سمينا",
    tagline: {en: "Modular workstation & meeting system", ar: "نظام محطات عمل واجتماعات معياري"},
    configs: ["Meeting", "Workstation", "Custom (Contact Us)"],
    hasGlb: true,
    priority: 17,
    status: "live",
    breadcrumb: ["Home", "Shop", "Desks", "Workstations", "Semina"],
    breadcrumbAr: ["الرئيسية", "المتجر", "المكاتب", "محطات العمل", "سمينا"],
  },
  {
    sku: "CRED-BEAUTY",
    slug: "beauty",
    nameEn: "Beauty Credenza",
    nameAr: "خزانة بيوتي",
    tagline: {en: "Shelf credenza", ar: "خزانة أرفف"},
    configs: ["Shelf Credenza", "Custom (Contact Us)"],
    hasGlb: true,
    priority: 18,
    status: "live",
    breadcrumb: ["Home", "Shop", "Storage", "Credenzas", "Beauty"],
    breadcrumbAr: ["الرئيسية", "المتجر", "التخزين", "الخزائن", "بيوتي"],
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
  // Meeting tables — placeholder pricing, Aziz to confirm real numbers in Odoo
  "Meeting 4-Person": 1800,
  "Meeting 6-Person": 2800,
  "Meeting (Large)": 4500,
  "Workstation 6-Person": 6500,     // 6-seat workstation cluster
  // Non-desk product types (Lyra + Beauty + Semina)
  "Storage Credenza": 1600,
  "Tall Credenza": 2200,
  "Coffee Table": 900,
  "Shelf Credenza": 2400,
  "Meeting": 2500,                  // Semina meeting
  "Workstation": 5500,               // Semina workstation
  "Custom (Contact Us)": 0,          // quote path, no direct price
  "Height-Adjustable": 3000,         // Newton HA
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

export type FinishGroup = "whites" | "oaks" | "walnuts" | "greys" | "stone";

/** Finish metadata: group (for tab filter) + substrate description.
 *  Source: v2 HTML FINISHES array (lines 1220-1258) as ground truth.
 *  Group taxonomy: Whites (3) · Oaks (9) · Walnuts (4) · Greys & Blacks (8) · Stone & Neutrals (8) */
export const FINISH_META: Record<string, { group: FinishGroup; meta: string }> = {
  // Whites (3)
  "Premium White":           { group: "whites",  meta: "Laminate · 25 mm · Matte · In stock" },
  "Antique White":           { group: "whites",  meta: "Laminate · 25 mm · Matte" },
  "Cashmere Grey":           { group: "whites",  meta: "Laminate · 25 mm · Matte" },
  // Oaks (9)
  "Natural Hamilton Oak":    { group: "oaks",    meta: "Laminate · Woodgrain · Matte" },
  "Light Rustic Oak":        { group: "oaks",    meta: "Laminate · Woodgrain · Matte" },
  "Grey Bardolino Oak":      { group: "oaks",    meta: "Laminate · Woodgrain · Matte" },
  "Vicenza Oak":             { group: "oaks",    meta: "Laminate · Woodgrain · Satin" },
  "Lefkas Oak":              { group: "oaks",    meta: "Laminate · Woodgrain · Matte" },
  "White Oak":               { group: "oaks",    meta: "Veneer · Brushed · Matte" },
  "Devine Oak":              { group: "oaks",    meta: "Laminate · Woodgrain · Satin" },
  "Alpine":                  { group: "oaks",    meta: "Laminate · Woodgrain · Matte" },
  "Aris Anthracite":         { group: "oaks",    meta: "Laminate · Woodgrain · Matte" },
  // Walnuts (4)
  "Natural Hamilton Walnut": { group: "walnuts", meta: "Laminate · Woodgrain · Matte" },
  "Italian Walnut":          { group: "walnuts", meta: "Veneer · Satin" },
  "Anatolia Walnut":         { group: "walnuts", meta: "Laminate · Woodgrain · Matte" },
  "Africa Walnut":           { group: "walnuts", meta: "Laminate · Woodgrain · Matte" },
  // Greys & Blacks (8)
  "Light Grey":              { group: "greys",   meta: "Laminate · Solid · Matte" },
  "Platinum Grey":           { group: "greys",   meta: "Laminate · Solid · Matte" },
  "Basalt Grey":             { group: "greys",   meta: "Laminate · Solid · Matte" },
  "Graphite Grey":           { group: "greys",   meta: "Laminate · Solid · Matte" },
  "Onyx Grey":               { group: "greys",   meta: "Laminate · Solid · Matte" },
  "Soft Black":              { group: "greys",   meta: "Laminate · Solid · Matte · In stock" },
  "Cherry":                  { group: "greys",   meta: "Veneer · Satin" },
  "Argos":                   { group: "greys",   meta: "Laminate · Solid · Matte" },
  // Stone & Neutrals (8)
  "Ibiza":                   { group: "stone",   meta: "Laminate · Stone · Matte" },
  "Dakota":                  { group: "stone",   meta: "Laminate · Stone · Matte" },
  "Garda":                   { group: "stone",   meta: "Laminate · Stone · Matte" },
  "Amalfi":                  { group: "stone",   meta: "Laminate · Stone · Matte" },
  "Armada":                  { group: "stone",   meta: "Laminate · Stone · Matte" },
  "Acapulco":                { group: "stone",   meta: "Laminate · Stone · Matte" },
  "Belmonte":                { group: "stone",   meta: "Laminate · Stone · Matte" },
  "Cabana":                  { group: "stone",   meta: "Laminate · Stone · Matte" },
};

/**
 * Representative hex per finish for 3D viewer material swap (Wave 4 pilot).
 * Values are averaged/estimated from Egger + Kastamonu supplier samples.
 * When the material library textures are ready, these hexes become the
 * fallback + the texture path takes over for grain detail.
 */
export const DESK_TOP_FINISH_HEX: Record<string, string> = {
  // Whites / creams
  "Premium White": "#F4F0E8",
  "Antique White": "#E8DFC8",
  // Oaks (light → mid → dark)
  "Natural Hamilton Oak": "#C2A378",
  "Light Rustic Oak": "#D6B88F",
  "Grey Bardolino Oak": "#A08F7A",
  "Vicenza Oak": "#B89872",
  "Lefkas Oak": "#CDAA7F",
  "White Oak": "#E2CDA0",
  "Devine Oak": "#BFA478",
  // Walnuts (warm, rich browns)
  "Natural Hamilton Walnut": "#7D5A3A",
  "Africa Walnut": "#664228",
  "Anatolia Walnut": "#6E4630",
  "Italian Walnut": "#5B3A26",
  // Greys (light → dark)
  "Cashmere Grey": "#B5AEA0",
  "Light Grey": "#B9B6B0",
  "Basalt Grey": "#595857",
  "Platinum Grey": "#8A8A86",
  "Soft Black": "#2E2B28",
  "Graphite Grey": "#4A4845",
  "Onyx Grey": "#3A3836",
  "Aris Anthracite": "#42403D",
  // Kastamonu decorative
  "Ibiza": "#D4C3A0",
  "Dakota": "#A17953",
  "Garda": "#8B6842",
  "Amalfi": "#C9A27A",
  "Armada": "#7B5C42",
  "Acapulco": "#D8B48A",
  "Belmonte": "#8A6445",
  "Cabana": "#A97A5A",
  "Argos": "#7D6248",
  "Alpine": "#E6DCC5",
  "Cherry": "#9A5A42",
};

/**
 * Per-finish web-ready swatch URL for <model-viewer> baseColorTexture swap.
 * Source: Majestic-HQ material library, resized to 1024×1024 JPG q82 (~80–250KB each).
 * Generated by scripts/build-material-swatches.mjs — regenerate when library changes.
 * When a finish is in this map, the viewer loads the texture; otherwise it falls
 * back to the flat hex from DESK_TOP_FINISH_HEX.
 */
export const DESK_TOP_FINISH_TEXTURE: Record<string, string> = {
  "Premium White":           "/materials/wood/premium-white/swatch.jpg",
  "Natural Hamilton Oak":    "/materials/wood/natural-hamilton-oak/swatch.jpg",
  "Light Rustic Oak":        "/materials/wood/light-rustic-oak/swatch.jpg",
  "Grey Bardolino Oak":      "/materials/wood/grey-bardolino-oak/swatch.jpg",
  "Natural Hamilton Walnut": "/materials/wood/natural-hamilton-walnut/swatch.jpg",
  "Vicenza Oak":             "/materials/wood/vicenza-oak-horizontal/swatch.jpg",
  "Cashmere Grey":           "/materials/wood/cashmere-grey/swatch.jpg",
  "Light Grey":              "/materials/wood/light-grey/swatch.jpg",
  "Basalt Grey":             "/materials/wood/basalt-grey/swatch.jpg",
  "Platinum Grey":           "/materials/wood/platinum-grey/swatch.jpg",
  "Soft Black":              "/materials/wood/soft-black/swatch.jpg",
  "Graphite Grey":           "/materials/wood/graphite-grey/swatch.jpg",
  "Onyx Grey":               "/materials/wood/onyx-grey/swatch.jpg",
  "Africa Walnut":           "/materials/wood/africa-walnut/swatch.jpg",
  "Anatolia Walnut":         "/materials/wood/anatolia-walnut/swatch.jpg",
  "Italian Walnut":          "/materials/wood/italian-walnut/swatch.jpg",
  "Lefkas Oak":              "/materials/wood/lefkas-oak/swatch.jpg",
  "Antique White":           "/materials/wood/antique-white/swatch.jpg",
  "Ibiza":                   "/materials/wood/ibiza/swatch.jpg",
  "Dakota":                  "/materials/wood/dakota/swatch.jpg",
  "Garda":                   "/materials/wood/garda/swatch.jpg",
  "Amalfi":                  "/materials/wood/amalfi/swatch.jpg",
  "Armada":                  "/materials/wood/armada/swatch.jpg",
  "Acapulco":                "/materials/wood/acapulco/swatch.jpg",
  "Belmonte":                "/materials/wood/belmonte/swatch.jpg",
  "Cabana":                  "/materials/wood/cabana/swatch.jpg",
  "Argos":                   "/materials/wood/argos/swatch.jpg",
  "Alpine":                  "/materials/wood/alpine/swatch.jpg",
  "White Oak":               "/materials/wood/white-oak/swatch.jpg",
  "Cherry":                  "/materials/wood/cherry/swatch.jpg",
  "Aris Anthracite":         "/materials/wood/aris-anthracite/swatch.jpg",
  "Devine Oak":              "/materials/wood/devine-oak/swatch.jpg",
};

export const LEG_COLORS = [
  "Black Powder Coat",
  "White Powder Coat",
  "Silver Powder Coat",
  "Polished Chrome",
] as const;

/**
 * Leg material properties for 3D viewer (Wave 4 pilot).
 * Powder coats are low-metalness, higher roughness.
 * Polished chrome is high-metalness, low-roughness.
 */
export const LEG_COLOR_MATERIAL: Record<
  string,
  { hex: string; metalness: number; roughness: number }
> = {
  "Black Powder Coat": { hex: "#2B2B2B", metalness: 0.1, roughness: 0.7 },
  "White Powder Coat": { hex: "#F4F4F4", metalness: 0.1, roughness: 0.65 },
  "Silver Powder Coat": { hex: "#9A9CA0", metalness: 0.2, roughness: 0.55 },
  "Polished Chrome":    { hex: "#D9D9D9", metalness: 1.0, roughness: 0.08 },
};

/**
 * Per-family GLB mesh targeting for runtime material swap.
 * When user picks finish → we target `top` mesh's material.
 * When user picks leg color → we target `legs` meshes' material.
 *
 * Only families with verified mesh names are included here. Families
 * not in this map fall back to static GLB (no live swap).
 *
 * Cratos verified by gltf-transform inspect 2026-04-20:
 *   - Majestic_Oak (1 mesh instance, carries baseColorTexture) → the desk TOP
 *   - Majestic_WhitePaint (9 mesh instances)                   → the legs/body
 */
export const FAMILY_MESH_MAP: Record<
  string,
  { topMaterial: string; legsMaterial: string }
> = {
  // Key pattern: `${FAMILY}` for default (= Executive), `${FAMILY}:${Config}` for variants.
  // Verified by gltf-transform inspect on each exported GLB (2026-04-20).
  CRATOS: {
    topMaterial: "Majestic_Oak",
    legsMaterial: "Majestic_WhitePaint",
  },
  "CRATOS:Executive": {
    topMaterial: "Majestic_Oak",
    legsMaterial: "Majestic_WhitePaint",
  },
  // MGR / CONF / L entries reverted along with their broken baked GLBs — to
  // be replaced by the part-GLB composition pipeline (scene composer + manifest).
};

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
