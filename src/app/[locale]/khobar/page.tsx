import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/common/reveal";
import { PageWrapper } from "@/components/common/page-wrapper";
import { SpaceTypology } from "@/components/sections/space-typology";
import { BreadcrumbListJsonLd } from "@/components/common/json-ld";
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
    title: isAr
      ? "أثاث مكتبي الخبر — ماجستيك"
      : "Office Furniture Khobar — Majestic",
    description: isAr
      ? "أثاث مكتبي الخبر والمنطقة الشرقية — كراسي تنفيذية، محطات عمل، طاولات اجتماعات. توريد مباشر للشركات والمؤسسات الحكومية."
      : "Executive office furniture supplied directly to organizations in Khobar. Chairs, workstations, conference systems — delivered to specification.",
    alternates: {
      canonical: siteUrl(`/${locale}/khobar`),
      languages: {
        en: siteUrl("/en/khobar"),
        ar: siteUrl("/ar/khobar"),
        "x-default": siteUrl("/en/khobar"),
      },
    },
  };
}

export default async function KhobarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const stats = isAr
    ? [
        { value: "—", label: "المنطقة الشرقية" },
        { value: "—", label: "شركات وحكومات" },
        { value: "—", label: "مواصفات كاملة" },
      ]
    : [
        { value: "—", label: "Eastern Province" },
        { value: "—", label: "Corporate & Government" },
        { value: "—", label: "Full Specification" },
      ];

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      <BreadcrumbListJsonLd items={[
        { name: isAr ? "الرئيسية" : "Home", item: siteUrl(`/${locale}/`) },
        { name: isAr ? "الخبر" : "Khobar", item: siteUrl(`/${locale}/khobar`) },
      ]} />
      {/* Hero band */}
      <section className="bg-white border-b border-[#D4D4D4] py-20 md:py-28">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-[#3A3A3A] mb-4">
              {isAr ? "ماجستيك للأثاث المكتبي — الخبر" : "Majestic Furniture — Al Khobar"}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2C2C2C] mb-6 max-w-3xl">
              {isAr ? "أثاث مكتبي. الخبر." : "Office Furniture. Khobar."}
            </h1>
            <p className="text-[#3A3A3A] text-base md:text-lg leading-relaxed max-w-2xl">
              {isAr
                ? "أثاث مكتبي تنفيذي موّرد مباشرة للمؤسسات في الخبر. كراسي، محطات عمل، وأنظمة اجتماعات — وفق المواصفات."
                : "Executive office furniture supplied directly to organizations in Khobar. Chairs, workstations, conference systems — delivered to specification."}
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
                  ? "توريد وتركيب أثاث مكتبي في الخبر — لمكاتب الشركات والمعارض ومجمعات الأعمال في المنطقة الشرقية. نقدّم حلولًا شاملة تغطي المكاتب التنفيذية وأماكن العمل المفتوحة وقاعات الاجتماعات وفق مواصفات دقيقة."
                  : "Office furniture supply and installation in Al Khobar — serving corporate offices, showrooms, and multi-tenant business parks in the Eastern Province. We provide comprehensive solutions covering executive offices, open workspaces, and meeting rooms delivered to precise specifications."}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats — hidden until real data is available */}
      {false && (
      <section className="bg-white border-y border-[rgba(0,0,0,0.08)] py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="border-t-2 border-[#2C2C2C] pt-6">
                  <p className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      )}

      {/* Space typology grid */}
      <SpaceTypology isAr={isAr} />

      {/* CTA band */}
      <section className="bg-[#F5F5F5] py-16 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className={`flex flex-col md:flex-row items-center justify-between gap-8 ${isAr ? "md:flex-row-reverse" : ""}`}>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-3">
                  {isAr ? "ابدأ مشروعك في الخبر" : "Start Your Al Khobar Project"}
                </h2>
                <p className="text-[#3A3A3A] text-sm max-w-md">
                  {isAr
                    ? "فريق ماجستيك يتولى التخطيط والتوريد والتركيب من أول يوم حتى التسليم."
                    : "Majestic handles planning, supply, and installation from brief to handover."}
                </p>
              </div>
              <div className={`flex flex-col sm:flex-row gap-4 ${isAr ? "sm:flex-row-reverse" : ""}`}>
                <Link
                  href="/contact"
                  className="btn-press inline-block bg-[#2C2C2C] text-white px-8 py-3.5 font-semibold text-sm tracking-wide rounded-none hover:bg-[#3A3A3A] transition-colors text-center"
                >
                  {isAr ? "احجز استشارة" : "Book a Consultation"}
                </Link>
                <Link
                  href="/showrooms"
                  className="btn-press inline-block bg-white border border-[#2C2C2C] text-[#2C2C2C] px-8 py-3.5 font-semibold text-sm tracking-wide rounded-none hover:bg-[#F5F5F5] transition-colors text-center"
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
