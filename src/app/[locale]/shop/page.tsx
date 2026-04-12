import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BreadcrumbListJsonLd } from "@/components/common/json-ld";
import {
  getProductPage,
  getCategories,
  parsePrice,
  calcDiscount,
  PRODUCT_PLACEHOLDER,
} from "@/lib/woocommerce";
import { Reveal } from "@/components/common/reveal";
import { StaggerGrid } from "@/components/common/stagger-grid";
import { ProductCard } from "@/components/shop/product-card";
import { ShopSidebar } from "@/components/shop/shop-sidebar";
import { ShopTopBar } from "@/components/shop/shop-top-bar";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr
      ? "تشكيلة الأثاث المكتبي — ماجستيك | السعودية"
      : "Office Furniture Collection — Majestic | Saudi Arabia",
    description: isAr
      ? "كراسي تنفيذية، محطات عمل، أنظمة اجتماعات، تخزين، استقبال، وحلول صوتية. وفق معايير العمارة الحديثة — للمملكة ودول الخليج."
      : "Executive seating, workstations, conference systems, storage, lounge, and acoustic solutions. Built to modern architectural standards — supplied across Saudi Arabia and the Gulf.",
    alternates: {
      canonical: siteUrl(`/${locale}/shop`),
      languages: {
        en: siteUrl("/en/shop"),
        ar: siteUrl("/ar/shop"),
        "x-default": siteUrl("/en/shop"),
      },
    },
  };
}

const SORT_MAP: Record<string, { orderby: string; order: "asc" | "desc" }> = {
  "price-asc": { orderby: "price", order: "asc" },
  "price-desc": { orderby: "price", order: "desc" },
  newest: { orderby: "date", order: "desc" },
  featured: { orderby: "menu_order", order: "asc" },
};

const PER_PAGE = 24;

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const isAr = locale === "ar";
  await getTranslations({ locale });

  // Parse URL params
  const categorySlugRaw = typeof sp.category === "string" ? sp.category : undefined;
  const categorySlug = categorySlugRaw ?? undefined;
  const search = typeof sp.search === "string" ? sp.search : undefined;
  const page = Math.max(1, parseInt(typeof sp.page === "string" ? sp.page : "1", 10));
  const sort = typeof sp.sort === "string" ? sp.sort : "featured";

  // Resolve category slug → WC category ID
  let categoryId: number | undefined;
  let categoryLabel = "";
  if (categorySlug) {
    const allCats = await getCategories().catch(() => []);
    const matched = allCats.find((c) => c.slug === categorySlug);
    if (matched) {
      categoryId = matched.id;
      categoryLabel = matched.name;
    }
  }

  const { orderby, order } = SORT_MAP[sort] ?? SORT_MAP.featured;

  const result = await getProductPage({
    lang: locale,
    per_page: PER_PAGE,
    page,
    ...(categoryId ? { category: categoryId } : {}),
    ...(search ? { search } : {}),
    orderby,
    order,
  }).catch(() => ({ products: [] as import("@/lib/woocommerce").WCProduct[], total: 0, totalPages: 1, failed: true as const }));
  const { products: wcProducts, total, totalPages } = result;
  const apiFailed = "failed" in result;

  const productItems = wcProducts.map((p) => {
    const price = parsePrice(p.price);
    const originalPrice = p.on_sale ? parsePrice(p.regular_price) : undefined;
    const discount = p.on_sale ? calcDiscount(p.regular_price, p.price) : undefined;
    const image = p.images[0]?.src || PRODUCT_PLACEHOLDER;
    const category = p.categories[0]?.name || "";
    return (
      <ProductCard
        key={p.id}
        id={p.id}
        name={p.name}
        category={category}
        brand=""
        price={price}
        originalPrice={originalPrice}
        discount={discount}
        image={image}
        isAr={isAr}
      />
    );
  });

  // Build pagination href helper
  function pageHref(p: number) {
    const q = new URLSearchParams();
    if (categorySlugRaw) q.set("category", categorySlugRaw);
    if (search) q.set("search", search);
    if (sort !== "featured") q.set("sort", sort);
    if (p > 1) q.set("page", String(p));
    const qs = q.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }

  const pageTitle = categoryLabel
    ? categoryLabel
    : search
    ? (isAr ? `نتائج: "${search}"` : `Results: "${search}"`)
    : isAr
    ? "المجموعة."
    : "The Collection.";

  return (
    <main id="main-content" className="flex-1 bg-white min-h-screen">
      <BreadcrumbListJsonLd
        items={[
          { name: isAr ? "الرئيسية" : "Home", item: siteUrl(`/${locale}/`) },
          { name: isAr ? "جميع المنتجات" : "Shop", item: siteUrl(`/${locale}/shop`) },
        ]}
      />
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 pt-6 pb-16">

        {/* Breadcrumb */}
        <Reveal>
          <nav
            aria-label={isAr ? "مسار التنقل" : "Breadcrumb"}
            className="flex items-center gap-1.5 text-xs text-[#3A3A3A] mb-6"
          >
            <Link href="/" className="hover:text-[#2C2C2C] transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight size={12} className={isAr ? "rotate-180" : ""} aria-hidden="true" />
            {categoryLabel ? (
              <>
                <Link href="/shop" className="hover:text-[#2C2C2C] transition-colors">
                  {isAr ? "جميع المنتجات" : "All Products"}
                </Link>
                <ChevronRight size={12} className={isAr ? "rotate-180" : ""} aria-hidden="true" />
                <span className="text-[#2C2C2C] font-medium">{categoryLabel}</span>
              </>
            ) : (
              <span className="text-[#2C2C2C] font-medium">
                {isAr ? "جميع المنتجات" : "All Products"}
              </span>
            )}
          </nav>
        </Reveal>

        <div className="flex gap-8 items-start">

          {/* ── Sidebar (desktop) ──────────────────────────────────────────── */}
          <ShopSidebar activeCategory={categorySlugRaw} activeSort={sort} />

          {/* ── Main content ───────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Page title */}
            <Reveal>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-5">
                {pageTitle}
              </h1>
            </Reveal>

            {/* Shop intro copy — shown only on the root shop page (no category/search filter) */}
            {!categorySlugRaw && !search && page === 1 && (
              <Reveal>
                <div className="max-w-screen-lg mx-auto px-0 pt-0 pb-8">
                  <p className="text-[#3A3A3A] text-base leading-relaxed">
                    {isAr
                      ? "كراسي تنفيذية، محطات عمل، أنظمة اجتماعات، تخزين، استقبال، وحلول صوتية. وفق معايير العمارة الحديثة — للمملكة ودول الخليج."
                      : "Executive seating, workstations, conference systems, storage, lounge, and acoustic solutions. Built to modern architectural standards — supplied across Saudi Arabia and the Gulf."}
                  </p>
                </div>
              </Reveal>
            )}

            {/* Sort bar */}
            <Reveal>
              <ShopTopBar productCount={total || wcProducts.length} activeSort={sort} />
            </Reveal>

            {/* Quotation CTA banner */}
            <Reveal>
              <div className="flex items-center justify-between gap-4 bg-[#2C2C2C] px-5 rounded-none mb-5 min-h-[56px]">
                <p className="text-white text-xs font-medium">
                  {isAr ? "تحتاج أثاثاً مكتبياً لفريقك؟" : "Need office furniture for your team?"}
                </p>
                <Link
                  href="/quotation"
                  className="btn-press shrink-0 border border-white text-white text-xs font-semibold
                  px-4 py-1.5 rounded-none hover:bg-white hover:text-[#2C2C2C] transition-colors whitespace-nowrap"
                >
                  {isAr ? "إنشاء عرض سعر" : "Create a Quotation"}
                </Link>
              </div>
            </Reveal>

            {/* Product grid */}
            {productItems.length > 0 ? (
              <StaggerGrid
                stagger={0.06}
                isRTL={isAr}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[15px]"
              >
                {productItems}
              </StaggerGrid>
            ) : apiFailed ? (
              <div className="py-24 text-center text-[#3A3A3A]">
                <p className="text-lg font-medium">
                  {isAr ? "المتجر غير متاح مؤقتاً" : "Catalog temporarily unavailable"}
                </p>
                <p className="text-sm mt-2">
                  {isAr ? "يرجى المحاولة مرة أخرى لاحقاً" : "Please try again later"}
                </p>
              </div>
            ) : (
              <div className="py-24 text-center text-[#3A3A3A]">
                <p className="text-lg font-medium">
                  {isAr ? "لا توجد منتجات" : "No products found"}
                </p>
                <Link href="/shop" className="mt-4 inline-block text-sm underline underline-offset-2 hover:text-[#2C2C2C]">
                  {isAr ? "عرض الكل" : "View all products"}
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Reveal>
                <nav
                  aria-label={isAr ? "تنقل الصفحات" : "Page navigation"}
                  className="flex items-center justify-center gap-1 mt-12"
                >
                  {/* Prev */}
                  {page > 1 ? (
                    <Link
                      href={pageHref(page - 1)}
                      className="inline-flex items-center justify-center gap-1 min-w-[32px] h-8 px-3
                        text-xs font-medium rounded-none border border-[rgba(0,0,0,0.21)]
                        text-[#3A3A3A] hover:border-[#2C2C2C] hover:text-[#2C2C2C] transition-colors"
                    >
                      {isAr ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                      {isAr ? "السابق" : "Prev"}
                    </Link>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-1 min-w-[32px] h-8 px-3
                      text-xs font-medium rounded-none border border-[rgba(0,0,0,0.21)]
                      text-[#3A3A3A] opacity-30 cursor-not-allowed">
                      {isAr ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                      {isAr ? "السابق" : "Prev"}
                    </span>
                  )}

                  {/* Page numbers */}
                  {buildPageNumbers(page, totalPages).map((p, i) =>
                    p === "…" ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-sm text-[#3A3A3A]" aria-hidden="true">…</span>
                    ) : (
                      <Link
                        key={p}
                        href={pageHref(p as number)}
                        aria-current={p === page ? "page" : undefined}
                        className={`inline-flex items-center justify-center min-w-[32px] h-8 px-2
                          text-xs font-medium rounded-none border transition-colors ${
                          p === page
                            ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                            : "border-[rgba(0,0,0,0.21)] text-[#3A3A3A] hover:border-[#2C2C2C] hover:text-[#2C2C2C]"
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  )}

                  {/* Next */}
                  {page < totalPages ? (
                    <Link
                      href={pageHref(page + 1)}
                      className="inline-flex items-center justify-center gap-1 min-w-[32px] h-8 px-3
                        text-xs font-medium rounded-none border border-[rgba(0,0,0,0.21)]
                        text-[#3A3A3A] hover:border-[#2C2C2C] hover:text-[#2C2C2C] transition-colors"
                    >
                      {isAr ? "التالي" : "Next"}
                      {isAr ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
                    </Link>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-1 min-w-[32px] h-8 px-3
                      text-xs font-medium rounded-none border border-[rgba(0,0,0,0.21)]
                      text-[#3A3A3A] opacity-30 cursor-not-allowed">
                      {isAr ? "التالي" : "Next"}
                      {isAr ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
                    </span>
                  )}
                </nav>
              </Reveal>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}
