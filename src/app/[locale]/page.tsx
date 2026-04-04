import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { HeroBanner } from "@/components/hero/hero-banner";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import { InspireSection } from "@/components/common/inspire-section";
import { PageWrapper } from "@/components/common/page-wrapper";
import { StaggerChildren } from "@/components/common/stagger-children";
import { FadeUp } from "@/components/common/fade-up";
import { PromoBanner } from "@/components/common/promo-banner";
import { ProductCard } from "@/components/shop/product-card";
import { JsonLd, LocalBusinessJsonLd, WebSiteJsonLd } from "@/components/common/json-ld";
import { SpaceTypology } from "@/components/sections/space-typology";
import { ProjectsReel } from "@/components/sections/projects-reel";
import { Collections } from "@/components/sections/collections";
import { CraftsmanshipBand } from "@/components/sections/craftsmanship-band";
import { ProjectScale } from "@/components/sections/project-scale";
import { BrandStandard } from "@/components/sections/brand-standard";
import { MaterialSelector } from "@/components/sections/material-selector";
import { InsightEditorial } from "@/components/sections/insight-editorial";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { ArchitecturalBackground } from "@/components/common/architectural-background";
import { SectionReveal } from "@/components/common/section-reveal";
import type { HeroSlide } from "@/components/hero/hero-banner";
import { getProducts, parsePrice, calcDiscount, PRODUCT_PLACEHOLDER } from "@/lib/woocommerce";
import { getSiteContent } from "@/lib/edge-config";

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
      canonical: `https://thedeskco.net/${locale}`,
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


const CDN = "https://thedeskco.net/wp-content/uploads/2026/03";

const CATEGORIES = [
  { slug: "seating", key: "seating" as const, image: `${CDN}/category-seating.png` },
  { slug: "tables", key: "tables" as const, image: `${CDN}/category-tables.png` },
  { slug: "storage", key: "storage" as const, image: `${CDN}/category-storage.png` },
  { slug: "workstations", key: "workstations" as const, image: `${CDN}/category-workstations.png` },
  { slug: "acoustics", key: "acoustics" as const, image: `${CDN}/category-acoustics.png` },
  { slug: "lounge", key: "lounge" as const, image: `${CDN}/category-lounge.png` },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isAr = locale === "ar";

  const [wcProducts, siteContent] = await Promise.all([
    getProducts({ lang: locale, per_page: 8 }).catch(() => [] as Awaited<ReturnType<typeof getProducts>>),
    getSiteContent(),
  ]);

  const heroSlides: HeroSlide[] = siteContent.heroSlides.map((s) => ({
    image: s.image,
    mobileImage: s.mobileImage,
    alt: isAr ? s.collection.ar : s.collection.en,
    collection: isAr ? s.collection.ar : s.collection.en,
    headline: isAr ? s.headline.ar : s.headline.en,
    tagline: isAr ? s.tagline.ar : s.tagline.en,
    cta: isAr ? s.cta.ar : s.cta.en,
    href: s.href,
    locale,
  }));

  const categoryItems = CATEGORIES.map((cat) => (
    <Link
      key={cat.slug}
      href={`/shop?category=${cat.slug}`}
      className="flex flex-col items-center gap-2 min-w-[72px] group"
    >
      <div className="w-16 h-16 bg-white border border-[rgba(0,0,0,0.12)] overflow-hidden rounded-sm">
        <Image
          src={cat.image}
          alt={t(`categories.${cat.key}`)}
          width={64}
          height={64}
          loading="lazy"
          className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-200"
        />
      </div>
      <span className="text-xs font-medium text-gray-900] text-center whitespace-nowrap group-hover:text-[#484848]">
        {t(`categories.${cat.key}`)}
      </span>
    </Link>
  ));

  const productItems = wcProducts.map((product) => {
    const price = parsePrice(product.price);
    const originalPrice = product.on_sale ? parsePrice(product.regular_price) : undefined;
    const discount = product.on_sale ? calcDiscount(product.regular_price, product.price) : undefined;
    const image = product.images[0]?.src || PRODUCT_PLACEHOLDER;
    const category = product.categories[0]?.name || "";
    return (
      <ProductCard
        key={product.id}
        id={product.id}
        name={product.name}
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
    <PageWrapper id="main-content" className="flex-1 bg-white relative z-10">
      <ArchitecturalBackground />
      <JsonLd data={organizationSchema} />
      <LocalBusinessJsonLd />
      <WebSiteJsonLd />
      {/* Hero */}
      <SectionReveal direction="up" distance={50} duration={0.8}>
        <HeroBanner slides={heroSlides} />
      </SectionReveal>

      {/* Category Navigation Strip */}
      <SectionReveal direction="up" distance={40} duration={0.6}>
        <section className="w-full bg-[rgba(255,255,255,0.88)] border-b border-[rgba(0,0,0,0.21)] py-6">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
            <StaggerChildren
              staggerDelay={0.05}
              className="flex overflow-x-auto gap-6 no-scrollbar justify-start md:justify-center"
            >
              {categoryItems}
            </StaggerChildren>
          </div>
        </section>
      </SectionReveal>

      {/* Featured Products */}
      <SectionReveal direction="fade-scale" duration={0.75}>
        <section className="bg-[rgba(255,255,255,0.88)] py-12 md:py-16">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
            <FadeUp>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900] tracking-tight">
                  {isAr ? "مختارات هذا الموسم" : "Selected for This Season"}
                </h2>
                <Link
                  href="/shop"
                  className="text-sm font-medium text-[#484848] hover:text-gray-900] border-b border-[#484848] pb-0.5"
                >
                  {isAr ? "عرض الكل" : t("common.viewAll")}
                </Link>
              </div>
            </FadeUp>

            <StaggerChildren
              staggerDelay={0.06}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px]"
            >
              {productItems}
            </StaggerChildren>

            <div className="text-center mt-10">
              <Link
                href="/shop"
                className="btn-press inline-block bg-white text-white px-10 py-3.5 font-semibold
                  text-sm tracking-wide rounded-sm hover:bg-[#333] transition-colors"
              >
                {isAr ? "تسوق جميع المنتجات" : "Shop All Products"}
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* New Sections — alternating directions for storytelling rhythm */}
      <SectionReveal direction="left" duration={0.8}>
        {siteContent.sections.spaceTypology && <SpaceTypology isAr={isAr} />}
      </SectionReveal>
      <SectionReveal direction="up" duration={0.8}>
        <ProjectsReel isAr={isAr} />
      </SectionReveal>
      <SectionReveal direction="right" duration={0.8}>
        {siteContent.sections.collections && <Collections isAr={isAr} />}
      </SectionReveal>
      <SectionReveal direction="up" duration={0.7}>
        {siteContent.sections.craftsmanshipBand && <CraftsmanshipBand isAr={isAr} />}
      </SectionReveal>
      <SectionReveal direction="left" duration={0.8}>
        {siteContent.sections.projectScale && <ProjectScale isAr={isAr} />}
      </SectionReveal>
      <SectionReveal direction="right" duration={0.8}>
        <BrandStandard isAr={isAr} />
      </SectionReveal>
      <SectionReveal direction="up" duration={0.7}>
        {siteContent.sections.materialSelector && <MaterialSelector isAr={isAr} />}
      </SectionReveal>
      <SectionReveal direction="left" duration={0.8}>
        {siteContent.sections.insightEditorial && <InsightEditorial isAr={isAr} />}
      </SectionReveal>

      {/* Promotional Banner */}
      <SectionReveal direction="fade-scale" duration={0.7}>
        <PromoBanner
          isAr={isAr}
          headline={isAr ? "توريد للقطاع الحكومي والمؤسسي — خدمة على مستوى المملكة" : "Corporate & Government Supply — Available Nationwide"}
          body={isAr
            ? "تورّد ماجستيك بيئات عمل متكاملة للمؤسسات في جميع أنحاء المملكة. اطلب استشارة للمشروع."
            : "Majestic supplies complete workspace environments to organizations across the Kingdom. Request a project consultation."}
          cta={isAr ? "طلب استشارة" : "Request a Consultation"}
          ctaHref="/about"
        />
      </SectionReveal>

      {/* Planning Ideas / Get Inspired */}
      <SectionReveal direction="right" duration={0.8}>
        <InspireSection isAr={isAr} />
      </SectionReveal>

      {/* Newsletter */}
      <FadeUp>
        <section className="border-t border-[rgba(0,0,0,0.08)] py-12 bg-[rgba(255,255,255,0.88)]">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="text-xl font-semibold text-gray-900]">
              {isAr ? "ابقَ على اطلاع" : "Stay Informed"}
            </h2>
            <p className="text-[#484848] text-sm mt-2">
              {isAr
                ? "تشكيلات جديدة، ومشاريع منجزة، ومقالات بيئة العمل — مباشرةً إلى بريدك."
                : "New collections, project stories, and workspace insights — delivered to your inbox."}
            </p>
            <NewsletterForm />
            {/* Social links */}
            <div className="flex justify-center gap-6 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#484848] hover:text-gray-900] text-sm transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#484848] hover:text-gray-900] text-sm transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#484848] hover:text-gray-900] text-sm transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </section>
      </FadeUp>
      {siteContent.sections.consultationCta && <ConsultationCta isAr={isAr} />}
    </PageWrapper>
  );
}
