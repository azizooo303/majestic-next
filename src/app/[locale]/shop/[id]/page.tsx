import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/common/reveal";
import { StaggerGrid } from "@/components/common/stagger-grid";
import { ProductCard } from "@/components/shop/product-card";
import { QuantitySelector } from "@/components/shop/quantity-selector";
import { JsonLd } from "@/components/common/json-ld";
import { ChevronRight, Truck, Clock, Wrench } from "lucide-react";
import type { Metadata } from "next";

// ── Mock data (mirrors shop/page.tsx) ─────────────────────────────────────────

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
    specs: {
      material: "Solid oak veneer with powder-coated steel frame",
      materialAr: "قشرة خشب البلوط الصلب مع هيكل فولاذي",
      dimensions: "180 × 90 × 75 cm",
      weightCapacity: "150 kg",
      warranty: "5 years",
      warrantyAr: "5 سنوات",
    },
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
    specs: {
      material: "Breathable mesh back with high-density foam seat",
      materialAr: "ظهر شبكي تنفسي مع مقعد إسفنجي عالي الكثافة",
      dimensions: "68 × 65 × 120 cm",
      weightCapacity: "130 kg",
      warranty: "3 years",
      warrantyAr: "3 سنوات",
    },
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
    specs: {
      material: "Melamine-faced MDF with aluminium trim",
      materialAr: "MDF مغطى بالميلامين مع إطار ألومنيوم",
      dimensions: "160 × 80 × 75 cm",
      weightCapacity: "120 kg",
      warranty: "3 years",
      warrantyAr: "3 سنوات",
    },
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
    specs: {
      material: "Tempered glass top with brushed steel base",
      materialAr: "سطح زجاج مقسى مع قاعدة فولاذية مصقولة",
      dimensions: "240 × 120 × 75 cm",
      weightCapacity: "200 kg",
      warranty: "5 years",
      warrantyAr: "5 سنوات",
    },
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
    specs: {
      material: "Recycled PET acoustic felt with aluminium frame",
      materialAr: "لباد بلاستيكي معاد تدويره مع إطار ألومنيوم",
      dimensions: "120 × 4 × 160 cm",
      weightCapacity: "N/A",
      warranty: "2 years",
      warrantyAr: "سنتان",
    },
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
    specs: {
      material: "Full-grain leather with solid walnut legs",
      materialAr: "جلد طبيعي بالكامل مع أرجل خشب الجوز",
      dimensions: "220 × 88 × 82 cm",
      weightCapacity: "300 kg",
      warranty: "5 years",
      warrantyAr: "5 سنوات",
    },
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
    specs: {
      material: "Bamboo desktop with height-adjustable steel frame",
      materialAr: "سطح من خشب البامبو مع هيكل فولاذي قابل للتعديل",
      dimensions: "140 × 70 × 72–118 cm",
      weightCapacity: "80 kg",
      warranty: "3 years",
      warrantyAr: "3 سنوات",
    },
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
    specs: {
      material: "Powder-coated cold-rolled steel",
      materialAr: "فولاذ مدلفن على البارد مطلي بالمسحوق",
      dimensions: "80 × 40 × 120 cm",
      weightCapacity: "60 kg per shelf",
      warranty: "2 years",
      warrantyAr: "سنتان",
    },
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
    specs: {
      material: "Engineered wood panels with fabric privacy screens",
      materialAr: "ألواح خشبية هندسية مع شاشات خصوصية قماشية",
      dimensions: "150 × 150 × 145 cm",
      weightCapacity: "100 kg",
      warranty: "3 years",
      warrantyAr: "3 سنوات",
    },
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
    specs: {
      material: "Woven nylon shell with foam cushioning",
      materialAr: "هيكل نايلون منسوج مع وسادة إسفنجية",
      dimensions: "62 × 60 × 110 cm",
      weightCapacity: "120 kg",
      warranty: "3 years",
      warrantyAr: "3 سنوات",
    },
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
    specs: {
      material: "Lacquered MDF with steel wall brackets",
      materialAr: "MDF مطلي بالورنيش مع براغي جدارية فولاذية",
      dimensions: "100 × 25 × 200 cm",
      weightCapacity: "40 kg per shelf",
      warranty: "2 years",
      warrantyAr: "سنتان",
    },
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
    specs: {
      material: "Circular MDF top with oak veneer finish and chrome base",
      materialAr: "سطح MDF دائري بتشطيب قشرة البلوط وقاعدة كروم",
      dimensions: "Ø 150 × 75 cm",
      weightCapacity: "180 kg",
      warranty: "5 years",
      warrantyAr: "5 سنوات",
    },
  },
] as const;

type MockProduct = (typeof MOCK_PRODUCTS)[number];

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const isAr = locale === "ar";
  const product = MOCK_PRODUCTS.find((p) => String(p.id) === id);
  if (!product) return { title: isAr ? "المنتج غير موجود" : "Product not found" };
  const productName = isAr ? product.nameAr : product.name;
  const material = isAr ? product.specs.materialAr : product.specs.material;
  return {
    title: isAr
      ? `${product.nameAr} — شراء بـ ${product.price.toLocaleString()} ريال | ماجيستيك`
      : `${product.name} — Buy for SAR ${product.price.toLocaleString()} | Majestic Furniture`,
    description: isAr
      ? `${product.nameAr} من ماجيستيك. ${material}. الأبعاد: ${product.specs.dimensions}. ضمان ${product.specs.warrantyAr}. توصيل وتركيب مجاني في الرياض.`
      : `${product.name} by Majestic Furniture. ${material}. Dimensions: ${product.specs.dimensions}. ${product.specs.warranty} warranty. Free delivery and assembly in Riyadh.`,
    alternates: {
      canonical: `https://thedeskco.net/en/shop/${id}`,
      languages: {
        en: `https://thedeskco.net/en/shop/${id}`,
        ar: `https://thedeskco.net/ar/shop/${id}`,
        "x-default": `https://thedeskco.net/en/shop/${id}`,
      },
    },
    openGraph: {
      title: isAr ? `${product.nameAr} | ماجيستيك` : `${product.name} | Majestic Furniture`,
      description: isAr
        ? `${product.nameAr} — ${material}`
        : `${product.name} — ${material}`,
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
      siteName: "Majestic Furniture",
      images: [{ url: product.image, width: 1200, height: 630, alt: productName }],
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

  const product = MOCK_PRODUCTS.find((p) => String(p.id) === id) as
    | MockProduct
    | undefined;

  if (!product) notFound();

  // Related products: up to 4 items from the same category, excluding current
  const related = MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4) as MockProduct[];

  // If fewer than 4, fill with other products
  const fillerNeeded = 4 - related.length;
  if (fillerNeeded > 0) {
    const filler = MOCK_PRODUCTS.filter(
      (p) => p.id !== product.id && p.category !== product.category
    ).slice(0, fillerNeeded) as MockProduct[];
    related.push(...filler);
  }

  const displayName = isAr ? product.nameAr : product.name;
  const displayCategory = isAr ? product.categoryAr : product.category;
  const displayMaterial = isAr ? product.specs.materialAr : product.specs.material;
  const displayWarranty = isAr ? product.specs.warrantyAr : product.specs.warranty;

  const relatedCards = related.map((p) => (
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: isAr ? product.nameAr : product.name,
    image: `https://thedeskco.net${product.image}`,
    description: isAr ? product.specs.materialAr : product.specs.material,
    sku: String(product.id),
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "SAR",
      price: String(product.price),
      availability: "https://schema.org/InStock",
      url: `https://thedeskco.net/${locale}/shop/${product.id}`,
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
          <Link href="/" className="hover:text-[#0c0c0c] transition-colors">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <ChevronRight
            size={12}
            className={isAr ? "rotate-180" : ""}
            aria-hidden="true"
          />
          <Link href="/shop" className="hover:text-[#0c0c0c] transition-colors">
            {isAr ? "المتجر" : "Shop"}
          </Link>
          <ChevronRight
            size={12}
            className={isAr ? "rotate-180" : ""}
            aria-hidden="true"
          />
          <span className="text-[#484848]">{displayCategory}</span>
          <ChevronRight
            size={12}
            className={isAr ? "rotate-180" : ""}
            aria-hidden="true"
          />
          <span className="text-[#0c0c0c] font-medium truncate max-w-[200px]">
            {displayName}
          </span>
        </nav>

        {/* ── Two-column layout ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-10 lg:gap-16 items-start">

          {/* ── LEFT: Image gallery ─────────────────────────────────────── */}
          <Reveal>
            <div className="space-y-3">
              {/* Main image */}
              <div className="relative aspect-[4/3] bg-[#fafafa] rounded-sm overflow-hidden border border-[rgba(0,0,0,0.08)]">
                <Image
                  src={product.image}
                  alt={displayName}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>

              {/* Thumbnails */}
              <div
                className="flex gap-2"
                role="list"
                aria-label={isAr ? "صور المنتج" : "Product images"}
              >
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    role="listitem"
                    className={`relative w-16 h-16 shrink-0 rounded-sm overflow-hidden
                      border-2 cursor-pointer bg-[#fafafa]
                      ${i === 0
                        ? "border-[#0c0c0c]"
                        : "border-transparent hover:border-[rgba(0,0,0,0.21)] transition-colors"
                      }`}
                    aria-current={i === 0 ? "true" : undefined}
                  >
                    <Image
                      src={product.image}
                      alt={`${displayName} ${isAr ? "صورة" : "view"} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── RIGHT: Product info ─────────────────────────────────────── */}
          <Reveal yIn={20}>
            <div className="space-y-5">

              {/* Brand badge */}
              <p className="text-xs uppercase tracking-widest text-[#484848]">
                {product.brand}
              </p>

              {/* Product name */}
              <h1 className="text-3xl font-bold text-[#0c0c0c] leading-tight">
                {displayName}
              </h1>

              {/* Price row */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl font-bold text-[#0c0c0c]">
                  SAR {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#484848] line-through">
                    SAR {product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.discount && (
                  <span className="text-xs font-bold bg-[#e53e3e] text-white px-2 py-0.5 rounded-sm">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-sm text-[#484848] leading-relaxed">
                {isAr
                  ? `${displayMaterial}. تم تصميم هذه القطعة لتوفير أقصى درجات الراحة والأناقة في بيئة العمل المهنية، مع الحفاظ على المتانة والجودة على المدى الطويل.`
                  : `Crafted from ${displayMaterial.toLowerCase()}. Designed to deliver maximum comfort and refined aesthetics in professional workspace environments, with long-term durability as a core design principle.`}
              </p>

              {/* Quantity + Add to Cart */}
              <div className="space-y-3">
                {/* Quantity selector */}
                <QuantitySelector isAr={isAr} />

                {/* Add to Cart */}
                <button
                  className="btn-press w-full bg-[#0c0c0c] text-white py-4 font-semibold
                    rounded-sm hover:bg-[#333] transition-colors cursor-pointer text-sm"
                  aria-label={isAr ? "أضف إلى السلة" : "Add to cart"}
                >
                  {isAr ? "أضف إلى السلة" : "Add to Cart"}
                </button>

                {/* Request a Quote */}
                <button
                  className="btn-press w-full border border-[#0c0c0c] text-[#0c0c0c] py-4
                    font-semibold rounded-sm hover:bg-[#fafafa] transition-colors cursor-pointer text-sm"
                  aria-label={isAr ? "طلب عرض سعر" : "Request a quote"}
                >
                  {isAr ? "طلب عرض سعر" : "Request a Quote"}
                </button>
              </div>

              {/* Divider */}
              <hr className="border-[rgba(0,0,0,0.08)]" />

              {/* Specs table */}
              <div>
                <h2 className="text-xs font-semibold text-[#0c0c0c] uppercase tracking-widest mb-3">
                  {isAr ? "المواصفات" : "Specifications"}
                </h2>
                <table className="w-full text-sm" aria-label={isAr ? "مواصفات المنتج" : "Product specifications"}>
                  <tbody>
                    {[
                      {
                        label: isAr ? "المادة" : "Material",
                        value: displayMaterial,
                      },
                      {
                        label: isAr ? "الأبعاد (ع × ع × ا)" : "Dimensions (W × D × H)",
                        value: product.specs.dimensions,
                      },
                      {
                        label: isAr ? "الحمولة القصوى" : "Weight Capacity",
                        value: product.specs.weightCapacity,
                      },
                      {
                        label: isAr ? "الضمان" : "Warranty",
                        value: displayWarranty,
                      },
                    ].map((row, i) => (
                      <tr
                        key={row.label}
                        className={i % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}
                      >
                        <td className="py-2 px-3 text-[#484848] w-2/5 font-medium">
                          {row.label}
                        </td>
                        <td className="py-2 px-3 text-[#0c0c0c]">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Divider */}
              <hr className="border-[rgba(0,0,0,0.08)]" />

              {/* Delivery info */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs text-[#484848]">
                  <Truck size={14} aria-hidden="true" className="shrink-0 text-[#0c0c0c]" />
                  <span>{isAr ? "توصيل مجاني فوق 500 ريال" : "Free delivery over SAR 500"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#484848]">
                  <Clock size={14} aria-hidden="true" className="shrink-0 text-[#0c0c0c]" />
                  <span>{isAr ? "5-7 أيام عمل" : "5–7 business days"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#484848]">
                  <Wrench size={14} aria-hidden="true" className="shrink-0 text-[#0c0c0c]" />
                  <span>{isAr ? "التركيب مشمول" : "Assembly included"}</span>
                </div>
              </div>

            </div>
          </Reveal>
        </div>

        {/* ── Related Products ─────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-20" aria-label={isAr ? "منتجات ذات صلة" : "Related products"}>
            <Reveal>
              <h2 className="text-xl font-bold text-[#0c0c0c] mb-6 tracking-tight">
                {isAr ? "منتجات ذات صلة" : "Related Products"}
              </h2>
            </Reveal>
            <StaggerGrid
              stagger={0.07}
              isRTL={isAr}
              className="grid grid-cols-2 md:grid-cols-4 gap-[15px]"
            >
              {relatedCards}
            </StaggerGrid>
          </section>
        )}

      </div>
    </main>
  );
}
