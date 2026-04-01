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
      className="flex flex-col items-center gap-2 min-w-[72px] group"
    >
      <div className="w-16 h-16 bg-[#fafafa] border border-[rgba(0,0,0,0.12)] overflow-hidden rounded-sm">
        <Image
          src={cat.image}
          alt={t(`categories.${cat.key}`)}
          width={64}
          height={64}
          loading="lazy"
          className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-200"
        />
      </div>
      <span className="text-xs font-medium text-[#0c0c0c] text-center whitespace-nowrap group-hover:text-[#484848]">
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
    <PageWrapper id="main-content" className="flex-1 bg-white">
      <JsonLd data={organizationSchema} />
      {/* Hero */}
      <HeroBanner slide={heroSlide} />

      {/* Category Navigation Strip */}
      <section className="w-full bg-white border-b border-[rgba(0,0,0,0.21)] py-6">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
          <StaggerGrid
            stagger={0.07}
            isRTL={isAr}
            className="flex overflow-x-auto gap-6 no-scrollbar justify-start md:justify-center"
          >
            {categoryItems}
          </StaggerGrid>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0c0c0c] tracking-tight">
                {isAr ? "المنتجات المميزة" : "Featured Products"}
              </h2>
              <Link
                href="/shop"
                className="text-sm font-medium text-[#484848] hover:text-[#0c0c0c] border-b border-[#484848] pb-0.5"
              >
                {isAr ? "عرض الكل" : t("common.viewAll")}
              </Link>
            </div>
          </Reveal>

          <StaggerGrid
            stagger={0.08}
            isRTL={isAr}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px]"
          >
            {productItems}
          </StaggerGrid>

          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="btn-press inline-block bg-[#0c0c0c] text-white px-10 py-3.5 font-semibold
                text-sm tracking-wide rounded-sm hover:bg-[#333] transition-colors"
            >
              {isAr ? "تسوق جميع المنتجات" : "Shop All Products"}
            </Link>
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

      {/* Newsletter */}
      <Reveal>
        <section className="border-t border-[rgba(0,0,0,0.08)] py-12 bg-white">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="text-xl font-semibold text-[#0c0c0c]">
              {isAr ? "اشترك في النشرة الإخبارية" : "Sign Up to Newsletter"}
            </h2>
            <p className="text-[#484848] text-sm mt-2">
              {isAr
                ? "ابقَ على اطلاع بالمجموعات الجديدة"
                : "Stay updated with new collections and ideas"}
            </p>
            <NewsletterForm />
            {/* Social links */}
            <div className="flex justify-center gap-6 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#484848] hover:text-[#0c0c0c] text-sm transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#484848] hover:text-[#0c0c0c] text-sm transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#484848] hover:text-[#0c0c0c] text-sm transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </section>
      </Reveal>
    </PageWrapper>
  );
}
