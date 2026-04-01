import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/common/reveal";
import { StaggerGrid } from "@/components/common/stagger-grid";
import { ProductCard } from "@/components/shop/product-card";
import { LayoutGrid, List, SlidersHorizontal, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "جميع المنتجات — أثاث مكتبي احترافي | ماجيستيك" : "All Products — Professional Office Furniture | Majestic",
    description: isAr
      ? "تصفح مجموعتنا الكاملة من الأثاث المكتبي الاحترافي: مكاتب تنفيذية، كراسي مريحة، محطات عمل، طاولات اجتماعات، ووحدات تخزين. توصيل وتركيب في الرياض."
      : "Browse our complete range of professional office furniture: executive desks, ergonomic chairs, workstations, meeting tables, and storage units. Delivery and assembly in Riyadh.",
    alternates: {
      canonical: `https://thedeskco.net/en/shop`,
      languages: {
        en: "https://thedeskco.net/en/shop",
        ar: "https://thedeskco.net/ar/shop",
        "x-default": "https://thedeskco.net/en/shop",
      },
    },
    openGraph: {
      title: isAr ? "جميع المنتجات | ماجيستيك" : "All Products | Majestic Furniture",
      description: isAr
        ? "تصفح مجموعتنا الكاملة من الأثاث المكتبي الاحترافي"
        : "Browse our complete range of professional office furniture",
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
      siteName: "Majestic Furniture",
    },
  };
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Enigma Executive Desk",
    nameAr: "مكتب إنيجما التنفيذي",
    category: "Executive Desks",
    categoryAr: "المكاتب التنفيذية",
    brand: "Majestic",
    price: 2850,
    originalPrice: undefined as number | undefined,
    discount: undefined as number | undefined,
    image: "/images/hero-desks.jpg",
  },
  {
    id: 2,
    name: "ErgoMax Pro Chair",
    nameAr: "كرسي إيرجوماكس برو",
    category: "Ergonomic Chairs",
    categoryAr: "الكراسي المريحة",
    brand: "ChairLine",
    price: 1250,
    originalPrice: 1650 as number | undefined,
    discount: 24 as number | undefined,
    image: "/images/hero-seating.jpg",
  },
  {
    id: 3,
    name: "ModularFlex Workstation",
    nameAr: "محطة عمل مودولارفلكس",
    category: "Workstations",
    categoryAr: "محطات العمل",
    brand: "Majestic",
    price: 3400,
    originalPrice: undefined,
    discount: undefined,
    image: "/images/hero-storage.jpg",
  },
  {
    id: 4,
    name: "Conference Pro Table",
    nameAr: "طاولة المؤتمرات برو",
    category: "Meeting Tables",
    categoryAr: "طاولات الاجتماعات",
    brand: "Majestic",
    price: 4200,
    originalPrice: undefined,
    discount: undefined,
    image: "/images/hero-tables.jpg",
  },
  {
    id: 5,
    name: "AcoustiPanel Divider",
    nameAr: "حاجز أكوستي باني",
    category: "Acoustics",
    categoryAr: "العوازل الصوتية",
    brand: "Other",
    price: 980,
    originalPrice: 1200 as number | undefined,
    discount: 18 as number | undefined,
    image: "/images/hero-seating.jpg",
  },
  {
    id: 6,
    name: "Lounge Series Sofa",
    nameAr: "أريكة لاونج سيريز",
    category: "Lounge",
    categoryAr: "الاسترخاء",
    brand: "Majestic",
    price: 5600,
    originalPrice: undefined,
    discount: undefined,
    image: "/images/hero-tables.jpg",
  },
  {
    id: 7,
    name: "VertexStand Desk",
    nameAr: "مكتب فيرتكس ستاند",
    category: "Desks",
    categoryAr: "المكاتب",
    brand: "Majestic",
    price: 1875,
    originalPrice: undefined,
    discount: undefined,
    image: "/images/hero-desks.jpg",
  },
  {
    id: 8,
    name: "CabinetX Storage Unit",
    nameAr: "وحدة تخزين كابينت إكس",
    category: "Storage",
    categoryAr: "وحدات التخزين",
    brand: "Other",
    price: 760,
    originalPrice: undefined,
    discount: undefined,
    image: "/images/hero-storage.jpg",
  },
  {
    id: 9,
    name: "NomadPod Workstation",
    nameAr: "محطة عمل نومادبود",
    category: "Workstations",
    categoryAr: "محطات العمل",
    brand: "ChairLine",
    price: 2200,
    originalPrice: 2750 as number | undefined,
    discount: 20 as number | undefined,
    image: "/images/hero-desks.jpg",
  },
  {
    id: 10,
    name: "PivotTask Chair",
    nameAr: "كرسي بيفوت تاسك",
    category: "Ergonomic Chairs",
    categoryAr: "الكراسي المريحة",
    brand: "ChairLine",
    price: 890,
    originalPrice: undefined,
    discount: undefined,
    image: "/images/hero-seating.jpg",
  },
  {
    id: 11,
    name: "SlimStack Shelving",
    nameAr: "رفوف سليم ستاك",
    category: "Storage",
    categoryAr: "وحدات التخزين",
    brand: "Majestic",
    price: 540,
    originalPrice: undefined,
    discount: undefined,
    image: "/images/hero-storage.jpg",
  },
  {
    id: 12,
    name: "ArenaRound Meeting Table",
    nameAr: "طاولة اجتماعات أرينا راوند",
    category: "Meeting Tables",
    categoryAr: "طاولات الاجتماعات",
    brand: "Majestic",
    price: 3100,
    originalPrice: undefined,
    discount: undefined,
    image: "/images/hero-tables.jpg",
  },
] as const;

const SIDEBAR_CATEGORIES = [
  { slug: "seating", en: "Seating", ar: "الجلوس" },
  { slug: "desks", en: "Desks", ar: "المكاتب" },
  { slug: "storage", en: "Storage", ar: "التخزين" },
  { slug: "workstations", en: "Workstations", ar: "محطات العمل" },
  { slug: "acoustics", en: "Acoustics", ar: "العوازل" },
  { slug: "lounge", en: "Lounge", ar: "الاسترخاء" },
];

const BRANDS = [
  { value: "majestic", en: "Majestic", ar: "ماجيستيك" },
  { value: "chairline", en: "ChairLine", ar: "شيرلاين" },
  { value: "other", en: "Other", ar: "أخرى" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  // getTranslations available if needed later
  await getTranslations({ locale });

  const productItems = MOCK_PRODUCTS.map((p) => (
    <ProductCard
      key={p.id}
      id={p.id}
      name={isAr ? p.nameAr : p.name}
      category={isAr ? p.categoryAr : p.category}
      brand={p.brand}
      price={p.price}
      originalPrice={p.originalPrice}
      discount={p.discount}
      image={p.image}
      isAr={isAr}
    />
  ));

  return (
    <main className="flex-1 bg-white min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 pt-6 pb-16">

        {/* Breadcrumb */}
        <Reveal>
          <nav
            aria-label={isAr ? "مسار التنقل" : "Breadcrumb"}
            className="flex items-center gap-1.5 text-xs text-[#484848] mb-6"
          >
            <Link href="/" className="hover:text-[#0c0c0c] transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight
              size={12}
              className={isAr ? "rotate-180" : ""}
              aria-hidden="true"
            />
            <span className="text-[#0c0c0c] font-medium">
              {isAr ? "جميع المنتجات" : "All Products"}
            </span>
          </nav>
        </Reveal>

        <div className="flex gap-8 items-start">

          {/* ── Sidebar (desktop) ──────────────────────────────────────────── */}
          <aside
            className="hidden lg:block w-[260px] shrink-0 sticky top-[156px]"
            aria-label={isAr ? "تصفية المنتجات" : "Product filters"}
          >
            {/* Heading + Reset */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#0c0c0c] uppercase tracking-wide">
                {isAr ? "تصفية" : "Filters"}
              </h2>
              <button className="text-xs text-[#484848] hover:text-[#0c0c0c] transition-colors underline underline-offset-2">
                {isAr ? "إعادة تعيين" : "Reset all"}
              </button>
            </div>

            {/* Category */}
            <div className="border-t border-[rgba(0,0,0,0.08)] pt-4 pb-4">
              <details open className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none mb-3">
                  <span className="text-xs font-semibold text-[#0c0c0c] uppercase tracking-wide">
                    {isAr ? "الفئة" : "Category"}
                  </span>
                  <ChevronRight
                    size={13}
                    className="text-[#484848] group-open:rotate-90 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </summary>
                <ul className="space-y-2.5">
                  {SIDEBAR_CATEGORIES.map((cat) => (
                    <li key={cat.slug}>
                      <label className="flex items-center gap-2.5 cursor-pointer group/item">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded-sm border border-[rgba(0,0,0,0.21)] accent-[#0c0c0c] cursor-pointer"
                          defaultChecked={false}
                        />
                        <span className="text-sm text-[#484848] group-hover/item:text-[#0c0c0c] transition-colors">
                          {isAr ? cat.ar : cat.en}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </details>
            </div>

            {/* Price range */}
            <div className="border-t border-[rgba(0,0,0,0.08)] pt-4 pb-4">
              <details open className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none mb-3">
                  <span className="text-xs font-semibold text-[#0c0c0c] uppercase tracking-wide">
                    {isAr ? "نطاق السعر" : "Price Range"}
                  </span>
                  <ChevronRight
                    size={13}
                    className="text-[#484848] group-open:rotate-90 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </summary>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-[#484848] block mb-1">
                      {isAr ? "من" : "Min"}
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      min={0}
                      max={10000}
                      className="w-full border border-[rgba(0,0,0,0.21)] rounded-sm px-2 py-1.5 text-xs text-[#0c0c0c] placeholder:text-[#484848] focus:outline-none focus:border-[#0c0c0c] bg-white"
                    />
                  </div>
                  <span className="text-[#484848] text-xs mt-4">—</span>
                  <div className="flex-1">
                    <label className="text-[10px] text-[#484848] block mb-1">
                      {isAr ? "إلى" : "Max"}
                    </label>
                    <input
                      type="number"
                      placeholder="10,000"
                      min={0}
                      max={10000}
                      className="w-full border border-[rgba(0,0,0,0.21)] rounded-sm px-2 py-1.5 text-xs text-[#0c0c0c] placeholder:text-[#484848] focus:outline-none focus:border-[#0c0c0c] bg-white"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[#484848] mt-1.5">SAR 0 — SAR 10,000</p>
              </details>
            </div>

            {/* Brand */}
            <div className="border-t border-[rgba(0,0,0,0.08)] pt-4 pb-4">
              <details open className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none mb-3">
                  <span className="text-xs font-semibold text-[#0c0c0c] uppercase tracking-wide">
                    {isAr ? "العلامة التجارية" : "Brand"}
                  </span>
                  <ChevronRight
                    size={13}
                    className="text-[#484848] group-open:rotate-90 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </summary>
                <ul className="space-y-2.5">
                  {BRANDS.map((b) => (
                    <li key={b.value}>
                      <label className="flex items-center gap-2.5 cursor-pointer group/item">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded-sm border border-[rgba(0,0,0,0.21)] accent-[#0c0c0c] cursor-pointer"
                          defaultChecked={false}
                        />
                        <span className="text-sm text-[#484848] group-hover/item:text-[#0c0c0c] transition-colors">
                          {isAr ? b.ar : b.en}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </details>
            </div>

            {/* In Stock toggle */}
            <div className="border-t border-[rgba(0,0,0,0.08)] pt-4 pb-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-[#0c0c0c] uppercase tracking-wide">
                  {isAr ? "متوفر في المخزون" : "In Stock Only"}
                </span>
                {/* Simple toggle — visual only */}
                <div className="relative w-9 h-5">
                  <input type="checkbox" className="sr-only peer" defaultChecked={false} />
                  <div
                    className="w-9 h-5 bg-[rgba(0,0,0,0.12)] peer-checked:bg-[#0c0c0c]
                    rounded-full transition-colors duration-200 cursor-pointer"
                  />
                  <div
                    className="absolute top-0.5 start-0.5 w-4 h-4 bg-white rounded-full
                    shadow-sm transition-all duration-200 peer-checked:translate-x-4"
                  />
                </div>
              </label>
            </div>
          </aside>

          {/* ── Main content ───────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Page title */}
            <Reveal>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0c0c0c] tracking-tight mb-5">
                {isAr ? "جميع المنتجات" : "All Products"}
              </h1>
            </Reveal>

            {/* Sort bar */}
            <Reveal>
              <div className="flex items-center justify-between gap-4 mb-4">
                {/* Left: count + mobile filter button */}
                <div className="flex items-center gap-3">
                  {/* Mobile filter button */}
                  <button
                    className="lg:hidden flex items-center gap-1.5 border border-[rgba(0,0,0,0.21)]
                    rounded-sm px-3 py-2 text-xs font-medium text-[#0c0c0c] hover:bg-[#fafafa]
                    transition-colors btn-press"
                    aria-label={isAr ? "فتح التصفية" : "Open filters"}
                  >
                    <SlidersHorizontal size={13} aria-hidden="true" />
                    {isAr ? "تصفية (3 نشطة)" : "Filters (3 active)"}
                  </button>
                  <span className="hidden sm:block text-sm text-[#484848]">
                    {isAr
                      ? `عرض ${MOCK_PRODUCTS.length} منتج`
                      : `Showing ${MOCK_PRODUCTS.length} products`}
                  </span>
                </div>

                {/* Right: sort + view toggle */}
                <div className="flex items-center gap-2">
                  <select
                    className="text-xs border border-[rgba(0,0,0,0.21)] rounded-sm px-2.5 py-2
                    bg-white text-[#0c0c0c] focus:outline-none focus:border-[#0c0c0c] cursor-pointer"
                    aria-label={isAr ? "ترتيب المنتجات" : "Sort products"}
                    defaultValue="featured"
                  >
                    <option value="featured">{isAr ? "المميزة" : "Featured"}</option>
                    <option value="price-asc">{isAr ? "السعر: من الأقل" : "Price: Low to High"}</option>
                    <option value="price-desc">{isAr ? "السعر: من الأعلى" : "Price: High to Low"}</option>
                    <option value="newest">{isAr ? "الأحدث" : "Newest"}</option>
                  </select>

                  {/* View toggle */}
                  <div className="flex border border-[rgba(0,0,0,0.21)] rounded-sm overflow-hidden">
                    <button
                      className="p-2 bg-[#0c0c0c] text-white"
                      aria-label={isAr ? "عرض شبكي" : "Grid view"}
                      aria-pressed={true}
                    >
                      <LayoutGrid size={13} aria-hidden="true" />
                    </button>
                    <button
                      className="p-2 bg-white text-[#484848] hover:bg-[#fafafa] transition-colors"
                      aria-label={isAr ? "عرض قائمة" : "List view"}
                      aria-pressed={false}
                    >
                      <List size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Quotation CTA banner */}
            <Reveal>
              <div
                className="flex items-center justify-between gap-4 bg-[#0c0c0c] px-5
                rounded-sm mb-5 min-h-[56px]"
              >
                <p className="text-white text-xs font-medium">
                  {isAr
                    ? "تحتاج أثاثاً مكتبياً لفريقك؟"
                    : "Need office furniture for your team?"}
                </p>
                <button
                  className="btn-press shrink-0 border border-white text-white text-xs font-semibold
                  px-4 py-1.5 rounded-sm hover:bg-white hover:text-[#0c0c0c] transition-colors whitespace-nowrap"
                >
                  {isAr ? "إنشاء عرض سعر" : "Create a Quotation"}
                </button>
              </div>
            </Reveal>

            {/* Product grid */}
            <StaggerGrid
              stagger={0.06}
              isRTL={isAr}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[15px]"
            >
              {productItems}
            </StaggerGrid>

            {/* Pagination */}
            <Reveal>
              <nav
                aria-label={isAr ? "تنقل الصفحات" : "Page navigation"}
                className="flex items-center justify-center gap-1 mt-12"
              >
                <PaginationButton disabled isAr={isAr} direction="prev" />
                <PaginationButton page={1} current isAr={isAr} />
                <PaginationButton page={2} isAr={isAr} />
                <PaginationButton page={3} isAr={isAr} />
                <span className="px-2 text-sm text-[#484848]" aria-hidden="true">…</span>
                <PaginationButton page={8} isAr={isAr} />
                <PaginationButton isAr={isAr} direction="next" />
              </nav>
            </Reveal>

          </div>
        </div>
      </div>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PaginationButton({
  page,
  current,
  disabled,
  direction,
  isAr,
}: {
  page?: number;
  current?: boolean;
  disabled?: boolean;
  direction?: "prev" | "next";
  isAr: boolean;
}) {
  const base =
    "inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-xs font-medium rounded-sm transition-colors";

  if (direction) {
    const label = direction === "prev"
      ? (isAr ? "السابق" : "Previous")
      : (isAr ? "التالي" : "Next");

    return (
      <button
        disabled={disabled}
        className={`${base} border border-[rgba(0,0,0,0.21)] text-[#484848]
          hover:border-[#0c0c0c] hover:text-[#0c0c0c]
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[rgba(0,0,0,0.21)]
          disabled:hover:text-[#484848]`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      aria-current={current ? "page" : undefined}
      className={`${base} border ${
        current
          ? "bg-[#0c0c0c] text-white border-[#0c0c0c]"
          : "border-[rgba(0,0,0,0.21)] text-[#484848] hover:border-[#0c0c0c] hover:text-[#0c0c0c]"
      }`}
    >
      {page}
    </button>
  );
}
