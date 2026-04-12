import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { StaggerGrid } from "@/components/common/stagger-grid";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "العلامات التجارية للأثاث المكتبي | ماجستيك" : "Office Furniture Brands | Majestic",
    description: isAr
      ? "اكتشف مجموعة ماجستيك من أفضل العلامات التجارية العالمية للأثاث المكتبي. نوفر أكثر من 50 علامة تجارية مختارة بعناية لتلبية أعلى معايير الجودة."
      : "Discover Majestic's curated selection of the world's leading office furniture brands. Over 50 premium labels chosen to meet the highest quality standards.",
    alternates: {
      canonical: siteUrl(`/${locale}/brands`),
      languages: {
        en: siteUrl("/en/brands"),
        ar: siteUrl("/ar/brands"),
        "x-default": siteUrl("/en/brands"),
      },
    },
    openGraph: {
      title: isAr ? "علاماتنا التجارية | ماجستيك" : "Our Brands | Majestic Furniture",
      description: isAr
        ? "أفضل العلامات التجارية العالمية للأثاث المكتبي."
        : "The world's leading office furniture brands, available at Majestic.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_SA",
      siteName: "Majestic Furniture",
    },
  };
}

const BRANDS = [
  "Majestic",
  "Interstuhl",
  "Haworth",
  "Kinnarps",
  "Vitra",
  "Herman Miller",
  "Steelcase",
  "Narbutas",
  "Nurus",
  "Forma 5",
  "Sitag",
  "Profim",
];

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const brandItems = BRANDS.map((brand) => (
    <div
      key={brand}
      className="border border-[rgba(0,0,0,0.21)] rounded-none p-8 flex items-center justify-center hover:bg-white transition-colors cursor-default min-h-[100px]"
    >
      <span className="font-bold text-[#2C2C2C] text-sm md:text-base text-center leading-snug">
        {brand}
      </span>
    </div>
  ));

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-[#D4D4D4] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#3A3A3A] mb-3">
            <Link href="/" className="hover:text-[#2C2C2C] transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            {isAr ? "علاماتنا التجارية" : "Brands"}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2C2C2C]">
            {isAr ? "علاماتنا التجارية" : "Our Brands"}
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-4">
                {isAr ? "شركاء عالميون، معايير استثنائية" : "Global Partners, Exceptional Standards"}
              </h2>
              <p className="text-[#3A3A3A] leading-relaxed">
                {isAr
                  ? "نحمل أرقى العلامات التجارية للأثاث المكتبي من حول العالم. كل علامة تجارية في محفظتنا اجتازت معايير صارمة للجودة والتصميم والاستدامة، لنضمن لعملائنا خياراتٍ تليق بمعايير الأعمال الاحترافية."
                  : "We carry the finest office furniture brands from around the world. Every brand in our portfolio has met our strict criteria for quality, design, and sustainability — ensuring our clients have access to choices that meet the highest professional standards."}
              </p>
            </div>
          </Reveal>

          {/* Brand grid */}
          <StaggerGrid
            stagger={0.05}
            isRTL={isAr}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {brandItems}
          </StaggerGrid>
        </div>
      </section>

      {/* B2B CTA */}
      <section className="bg-white border-t border-[#D4D4D4] py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-4">
                  {isAr ? "هل أنت مشترٍ بالجملة؟" : "Are you a wholesale buyer?"}
                </h2>
                <p className="text-[#3A3A3A] leading-relaxed text-sm">
                  {isAr
                    ? "نوفر شروطاً خاصة للشركات والمؤسسات التي تبحث عن حلول متكاملة. تواصل مع فريق المبيعات B2B لدينا للحصول على عرض سعر."
                    : "We offer special terms for companies and organizations seeking comprehensive solutions. Contact our B2B sales team to receive a tailored quote."}
                </p>
              </div>
              <div className={`flex ${isAr ? "md:justify-start" : "md:justify-end"}`}>
                <Link
                  href="/contact"
                  className="btn-press inline-block bg-[#2C2C2C] text-white px-10 py-3.5 font-semibold text-sm tracking-wide rounded-none hover:bg-[#3A3A3A] transition-colors"
                >
                  {isAr ? "طلب عرض سعر" : "Request a Quote"}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
