import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/common/reveal";
import { PageWrapper } from "@/components/common/page-wrapper";
import { SpaceTypology } from "@/components/sections/space-typology";
import { BreadcrumbListJsonLd } from "@/components/common/json-ld";
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
    title: isAr
      ? "أثاث مكتبي جدة — ماجستيك"
      : "Office Furniture Jeddah — Majestic",
    description: isAr
      ? "أثاث مكتبي جدة — مكاتب تنفيذية، محطات عمل، وأنظمة اجتماعات للمؤسسات في المنطقة الغربية. توريد وتركيب احترافي."
      : "Professional workspace environments for organizations in Jeddah. Executive offices, workstations, and conference systems — delivered with precision.",
    alternates: {
      canonical: siteUrl(`/${locale}/jeddah`),
      languages: {
        en: siteUrl("/en/jeddah"),
        ar: siteUrl("/ar/jeddah"),
        "x-default": siteUrl("/en/jeddah"),
      },
    },
  };
}

export default async function JeddahPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const stats = isAr
    ? [
        { value: "8", label: "مشاريع" },
        { value: "—", label: "تجهيز طوابق متكاملة" },
        { value: "GCC", label: "توريد لدول الخليج" },
      ]
    : [
        { value: "8", label: "Projects" },
        { value: "—", label: "Full Floor Fit-Outs" },
        { value: "GCC", label: "Delivery Capable" },
      ];

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      <BreadcrumbListJsonLd items={[
        { name: isAr ? "الرئيسية" : "Home", item: siteUrl(`/${locale}/`) },
        { name: isAr ? "جدة" : "Jeddah", item: siteUrl(`/${locale}/jeddah`) },
      ]} />
      {/* Hero band */}
      <section className="bg-[#0c0c0c] py-20 md:py-28">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-[#aaaaaa] mb-4">
              {isAr ? "ماجستيك للأثاث المكتبي — جدة" : "Majestic Furniture — Jeddah"}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-3xl">
              {isAr ? "أثاث مكتبي. جدة." : "Office Furniture. Jeddah."}
            </h1>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl">
              {isAr
                ? "بيئات عمل احترافية للمؤسسات في جدة. مكاتب تنفيذية، محطات عمل، وأنظمة اجتماعات — تُسلَّم بدقة."
                : "Professional workspace environments for organizations in Jeddah. Executive offices, workstations, and conference systems — delivered with precision."}
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
                  ? "توريد وتركيب أثاث مكتبي في جدة — مكاتب تنفيذية وأرضيات عمل مفتوحة ومناطق استقبال للمؤسسات في المنطقة الغربية. نخدم الشركات من مختلف القطاعات ونضمن تنفيذًا دقيقًا وفق المتطلبات."
                  : "Office furniture supply and installation in Jeddah — executive offices, open workfloors, and reception environments for organisations across the Western Region. We serve companies across all sectors and deliver precisely to requirement."}
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
                  <p className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
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
      <section className="bg-[#0c0c0c] py-16 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className={`flex flex-col md:flex-row items-center justify-between gap-8 ${isAr ? "md:flex-row-reverse" : ""}`}>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                  {isAr ? "ابدأ مشروعك في جدة" : "Start Your Jeddah Project"}
                </h2>
                <p className="text-white/60 text-sm max-w-md">
                  {isAr
                    ? "فريق ماجستيك يتولى التخطيط والتوريد والتركيب من أول يوم حتى التسليم."
                    : "Majestic handles planning, supply, and installation from brief to handover."}
                </p>
              </div>
              <div className={`flex flex-col sm:flex-row gap-4 ${isAr ? "sm:flex-row-reverse" : ""}`}>
                <Link
                  href="/contact"
                  className="btn-press inline-block bg-white text-[#0c0c0c] px-8 py-3.5 font-semibold text-sm tracking-wide rounded-sm hover:bg-gray-100 transition-colors text-center"
                >
                  {isAr ? "احجز استشارة" : "Book a Consultation"}
                </Link>
                <Link
                  href="/showrooms"
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
