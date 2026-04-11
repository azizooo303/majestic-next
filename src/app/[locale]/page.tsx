import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { HeroBanner } from "@/components/hero/hero-banner";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import { InspireSection } from "@/components/common/inspire-section";
import { PageWrapper } from "@/components/common/page-wrapper";
import { GsapBatchReveal } from "@/components/common/gsap-batch-reveal";
import { FadeUp } from "@/components/common/fade-up";
import { PromoBanner } from "@/components/common/promo-banner";
import { ProductCard } from "@/components/shop/product-card";
import { JsonLd, LocalBusinessJsonLd, WebSiteJsonLd } from "@/components/common/json-ld";
import { siteUrl } from "@/lib/site-url";
import { SpaceTypology } from "@/components/sections/space-typology";
import { ProjectsReel } from "@/components/sections/projects-reel";
import { Collections } from "@/components/sections/collections";
import { CraftsmanshipBand } from "@/components/sections/craftsmanship-band";
import { ProjectScale } from "@/components/sections/project-scale";
import { BrandStandard } from "@/components/sections/brand-standard";
import { MaterialSelector } from "@/components/sections/material-selector";
import { InsightEditorial } from "@/components/sections/insight-editorial";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { SectionReveal } from "@/components/common/section-reveal";
import type { HeroSlide } from "@/components/hero/hero-banner";
import { getProducts, parsePrice, calcDiscount, PRODUCT_PLACEHOLDER } from "@/lib/woocommerce";
import { getSiteContent } from "@/lib/wp-settings";
import {
  client,
  SPACE_PANELS_QUERY,
  COLLECTION_CARDS_QUERY,
  CRAFTSMANSHIP_IMAGES_QUERY,
  PROJECT_CASE_STUDIES_QUERY,
  BRAND_PILLARS_QUERY,
  MATERIAL_FINISHES_QUERY,
  INSIGHT_CARDS_QUERY,
  SITE_STATS_QUERY,
} from "@/lib/sanity";
import type {
  SanitySpacePanel,
  SanityCollectionCard,
  SanityCraftsmanshipImage,
  SanityProjectCaseStudy,
  SanityBrandPillar,
  SanityMaterialFinish,
  SanityInsightCard,
  SanitySiteStat,
} from "@/lib/sanity";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "أثاث مكتبي في السعودية والخليج — ماجستيك" : "Office Furniture Saudi Arabia & Gulf — Majestic",
    description: isAr
      ? "أثاث مكتبي تنفيذي راقٍ للقطاعين الحكومي والخاص في المملكة العربية السعودية ودول الخليج. كراسي، طاولات، وأنظمة اجتماعات."
      : "Premium executive office furniture across Saudi Arabia and the Gulf. Chairs, workstations, and conference systems for corporate and government spaces.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://majestic-next.vercel.app"}/${locale}`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://majestic-next.vercel.app"}/en`,
        ar: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://majestic-next.vercel.app"}/ar`,
        "x-default": `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://majestic-next.vercel.app"}/en`,
      },
    },
    openGraph: {
      title: isAr ? "أثاث مكتبي في السعودية والخليج — ماجستيك" : "Office Furniture Saudi Arabia & Gulf — Majestic",
      description: isAr
        ? "أثاث مكتبي تنفيذي راقٍ للقطاعين الحكومي والخاص في المملكة العربية السعودية ودول الخليج."
        : "Premium executive office furniture across Saudi Arabia and the Gulf. Chairs, workstations, and conference systems for corporate and government spaces.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_SA",
      siteName: "Majestic Furniture",
    },
  };
}


const CATEGORIES = [
  { slug: "seating", key: "seating" as const, image: "/images/category-seating.png" },
  { slug: "tables", key: "tables" as const, image: "/images/category-tables.png" },
  { slug: "storage", key: "storage" as const, image: "/images/category-storage.png" },
  { slug: "workstations", key: "workstations" as const, image: "/images/category-workstations.png" },
  { slug: "acoustics", key: "acoustics" as const, image: "/images/category-acoustics.png" },
  { slug: "lounge", key: "lounge" as const, image: "/images/category-lounge.png" },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isAr = locale === "ar";

  const [
    wcProducts,
    siteContent,
    spacePanels,
    collectionCards,
    craftsmanshipImages,
    projectCaseStudies,
    brandPillars,
    materialFinishes,
    insightCards,
    siteStats,
  ] = await Promise.all([
    getProducts({ lang: locale, per_page: 8 }).catch(() => [] as Awaited<ReturnType<typeof getProducts>>),
    getSiteContent(),
    client.fetch<SanitySpacePanel[]>(SPACE_PANELS_QUERY).catch(() => [] as SanitySpacePanel[]),
    client.fetch<SanityCollectionCard[]>(COLLECTION_CARDS_QUERY).catch(() => [] as SanityCollectionCard[]),
    client.fetch<SanityCraftsmanshipImage[]>(CRAFTSMANSHIP_IMAGES_QUERY).catch(() => [] as SanityCraftsmanshipImage[]),
    client.fetch<SanityProjectCaseStudy[]>(PROJECT_CASE_STUDIES_QUERY).catch(() => [] as SanityProjectCaseStudy[]),
    client.fetch<SanityBrandPillar[]>(BRAND_PILLARS_QUERY).catch(() => [] as SanityBrandPillar[]),
    client.fetch<SanityMaterialFinish[]>(MATERIAL_FINISHES_QUERY).catch(() => [] as SanityMaterialFinish[]),
    client.fetch<SanityInsightCard[]>(INSIGHT_CARDS_QUERY).catch(() => [] as SanityInsightCard[]),
    client.fetch<SanitySiteStat[]>(SITE_STATS_QUERY).catch(() => [] as SanitySiteStat[]),
  ]);

  const heroSlides: HeroSlide[] = siteContent.heroSlides.map((s) => ({
    image: s.image,
    mobileImage: s.mobileImage,
    imageAr: s.imageAr,
    mobileImageAr: s.mobileImageAr,
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
      className="group relative flex flex-col overflow-hidden border border-[rgba(0,0,0,0.21)] hover:border-[rgba(0,0,0,0.38)] active:scale-[0.99] transition-all focus-visible:outline-2 focus-visible:outline-[#0c0c0c] focus-visible:outline-offset-2"
    >
      <div className="relative aspect-[3/4] bg-[#fafafa] overflow-hidden">
        <Image
          src={cat.image}
          alt={t(`categories.${cat.key}`)}
          fill
          loading="lazy"
          className="object-cover group-hover:scale-[1.05] transition-transform duration-300"
          sizes="(max-width: 768px) 33vw, 17vw"
        />
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
      <div className="py-3 text-center">
        <span className="text-[12px] font-semibold text-[#0c0c0c] uppercase tracking-[0.06em]">
          {t(`categories.${cat.key}`)}
        </span>
      </div>
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
    url: siteUrl(),
    logo: siteUrl("/images/majestic-logo-original.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Al Olaya District",
      addressLocality: "Riyadh",
      addressCountry: "SA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "a.alahmadi@majestic.com.sa",
    },
  };

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      <JsonLd data={organizationSchema} />
      <LocalBusinessJsonLd />
      <WebSiteJsonLd />
      {/* SR-only H1 for SEO — visible hero headline is inside HeroBanner */}
      <h1 className="sr-only">
        {isAr ? "أثاث مكتبي للقطاعين الحكومي والخاص — المملكة العربية السعودية"
              : "Premium Office Furniture for Corporate & Government — Saudi Arabia"}
      </h1>
      {/* Hero */}
      <SectionReveal direction="up" distance={50} duration={0.8}>
        <HeroBanner slides={heroSlides} />
      </SectionReveal>

      {/* Category Grid */}
      <SectionReveal direction="up" distance={40} duration={0.6}>
        <section className="w-full bg-white border-b border-[rgba(0,0,0,0.12)] pt-12">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
            <p className={`mb-6 uppercase text-[#484848] ${isAr ? "font-alyamama text-[14px] tracking-normal" : "text-[13px] tracking-[0.08em] font-bold"}`}>
              {isAr ? "تصفح حسب الفئة" : "Browse by Category"}
            </p>
            <GsapBatchReveal
              batchMax={6}
              stagger={0.06}
              yOffset={28}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[15px]"
            >
              {categoryItems}
            </GsapBatchReveal>
          </div>
        </section>
      </SectionReveal>

      {/* Featured Products */}
      <SectionReveal direction="fade-scale" duration={0.75}>
        <section className="bg-white py-20">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
            <FadeUp>
              <div className="flex items-baseline justify-between mb-10">
                <h2 className={`font-bold text-[#0c0c0c] ${isAr ? "font-alyamama text-[31px] md:text-[46px] leading-[1.1em] tracking-normal" : "text-[28px] md:text-[42px] leading-[1.05em] tracking-[-0.02em]"}`}>
                  {isAr ? "المنتجات المختارة" : "Featured Products"}
                </h2>
                <Link
                  href="/shop"
                  className="text-[13px] font-medium text-[#484848] hover:text-[#0c0c0c] border-b border-[#484848] hover:border-[#0c0c0c] pb-0.5 whitespace-nowrap"
                >
                  {isAr ? "عرض الكل" : t("common.viewAll")}
                </Link>
              </div>
            </FadeUp>

            <GsapBatchReveal
              batchMax={4}
              stagger={0.07}
              yOffset={36}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px]"
            >
              {productItems}
            </GsapBatchReveal>

            <div className="text-center mt-10">
              <Link
                href="/shop"
                className="inline-block bg-[#0c0c0c] text-white px-10 py-3.5 min-h-[48px] font-semibold
                  text-sm tracking-wide rounded-none hover:bg-[#333] transition-colors"
              >
                {isAr ? "استعرض جميع المنتجات" : "Browse the Catalog"}
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* New Sections — alternating directions for storytelling rhythm */}
      <SectionReveal direction="left" duration={0.8}>
        {siteContent.sections.spaceTypology && <SpaceTypology isAr={isAr} panels={spacePanels} />}
      </SectionReveal>
      <SectionReveal direction="up" duration={0.8}>
        <ProjectsReel isAr={isAr} stats={siteStats} />
      </SectionReveal>
      <SectionReveal direction="right" duration={0.8}>
        {siteContent.sections.collections && <Collections isAr={isAr} collections={collectionCards} />}
      </SectionReveal>
      <SectionReveal direction="up" duration={0.7}>
        {siteContent.sections.craftsmanshipBand && <CraftsmanshipBand isAr={isAr} images={craftsmanshipImages} />}
      </SectionReveal>
      <SectionReveal direction="left" duration={0.8}>
        {siteContent.sections.projectScale && <ProjectScale isAr={isAr} projects={projectCaseStudies} />}
      </SectionReveal>
      <SectionReveal direction="right" duration={0.8}>
        <BrandStandard isAr={isAr} pillars={brandPillars} />
      </SectionReveal>
      <SectionReveal direction="up" duration={0.7}>
        {siteContent.sections.materialSelector && <MaterialSelector isAr={isAr} finishes={materialFinishes} />}
      </SectionReveal>
      <SectionReveal direction="left" duration={0.8}>
        {siteContent.sections.insightEditorial && <InsightEditorial isAr={isAr} cards={insightCards} />}
      </SectionReveal>

      {/* Promotional Banner */}
      <SectionReveal direction="fade-scale" duration={0.7}>
        <PromoBanner
          isAr={isAr}
          headline={isAr ? "صُنع للعمل المؤسسي." : "Built for Institutional Scale."}
          body={isAr
            ? "وزارات. مقرات. مؤسسات. في المملكة ودول الخليج."
            : "Ministries. Headquarters. Institutions. Across Saudi Arabia and the Gulf."}
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
        <section className="border-t border-[rgba(0,0,0,0.08)] py-12 bg-white">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="text-xl font-semibold text-[#0c0c0c]">
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
      </FadeUp>
      {siteContent.sections.consultationCta && <ConsultationCta isAr={isAr} />}
    </PageWrapper>
  );
}
