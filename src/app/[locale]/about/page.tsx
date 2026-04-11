import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/common/reveal";
import { PageWrapper } from "@/components/common/page-wrapper";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import { client, ABOUT_PAGE_QUERY, urlFor } from "@/lib/sanity";
import type { SanityAboutPage } from "@/lib/sanity";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "عن ماجستيك — أثاث مكتبي في السعودية والخليج" : "About Majestic — Office Furniture Saudi Arabia & Gulf",
    description: isAr
      ? "ماجستيك تورد بيئات عمل احترافية للقطاعين الحكومي والخاص في المملكة ودول الخليج. دقة في التصنيع. ثقة مؤسسية."
      : "Majestic supplies professional workspace environments to corporate and government organizations across Saudi Arabia and the Gulf. Precision-built. Institutionally trusted.",
    alternates: {
      canonical: siteUrl(`/${locale}/about`),
      languages: {
        en: siteUrl("/en/about"),
        ar: siteUrl("/ar/about"),
        "x-default": siteUrl("/en/about"),
      },
    },
    openGraph: {
      title: isAr ? "عن ماجستيك — أثاث مكتبي في السعودية والخليج" : "About Majestic — Office Furniture Saudi Arabia & Gulf",
      description: isAr
        ? "ماجستيك تورد بيئات عمل احترافية للقطاعين الحكومي والخاص في المملكة ودول الخليج."
        : "Majestic supplies professional workspace environments to corporate and government organizations across Saudi Arabia and the Gulf.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_SA",
      siteName: "Majestic Furniture",
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const about: SanityAboutPage | null = await client
    .fetch<SanityAboutPage | null>(ABOUT_PAGE_QUERY)
    .catch(() => null);

  const heroTitle = isAr
    ? (about?.heroTitleAr ?? "بيئات عمل. تدوم.")
    : (about?.heroTitleEn ?? "Workspaces Built to Last.");

  const storyHeading = isAr
    ? (about?.storyHeadingAr ?? "أثاث مكتبي للمؤسسات الرائدة.")
    : (about?.storyHeadingEn ?? "Office Furniture for Organizations That Lead.");

  const storyBody = isAr
    ? (about?.storyBodyAr ?? "ماجستيك تورّد وتجهّز بيئات عمل احترافية في المملكة ودول الخليج.")
    : (about?.storyBodyEn ?? "Majestic designs and supplies professional workspace environments across Saudi Arabia and the Gulf.");

  const storySupporting = isAr
    ? (about?.storySupportingAr ?? "نستورد من شركات تصنيع دولية راسخة، ونقرن ذلك بخبرة محلية في السوق.")
    : (about?.storySupportingEn ?? "We source from established international manufacturers — paired with local market expertise, project consultation, and after-sales support.");

  const storyImageUrl = about?.storyImage
    ? urlFor(about.storyImage).width(800).height(600).url()
    : "/images/website/about-story.jpg";

  const stats = about?.stats ?? [
    { _key: "s1", value: "168", labelEn: "Products", labelAr: "منتجًا" },
    { _key: "s2", value: "6", labelEn: "Categories", labelAr: "فئات" },
    { _key: "s3", value: "3", labelEn: "Riyadh Showrooms", labelAr: "معارض في الرياض" },
    { _key: "s4", value: "KSA + GCC", labelEn: "Saudi-based, GCC-ready", labelAr: "مقرنا المملكة، ونخدم دول الخليج" },
  ];

  const values = about?.values ?? [
    { _key: "v1", icon: "P", titleEn: "Precision", titleAr: "الدقة", descriptionEn: "Every product in our catalog meets defined structural and finish standards. We do not compromise on tolerances, materials, or assembly quality.", descriptionAr: "كل منتج في كتالوجنا يستوفي معايير محددة للبنية والتشطيب. لا تنازل في المقاسات، أو المواد، أو جودة التجميع." },
    { _key: "v2", icon: "S", titleEn: "Scale", titleAr: "القدرة على التوسّع", descriptionEn: "From a single executive office to a multi-floor fit-out. Our systems are built to grow with your organization.", descriptionAr: "من مكتب واحد إلى مبنى كامل. الأنظمة تناسب كل نطاق." },
    { _key: "v3", icon: "T", titleEn: "Partnership", titleAr: "الشراكة", descriptionEn: "From brief to installation — we work alongside architects, procurement teams, and facilities managers. The relationship does not end at delivery.", descriptionAr: "من المتطلبات الأولية حتى التركيب — نعمل مع المهندسين وفرق المشتريات ومديري المرافق. العلاقة لا تنتهي عند التسليم." },
  ];

  const ctaHeading = isAr
    ? (about?.ctaHeadingAr ?? "تفضل بزيارة المعرض.")
    : (about?.ctaHeadingEn ?? "See the Showroom.");

  const ctaBody = isAr
    ? (about?.ctaBodyAr ?? "مفتوح من الأحد إلى الخميس. فريقنا في انتظارك.")
    : (about?.ctaBodyEn ?? "Open Sunday through Thursday. Our team is ready.");

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
            {isAr ? "عن ماجستيك" : "About"}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2C2C2C]">
            {heroTitle}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className={`flex flex-col md:flex-row gap-12 items-center ${isAr ? "md:flex-row-reverse" : ""}`}>
              <div className="md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-6">
                  {storyHeading}
                </h2>
                <p className="text-[#3A3A3A] leading-relaxed mb-4">{storyBody}</p>
                <p className="text-[#3A3A3A] leading-relaxed">{storySupporting}</p>
              </div>
              <div className="relative aspect-[4/3] rounded-none overflow-hidden md:w-1/2">
                <Image
                  src={storyImageUrl}
                  alt={isAr ? "استوديو تصميم ماجستيك" : "Majestic Design Studio"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16 border-y border-[#D4D4D4]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat._key}>
                  <p className="text-4xl md:text-5xl font-extrabold text-[#2C2C2C] tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#3A3A3A] mt-2 font-medium">
                    {isAr ? stat.labelAr : stat.labelEn}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-10 text-center">
              {isAr ? "قيمنا" : "Our Values"}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value) => (
              <Reveal key={value._key}>
                <div className="border border-[#D4D4D4] rounded-none p-6">
                  {value.icon && (
                    <div className="w-10 h-10 border border-[#D4D4D4] rounded-none flex items-center justify-center text-sm font-bold text-[#2C2C2C] mb-4">
                      {value.icon}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-[#2C2C2C] mb-3">
                    {isAr ? value.titleAr : value.titleEn}
                  </h3>
                  <p className="text-[#3A3A3A] leading-relaxed text-sm">
                    {isAr ? (value.descriptionAr ?? "") : (value.descriptionEn ?? "")}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-t border-[#D4D4D4] py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-4">
              {ctaHeading}
            </h2>
            <p className="text-[#3A3A3A] mb-8 max-w-lg mx-auto">{ctaBody}</p>
            <Link
              href="/showrooms"
              className="btn-press inline-block bg-[#2C2C2C] text-white px-10 py-3.5 font-semibold text-sm tracking-wide rounded-none hover:bg-[#3A3A3A] transition-colors"
            >
              {isAr ? "تصفح معارضنا" : "Visit Our Showroom"}
            </Link>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
