import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/common/reveal";
import { PageWrapper } from "@/components/common/page-wrapper";
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

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-[rgba(0,0,0,0.08)] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#484848] mb-3">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            {isAr ? "عن ماجستيك" : "About"}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            {isAr ? "بيئات عمل. تدوم." : "Workspaces Built to Last."}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${isAr ? "md:flex-row-reverse" : ""}`}>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6">
                  {isAr ? "أثاث مكتبي للمؤسسات الرائدة." : "Office Furniture for Organizations That Lead."}
                </h2>
                <p className="text-[#484848] leading-relaxed mb-4">
                  {isAr
                    ? "ماجستيك تورّد وتجهّز بيئات عمل احترافية في المملكة ودول الخليج. مكاتب تنفيذية، محطات عمل، أنظمة اجتماعات، وصالات استقبال — بُنيت وفق معايير العمارة الحديثة وسُلِّمت بدقة."
                    : "Majestic designs and supplies professional workspace environments across Saudi Arabia and the Gulf. Executive offices, workstations, conference systems, lounge areas — built to modern architectural standards and delivered with precision."}
                </p>
                <p className="text-[#484848] leading-relaxed">
                  {isAr
                    ? "نستورد من شركات تصنيع دولية راسخة، ونقرن ذلك بخبرة محلية في السوق، واستشارة تصميمية، ودعم ما بعد البيع."
                    : "We source from established international manufacturers — paired with local market expertise, project consultation, and after-sales support."}
                </p>
              </div>
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                <Image
                  src="/images/website/about-story.jpg"
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
      <section className="bg-white py-16 border-y border-[rgba(0,0,0,0.08)]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "168", label: isAr ? "منتجًا" : "Products" },
                { number: "6", label: isAr ? "فئات" : "Categories" },
                { number: "3", label: isAr ? "معارض في الرياض" : "Riyadh Showrooms" },
                { number: isAr ? "المملكة والخليج" : "KSA + GCC", label: isAr ? "مقرنا المملكة، ونخدم دول الخليج" : "Saudi-based, GCC-ready" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                    {stat.number}
                  </p>
                  <p className="text-sm text-[#484848] mt-2 font-medium">{stat.label}</p>
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-10 text-center">
              {isAr ? "قيمنا" : "Our Values"}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "P",
                title: isAr ? "الدقة" : "Precision",
                desc: isAr
                  ? "كل منتج في كتالوجنا يستوفي معايير محددة للبنية والتشطيب. لا تنازل في المقاسات، أو المواد، أو جودة التجميع."
                  : "Every product in our catalog meets defined structural and finish standards. We do not compromise on tolerances, materials, or assembly quality.",
              },
              {
                icon: "S",
                title: isAr ? "القدرة على التوسّع" : "Scale",
                desc: isAr
                  ? "من مكتب واحد إلى مبنى كامل. الأنظمة تناسب كل نطاق."
                  : "From a single executive office to a multi-floor fit-out. Our systems are built to grow with your organization.",
              },
              {
                icon: "T",
                title: isAr ? "الشراكة" : "Partnership",
                desc: isAr
                  ? "من المتطلبات الأولية حتى التركيب — نعمل مع المهندسين وفرق المشتريات ومديري المرافق. العلاقة لا تنتهي عند التسليم."
                  : "From brief to installation — we work alongside architects, procurement teams, and facilities managers. The relationship does not end at delivery.",
              },
            ].map((value) => (
              <Reveal key={value.title}>
                <div className="border border-[rgba(0,0,0,0.21)] rounded-sm p-6">
                  <div className="w-10 h-10 border border-[rgba(0,0,0,0.21)] rounded-sm flex items-center justify-center text-sm font-bold text-gray-900 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-[#484848] leading-relaxed text-sm">{value.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0c0c0c] py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
              {isAr ? "تفضل بزيارة المعرض." : "See the Showroom."}
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              {isAr
                ? "مفتوح من الأحد إلى الخميس. فريقنا في انتظارك."
                : "Open Sunday through Thursday. Our team is ready."}
            </p>
            <Link
              href="/showrooms"
              className="btn-press inline-block bg-white text-gray-900 px-10 py-3.5 font-semibold text-sm tracking-wide rounded-sm hover:bg-white transition-colors"
            >
              {isAr ? "تصفح معارضنا" : "Visit Our Showroom"}
            </Link>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
