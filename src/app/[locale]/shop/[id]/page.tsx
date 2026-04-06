import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { Reveal } from "@/components/common/reveal";
import { StaggerGrid } from "@/components/common/stagger-grid";
import { ProductCard } from "@/components/shop/product-card";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { JsonLd } from "@/components/common/json-ld";
import { ChevronRight, Truck, Clock, Wrench } from "lucide-react";
import type { Metadata } from "next";
import { getProduct, getProducts, parsePrice, calcDiscount, PRODUCT_PLACEHOLDER } from "@/lib/woocommerce";

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const isAr = locale === "ar";
  let product;
  try {
    product = await getProduct(Number(id));
  } catch {
    return { title: isAr ? "المنتج غير موجود" : "Product not found" };
  }
  const image = product.images[0]?.src || "";
  return {
    title: isAr
      ? `${product.name} | ماجيستيك`
      : `${product.name} | Majestic Furniture`,
    description: product.short_description?.replace(/<[^>]+>/g, "").slice(0, 160) || product.name,
    alternates: {
      canonical: `https://lightyellow-mallard-240169.hostingersite.com/${locale}/shop/${id}`,
      languages: {
        en: `https://lightyellow-mallard-240169.hostingersite.com/en/shop/${id}`,
        ar: `https://lightyellow-mallard-240169.hostingersite.com/ar/shop/${id}`,
        "x-default": `https://lightyellow-mallard-240169.hostingersite.com/en/shop/${id}`,
      },
    },
    openGraph: {
      title: `${product.name} | Majestic Furniture`,
      type: "website",
      locale: isAr ? "ar_SA" : "en_SA",
      siteName: "Majestic Furniture",
      images: image ? [{ url: image, width: 1200, height: 630, alt: product.name }] : [],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  let product;
  try {
    product = await getProduct(Number(id));
  } catch {
    notFound();
  }

  if (!product) notFound();

  const price = parsePrice(product.price);
  const originalPrice = product.on_sale ? parsePrice(product.regular_price) : undefined;
  const discount = product.on_sale ? calcDiscount(product.regular_price, product.price) : undefined;
  const images = product.images.length > 0
    ? product.images
    : [{ id: 0, src: PRODUCT_PLACEHOLDER, alt: product.name }];
  const category = product.categories[0]?.name || "";
  const shortDesc = product.short_description?.replace(/<[^>]+>/g, "") || "";

  // Related products: same category, different id
  const related = await getProducts({ lang: locale, per_page: 4, category: product.categories[0]?.id }).catch(() => []);
  const relatedFiltered = related.filter((p) => p.id !== product.id).slice(0, 4);

  const relatedCards = relatedFiltered.map((p) => (
    <ProductCard
      key={p.id}
      id={p.id}
      name={p.name}
      category={p.categories[0]?.name || ""}
      brand=""
      price={parsePrice(p.price)}
      originalPrice={p.on_sale ? parsePrice(p.regular_price) : undefined}
      discount={p.on_sale ? calcDiscount(p.regular_price, p.price) : undefined}
      image={p.images[0]?.src || PRODUCT_PLACEHOLDER}
      isAr={isAr}
    />
  ));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images[0].src,
    description: shortDesc,
    sku: product.sku || String(product.id),
    offers: {
      "@type": "Offer",
      priceCurrency: "SAR",
      price: price > 0 ? String(price) : undefined,
      availability: product.stock_status === "instock"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://lightyellow-mallard-240169.hostingersite.com/${locale}/shop/${product.id}`,
    },
  };

  return (
    <main className="flex-1 bg-white min-h-screen">
      <JsonLd data={productSchema} />
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 pt-6 pb-16">

        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        <nav
          aria-label={isAr ? "مسار التنقل" : "Breadcrumb"}
          className="flex items-center gap-1.5 text-xs text-[#484848] mb-8 flex-wrap"
        >
          <Link href="/" className="hover:text-gray-900] transition-colors">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <ChevronRight size={12} className={isAr ? "rotate-180" : ""} aria-hidden="true" />
          <Link href="/shop" className="hover:text-gray-900] transition-colors">
            {isAr ? "المتجر" : "Shop"}
          </Link>
          <ChevronRight size={12} className={isAr ? "rotate-180" : ""} aria-hidden="true" />
          <span className="text-[#484848]">{category}</span>
          <ChevronRight size={12} className={isAr ? "rotate-180" : ""} aria-hidden="true" />
          <span className="text-gray-900] font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* ── Two-column layout ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-10 lg:gap-16 items-start">

          {/* ── LEFT: Image gallery ─────────────────────────────────────── */}
          <Reveal>
            <ProductGallery images={images} name={product.name} />
          </Reveal>

          {/* ── RIGHT: Product info ─────────────────────────────────────── */}
          <Reveal yIn={20}>
            <div className="space-y-5">

              {/* Category label */}
              {category && (
                <p className="text-xs uppercase tracking-widest text-[#484848]">{category}</p>
              )}

              {/* Product name */}
              <h1 className="text-3xl font-bold text-gray-900] leading-tight">{product.name}</h1>

              {/* Price row */}
              <div className="flex items-baseline gap-3 flex-wrap">
                {price > 0 ? (
                  <>
                    <span className="text-2xl font-bold text-gray-900]">
                      {isAr ? `${price.toLocaleString("ar-SA")} ر.س` : `SAR ${price.toLocaleString()}`}
                    </span>
                    {originalPrice && (
                      <span className="text-base text-[#484848] line-through">
                        {isAr ? `${originalPrice.toLocaleString("ar-SA")} ر.س` : `SAR ${originalPrice.toLocaleString()}`}
                      </span>
                    )}
                    {discount && (
                      <span className="text-xs font-bold bg-[#e53e3e] text-white px-2 py-0.5 rounded-sm">
                        -{discount}%
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-lg text-[#484848]">
                    {isAr ? "اتصل للسعر" : "Contact for price"}
                  </span>
                )}
              </div>

              {/* Short description */}
              {shortDesc && (
                <p className="text-sm text-[#484848] leading-relaxed">{shortDesc}</p>
              )}

              {/* Quantity + Add to Cart */}
              <div className="space-y-3">
                <AddToCartButton
                  productId={product.id}
                  locale={locale}
                  product={{
                    name: product.name,
                    nameAr: product.name,
                    price,
                    image: images[0]?.src ?? "",
                    category,
                    categoryAr: category,
                  }}
                />
                <button
                  className="btn-press w-full border border-[#0c0c0c] text-gray-900 py-4
                    font-semibold rounded-sm hover:bg-gray-50 transition-colors cursor-pointer text-sm"
                >
                  {isAr ? "طلب عرض سعر" : "Request a Quote"}
                </button>
              </div>

              <hr className="border-[rgba(0,0,0,0.08)]" />

              {/* Delivery info */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs text-[#484848]">
                  <Truck size={14} aria-hidden="true" className="shrink-0 text-gray-900]" />
                  <span>{isAr ? "توصيل مجاني فوق 500 ريال" : "Free delivery over SAR 500"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#484848]">
                  <Clock size={14} aria-hidden="true" className="shrink-0 text-gray-900]" />
                  <span>{isAr ? "5-7 أيام عمل" : "5–7 business days"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#484848]">
                  <Wrench size={14} aria-hidden="true" className="shrink-0 text-gray-900]" />
                  <span>{isAr ? "التركيب مشمول" : "Assembly included"}</span>
                </div>
              </div>

            </div>
          </Reveal>
        </div>

        {/* ── Related Products ─────────────────────────────────────────────── */}
        {relatedFiltered.length > 0 && (
          <section className="mt-20" aria-label={isAr ? "منتجات ذات صلة" : "Related products"}>
            <Reveal>
              <h2 className="text-xl font-bold text-gray-900] mb-6 tracking-tight">
                {isAr ? "منتجات ذات صلة" : "Related Products"}
              </h2>
            </Reveal>
            <StaggerGrid stagger={0.07} className="grid grid-cols-2 md:grid-cols-4 gap-[15px]">
              {relatedCards}
            </StaggerGrid>
          </section>
        )}

      </div>
    </main>
  );
}
