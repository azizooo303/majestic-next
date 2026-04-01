import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { HeroBanner } from "@/components/hero/hero-banner";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import { InspireSection } from "@/components/common/inspire-section";
import { PageWrapper } from "@/components/common/page-wrapper";
import { StaggerGrid } from "@/components/common/stagger-grid";
import { Reveal } from "@/components/common/reveal";
import { PromoBanner } from "@/components/common/promo-banner";
import { ProductCard } from "@/components/shop/product-card";
import { JsonLd } from "@/components/common/json-ld";
import type { HeroSlide } from "@/components/hero/hero-banner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "ماجيستيك للأثاث | أثاث مكتبي راقٍ في الرياض" : "Majestic Furniture | Premium Office Furniture in Riyadh",
    description: isAr
      ? "ماجيستيك — الوجهة الأولى للأثاث المكتبي الاحترافي في المملكة العربية السعودية. مكاتب تنفيذية، كراسي مريحة، ومحطات عمل لبيئات العمل الراقية."
      : "Majestic Furniture — Saudi Arabia's premier destination for professional office furniture. Executive desks, ergonomic chairs, and workstations for elevated workspace environments.",
    alternates: {
      canonical: `https://thedeskco.net/en`,
      languages: {
        en: "https://thedeskco.net/en",
        ar: "https://thedeskco.net/ar",
        "x-default": "https://thedeskco.net/en",
      },
    },
    openGraph: {
      title: isAr ? "ماجيستيك للأثاث | أثاث مكتبي راقٍ في الرياض" : "Majestic Furniture | Premium Office Furniture in Riyadh",
      description: isAr
        ? "ماجيستيك — الوجهة الأولى للأثاث المكتبي الاحترافي في المملكة العربية السعودية."
        : "Majestic Furniture — Saudi Arabia's premier destination for professional office furniture.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
      siteName: "Majestic Furniture",
    },
  };
}

// Mock products — staging has no WC products yet
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Enigma Executive Desk",
    category: "Executive Desks",
    brand: "Majestic",
    price: 2850,
    originalPrice: undefined as number | undefined,
    discount: undefined as number | undefined,
    image: "/images/wp-media/hero_office_desktop_en-1.png",
  },
  {
    id: 2,
    name: "ErgoMax Pro Chair",
    category: "Ergonomic Chairs",
    brand: "ChairLine",
    price: 1250,
    originalPrice: 1650 as number | undefined,
    discount: 24 as number | undefined,
    image: "/images/wp-media/hero_chairs_desktop_en-1.png",
  },
  {
    id: 3,
    name: "ModularFlex Workstation",
    category: "Workstations",
    brand: "Majestic",
    price: 3400,
    originalPrice: undefined as number | undefined,
    discount: undefined as number | undefined,
    image: "/images/wp-media/hero_cabinet_desktop_en-1.png",
  },
  {
    id: 4,
    name: "Conference Pro Table",
    category: "Meeting Tables",
    brand: "Majestic",
    price: 4200,
    originalPrice: undefined as number | undefined,
    discount: undefined as number | undefined,
    image: "/images/wp-media/hero_meeting_desktop_en-1.png",
  },
] as const;

const CATEGORIES = [
  { slug: "seating", key: "seating" as const, image: "/images/wp-media/category-seating.png" },
  { slug: "tables", key: "tables" as const, image: "/images/wp-media/category-tables.png" },
  { slug: "storage", key: "storage" as const, image: "/images/wp-media/category-storage.png" },
  { slug: "workstations", key: "workstations" as const, image: "/images/wp-media/category-workstations.png" },
  { slug: "acoustics", key: "acoustics" as const, image: "/images/wp-media/category-acoustics.png" },
  { slug: "lounge", key: "lounge" as const, image: "/images/wp-media/category-lounge.png" },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isAr = locale === "ar";

  const heroSlide: HeroSlide = {
    image: "/images/wp-media/hero_office_desktop_en-1.png",
    mobileImage: "/images/wp-media/hero_chairs_mobile_en-1.png",
    alt: isAr ? "مكاتب تنفيذية ماجيستيك" : "Majestic Executive Desks",
    collection: isAr ? "مجموعة المكاتب التنفيذية" : "Executive Desk Collection",
    headline: isAr
      ? "دقة في كل تفصيل\nأثاث مكتبي راقي"
      : "Precision in Every Cut\nPremium Office Furniture",
    tagline: isAr
      ? "مجموعة متكاملة من الأثاث المكتبي الاحترافي"
      : "Complete range of professional office furniture",
    cta: isAr ? "اكتشف المجموعة" : "Discover the collection",
    href: "/shop",
    locale,
  };

  const categoryItems = CATEGORIES.map((cat) => (
    <Link
      key={cat.slug}
      href={`/shop?category=${cat.slug}`}
      className="flex flex-col items-center gap-1 min-w-[64px] group"
      style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
    >
      {/* Win2K folder/icon style */}
      <div
        className="w-14 h-14 overflow-hidden relative"
        style={{
          background: '#ECE9D8',
          border: '1px solid #808080',
          boxShadow: 'inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #404040',
        }}
      >
        <Image
          src={cat.image}
          alt={t(`categories.${cat.key}`)}
          width={56}
          height={56}
          loading="lazy"
          className="object-cover w-full h-full"
        />
      </div>
      <span
        className="text-[10px] text-black text-center whitespace-nowrap group-hover:bg-[#0A246A] group-hover:text-white px-0.5"
        style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
      >
        {t(`categories.${cat.key}`)}
      </span>
    </Link>
  ));

  const productItems = MOCK_PRODUCTS.map((product) => (
    <ProductCard
      key={product.id}
      id={product.id}
      name={product.name}
      category={product.category}
      brand={product.brand}
      price={product.price}
      originalPrice={product.originalPrice}
      discount={product.discount}
      image={product.image}
      isAr={isAr}
    />
  ));

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Majestic Furniture",
    url: "https://thedeskco.net",
    logo: "https://thedeskco.net/images/majestic-logo-original.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Riyadh",
      addressCountry: "SA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@thedeskco.net",
    },
  };

  return (
    <PageWrapper id="main-content" className="flex-1 bg-[#D4D0C8]">
      <JsonLd data={organizationSchema} />
      {/* Hero */}
      <HeroBanner slide={heroSlide} />

      {/* Category Navigation Strip — Win2K Explorer toolbar */}
      <section className="w-full px-3 py-2 bg-[#D4D0C8]">
        <div
          className="mx-auto win2k-window"
          style={{ maxWidth: '1200px' }}
        >
          {/* Win2K title bar */}
          <div className="win2k-titlebar px-2 py-0.5 text-xs flex items-center gap-1">
            <span>&#128193;</span>
            <span>{isAr ? "استعراض الفئات" : "Browse Categories"}</span>
          </div>
          {/* Toolbar area */}
          <div
            className="px-3 py-2 bg-[#D4D0C8] overflow-x-auto no-scrollbar"
            style={{ borderTop: '1px solid #FFFFFF', borderBottom: '1px solid #808080' }}
          >
            <StaggerGrid
              stagger={0.07}
              isRTL={isAr}
              className="flex gap-2 justify-start md:justify-center"
            >
              {categoryItems}
            </StaggerGrid>
          </div>
          {/* Status bar */}
          <div className="win2k-statusbar px-2 py-0.5 text-xs text-black flex gap-2">
            <div className="win2k-raised px-2 py-0.5">
              {CATEGORIES.length} {isAr ? "فئات" : "Categories"}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products — Win2K explorer window */}
      <section className="px-3 py-2 bg-[#D4D0C8]">
        <div
          className="mx-auto win2k-window"
          style={{ maxWidth: '1200px' }}
        >
          {/* Title bar */}
          <div className="win2k-titlebar px-2 py-0.5 text-xs flex items-center gap-1">
            <span>&#128203;</span>
            <span>{isAr ? "المنتجات المميزة" : "Featured Products"}</span>
            <div className="flex-1" />
            <Link
              href="/shop"
              className="win2k-btn !min-w-0 !px-2 !py-0 text-[10px] no-underline text-black"
            >
              {isAr ? "عرض الكل" : t("common.viewAll")}
            </Link>
          </div>

          {/* Toolbar */}
          <div
            className="flex items-center gap-1 px-2 py-1 text-xs bg-[#D4D0C8]"
            style={{ borderBottom: '1px solid #808080', borderTop: '1px solid #FFFFFF' }}
          >
            <button className="win2k-btn !min-w-0 !px-2 !py-0.5 text-xs">&#8592; Back</button>
            <button className="win2k-btn !min-w-0 !px-2 !py-0.5 text-xs">Forward &#8594;</button>
            <div style={{ borderLeft: '1px solid #808080', borderRight: '1px solid #FFFFFF', height: '18px', width: '2px', margin: '0 4px' }} />
            <button className="win2k-btn !min-w-0 !px-2 !py-0.5 text-xs">&#9851; Refresh</button>
            <div className="flex-1" />
            <button className="win2k-btn !min-w-0 !px-2 !py-0.5 text-xs">&#9776; View</button>
          </div>

          {/* Products grid area — sunken panel */}
          <div
            className="m-2 p-3 bg-white"
            style={{
              border: '2px solid #808080',
              boxShadow: 'inset 1px 1px 0 #404040, inset -1px -1px 0 #FFFFFF',
            }}
          >
            <StaggerGrid
              stagger={0.08}
              isRTL={isAr}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {productItems}
            </StaggerGrid>
          </div>

          {/* Shop All button */}
          <div className="flex justify-center py-3">
            <Link
              href="/shop"
              className="win2k-btn-primary text-xs px-8 py-1.5 font-bold no-underline text-black inline-block text-center"
            >
              {isAr ? "تسوق جميع المنتجات" : "Shop All Products"}
            </Link>
          </div>

          {/* Status bar */}
          <div
            className="win2k-statusbar flex items-center gap-1 px-2 py-1"
            style={{ borderTop: '2px solid #FFFFFF' }}
          >
            <div className="win2k-raised px-2 py-0.5 text-xs">{MOCK_PRODUCTS.length} {isAr ? "عنصر" : "object(s)"}</div>
            <div className="win2k-raised px-2 py-0.5 text-xs flex-1">{isAr ? "مجموعة ماجيستيك" : "Majestic Collection"}</div>
            <div className="win2k-raised px-2 py-0.5 text-xs">&#127760; Online</div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <PromoBanner
        isAr={isAr}
        headline={isAr ? "مصمم للمحترفين" : "Designed for Professionals"}
        body={isAr
          ? "مجموعة متكاملة من الأثاث المكتبي الاحترافي المصمم لتعزيز الإنتاجية والأناقة في بيئة العمل."
          : "A complete range of professional office furniture engineered to enhance productivity and style in any workspace."}
        cta={isAr ? "اكتشف القصة" : t("common.learnMore")}
        ctaHref="/about"
      />

      {/* Planning Ideas / Get Inspired */}
      <InspireSection isAr={isAr} />

      {/* Newsletter — Win2K dialog */}
      <section className="px-3 py-2 bg-[#D4D0C8]">
        <div
          className="mx-auto win2k-window"
          style={{ maxWidth: '500px' }}
        >
          <div className="win2k-titlebar px-2 py-0.5 text-xs flex items-center gap-1">
            <span>&#128140;</span>
            <span>{isAr ? "اشترك في النشرة الإخبارية" : "Sign Up to Newsletter"}</span>
            <div className="flex-1" />
            <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px] font-bold">&#x2715;</button>
          </div>
          <div className="p-4 bg-[#D4D0C8]">
            <p className="text-xs text-black mb-3 leading-relaxed">
              {isAr
                ? "ابقَ على اطلاع بالمجموعات الجديدة والعروض الحصرية."
                : "Stay updated with new collections and exclusive offers."}
            </p>
            <NewsletterForm />
            <div
              className="flex justify-center gap-4 mt-4 pt-3"
              style={{ borderTop: '1px solid #808080' }}
            >
              {[
                { label: "Instagram", href: "https://instagram.com" },
                { label: "LinkedIn", href: "https://linkedin.com" },
                { label: "Facebook", href: "https://facebook.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[#0000FF] underline hover:text-[#800080]"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
