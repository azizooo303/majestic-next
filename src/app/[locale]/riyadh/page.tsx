import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/common/reveal";
import { PageWrapper } from "@/components/common/page-wrapper";
import { SpaceTypology } from "@/components/sections/space-typology";
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
      ? "أثاث مكتبي الرياض — ماجيستيك للأثاث المكتبي"
      : "Office Furniture Riyadh — Majestic Furniture",
    description: isAr
      ? "ماجيستيك توفر وتركب بيئات أثاث مكتبي متكاملة في الرياض — من المكاتب التنفيذية إلى تجهيز الطوابق المؤسسية الكاملة."
      : "Majestic supplies and installs complete office furniture environments in Riyadh — from single executive offices to full-floor corporate fit-outs.",
    alternates: {
      canonical: `https://thedeskco.net/${locale}/riyadh`,
      languages: {
        en: "https://thedeskco.net/en/riyadh",
        ar: "https://thedeskco.net/ar/riyadh",
        "ar-SA": "https://thedeskco.net/ar/riyadh",
      },
    },
  };
}

export default async function RiyadhPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const stats = isAr
    ? [
        { value: "320", label: "محطة عمل" },
        { value: "14", label: "مشروعًا منجزًا" },
        { value: "100%", label: "تركيب وتسليم ماجيستيك الكامل" },
      ]
    : [
        { value: "320", label: "Workstations" },
        { value: "14", label: "Projects Delivered" },
        { value: "100%", label: "Installed by Majestic" },
      ];

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      {/* Hero band */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-[#aaaaaa] mb-4">
              {isAr ? "ماجيستيك للأثاث المكتبي — الرياض" : "Majestic Furniture — Riyadh"}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-3xl">
              {isAr
                ? "تجهيزات مكتبية لمعيار الرياض المؤسسي"
                : "Office Furniture for Riyadh's Corporate Standard"}
            </h1>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl">
              {isAr
                ? "نوفّر بيئات عمل متكاملة للحي المالي والمنطقة الحكومية ومراكز الأعمال في الرياض."
                : "Supplying complete workspace environments to Riyadh's financial district, government quarter, and business hubs."}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Intro paragraph */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-widest text-[#484848] mb-4">
                {isAr ? "نطاق الخدمة" : "Scope of Service"}
              </p>
              <p className="text-[#484848] text-base md:text-lg leading-relaxed">
                {isAr
                  ? "ماجيستيك توفر وتركب بيئات أثاث مكتبي متكاملة في الرياض — من المكاتب التنفيذية إلى تجهيز الطوابق المؤسسية الكاملة. نعمل مع الشركات والجهات الحكومية والمقرات الإقليمية في مختلف أحياء الرياض، ونضمن تسليمًا كاملًا وفق المواصفات."
                  : "Majestic supplies and installs complete office furniture environments in Riyadh — from single executive offices to full-floor corporate fit-outs. We work with corporations, government entities, and regional headquarters across all districts of Riyadh, delivering to specification on every project."}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-[rgba(0,0,0,0.08)] py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="border-t-2 border-[#0c0c0c] pt-6">
                  <p className="text-4xl md:text-5xl font-extrabold text-[#0c0c0c] tracking-tight mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#484848] font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Space typology grid */}
      <SpaceTypology isAr={isAr} />

      {/* CTA band */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className={`flex flex-col md:flex-row items-center justify-between gap-8 ${isAr ? "md:flex-row-reverse" : ""}`}>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                  {isAr ? "ابدأ مشروعك في الرياض" : "Start Your Riyadh Project"}
                </h2>
                <p className="text-white/60 text-sm max-w-md">
                  {isAr
                    ? "فريق ماجيستيك يتولى التخطيط والتوريد والتركيب من أول يوم حتى التسليم."
                    : "Majestic handles planning, supply, and installation from brief to handover."}
                </p>
              </div>
              <div className={`flex flex-col sm:flex-row gap-4 ${isAr ? "sm:flex-row-reverse" : ""}`}>
                <Link
                  href="/about"
                  className="btn-press inline-block bg-white text-[#0c0c0c] px-8 py-3.5 font-semibold text-sm tracking-wide rounded-sm hover:bg-white transition-colors text-center"
                >
                  {isAr ? "احجز استشارة" : "Book a Consultation"}
                </Link>
                <Link
                  href="/about"
                  className="btn-press inline-block bg-transparent border border-white text-white px-8 py-3.5 font-semibold text-sm tracking-wide rounded-sm hover:bg-white/10 transition-colors text-center"
                >
                  {isAr ? "زيارة المعرض" : "Visit the Showroom"}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
