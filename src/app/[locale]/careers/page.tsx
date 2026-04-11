import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
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
      ? "وظائف — انضم إلى فريق ماجستيك للأثاث"
      : "Careers — Join the Majestic Furniture Team",
    description: isAr
      ? "انضم إلى فريق ماجستيك للأثاث المكتبي في الرياض. استعرض الوظائف المتاحة وقدّم طلبك للانضمام إلى شركة رائدة في قطاع الأثاث المكتبي بالمملكة العربية السعودية."
      : "Join the Majestic Furniture team in Riyadh. Browse open positions and apply to work with Saudi Arabia's leading premium office furniture company.",
    alternates: {
      canonical: siteUrl(`/${locale}/careers`),
      languages: {
        en: siteUrl("/en/careers"),
        ar: siteUrl("/ar/careers"),
        "x-default": siteUrl("/en/careers"),
      },
    },
    openGraph: {
      title: isAr ? "وظائف | ماجستيك" : "Careers | Majestic Furniture",
      description: isAr
        ? "انضم إلى فريق ماجستيك للأثاث المكتبي في الرياض."
        : "Join the Majestic Furniture team in Riyadh.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_SA",
      siteName: "Majestic Furniture",
    },
  };
}

const OPENINGS = (isAr: boolean) => [
  {
    title: isAr ? "مستشار مبيعات — أثاث مكتبي" : "Sales Consultant — Office Furniture",
    department: isAr ? "المبيعات" : "Sales",
    location: isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia",
    type: isAr ? "دوام كامل" : "Full-time",
  },
  {
    title: isAr ? "مصمم داخلي — مشاريع B2B" : "Interior Designer — B2B Projects",
    department: isAr ? "التصميم" : "Design",
    location: isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia",
    type: isAr ? "دوام كامل" : "Full-time",
  },
  {
    title: isAr ? "مدير مشروع — تركيب الأثاث" : "Project Manager — Furniture Installation",
    department: isAr ? "العمليات" : "Operations",
    location: isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia",
    type: isAr ? "دوام كامل" : "Full-time",
  },
];

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const openings = OPENINGS(isAr);

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
            {isAr ? "وظائف" : "Careers"}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2C2C2C]">
            {isAr ? "وظائف" : "Careers"}
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-4">
                {isAr ? "انضم إلى فريقنا" : "Join Our Team"}
              </h2>
              <p className="text-[#3A3A3A] leading-relaxed">
                {isAr
                  ? "ماجستيك تعمل عند تقاطع العمارة والمشتريات والتجهيز التجاري. نبحث عن مصممين ومديري مشاريع ومتخصصين في المبيعات يعملون بدقة ويفكرون بمنهجية."
                  : "Majestic operates at the intersection of architecture, procurement, and commercial fit-out. We look for designers, project managers, and sales professionals who work with precision and think in systems."}
              </p>
            </div>
          </Reveal>

          {/* Open positions */}
          <Reveal>
            <h2 className="text-lg font-bold text-[#2C2C2C] uppercase tracking-wide mb-6">
              {isAr ? "الوظائف المتاحة" : "Open Positions"}
            </h2>
          </Reveal>

          <div className="space-y-3">
            {openings.map((job) => (
              <Reveal key={job.title}>
                <div className="border border-[#D4D4D4] rounded-none p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-white transition-colors">
                  <div>
                    <h3 className="font-bold text-[#2C2C2C] text-base mb-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-[#3A3A3A]">
                      {job.department} · {job.location} · {job.type}
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="btn-press shrink-0 inline-block border border-[#2C2C2C] text-[#2C2C2C] px-5 py-2.5 text-sm font-semibold rounded-none hover:bg-[#F5F5F5] hover:text-[#2C2C2C] transition-colors whitespace-nowrap"
                  >
                    {isAr ? "تقديم الطلب" : "Apply Now"}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Speculative application */}
          <Reveal>
            <div className="mt-16 border border-[#D4D4D4] rounded-none p-10 text-center">
              <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">
                {isAr ? "لم تجد الوظيفة المناسبة؟" : "Don't see the right role?"}
              </h3>
              <p className="text-[#3A3A3A] text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                {isAr
                  ? "أرسل لنا سيرتك الذاتية وسنتواصل معك عند توفر فرصة تناسبك."
                  : "Send us your CV and we will reach out when a suitable opportunity arises."}
              </p>
              <Link
                href="/contact"
                className="btn-press inline-block bg-[#2C2C2C] text-white px-8 py-3 font-semibold text-sm tracking-wide rounded-none hover:bg-[#3A3A3A] transition-colors"
              >
                {isAr ? "تواصل معنا" : "Get in Touch"}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
