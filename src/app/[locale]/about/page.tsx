import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/common/reveal";
import { PageWrapper } from "@/components/common/page-wrapper";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "عن ماجيستيك — قصتنا وقيمنا" : "About Majestic — Our Story and Values",
    description: isAr
      ? "ماجستيك للأثاث تورّد بيئات عمل للعملاء المؤسسيين والحكوميين في المملكة. تعرّف على تشكيلاتنا ومنهجنا في تجهيز المساحات."
      : "Majestic Furniture supplies workspace environments to corporate and government clients across Saudi Arabia. Learn about our collections and approach.",
    alternates: {
      canonical: `https://thedeskco.net/${locale}/about`,
      languages: {
        en: "https://thedeskco.net/en/about",
        ar: "https://thedeskco.net/ar/about",
        "x-default": "https://thedeskco.net/en/about",
      },
    },
    openGraph: {
      title: isAr ? "عن ماجيستيك" : "About Majestic Furniture",
      description: isAr
        ? "علامة تجارية سعودية رائدة في أثاث المكاتب الراقي."
        : "Saudi Arabia's leading premium office furniture brand.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
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
      <section className="bg-[#fafafa] border-b border-[rgba(0,0,0,0.08)] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#484848] mb-3">
            <Link href="/" className="hover:text-[#0c0c0c] transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            {isAr ? "عن ماجيستيك" : "About"}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0c0c0c]">
            {isAr ? "عن ماجيستيك" : "About Majestic"}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${isAr ? "md:flex-row-reverse" : ""}`}>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0c0c0c] tracking-tight mb-6">
                  {isAr ? "قصتنا" : "Our Story"}
                </h2>
                <p className="text-[#484848] leading-relaxed mb-4">
                  {isAr
                    ? "تصمّم ماجستيك للأثاث وتورّد بيئات عمل احترافية في مختلف أنحاء المملكة العربية السعودية. تشمل تشكيلاتنا المكاتب التنفيذية، ومحطات العمل المشتركة، وأنظمة قاعات الاجتماعات، وصالات الاستقبال، والحلول الصوتية — تُنفَّذ وفق المواصفات وتُسلَّم بدقة."
                    : "Majestic Furniture designs and supplies professional workspace environments across Saudi Arabia. Our range spans executive offices, collaborative workstations, conference systems, lounge areas, and acoustic solutions — built to specification and delivered with precision."}
                </p>
                <p className="text-[#484848] leading-relaxed">
                  {isAr
                    ? "مهمتنا تزويد المؤسسات السعودية بأنظمة أثاث ترقى إلى مستوى طموحاتها. نستورد من شركات تصنيع دولية راسخة، ونقرن ذلك بخبرتنا المحلية في السوق، والاستشارة التصميمية، ودعم ما بعد البيع."
                    : "Our mission is to equip Saudi organizations with furniture systems that match the quality of their ambitions. We source from established international manufacturers and pair this with local market expertise, project consultation, and after-sales support."}
                </p>
              </div>
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                <Image
                  src="/images/hero-desks.jpg"
                  alt={isAr ? "معرض ماجيستيك" : "Majestic Showroom"}
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
      <section className="bg-[#fafafa] py-16 border-y border-[rgba(0,0,0,0.08)]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "168", label: isAr ? "168 منتجًا" : "168 Products" },
                { number: "6", label: isAr ? "6 فئات" : "6 Categories" },
                { number: isAr ? "المملكة والخليج" : "KSA + GCC", label: isAr ? "مقرنا المملكة، ونخدم دول الخليج" : "Saudi-based, GCC-ready" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl md:text-5xl font-extrabold text-[#0c0c0c] tracking-tight">
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
            <h2 className="text-2xl md:text-3xl font-bold text-[#0c0c0c] tracking-tight mb-10 text-center">
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
                  ? "من مكتب تنفيذي واحد إلى تجهيز مبنى مؤسسي متعدد الطوابق — أنظمتنا مصمَّمة لتنمو مع مؤسستك."
                  : "From a single executive office to a multi-floor corporate fit-out, our systems are designed to grow with your organization.",
              },
              {
                icon: "P",
                title: isAr ? "الشراكة" : "Partnership",
                desc: isAr
                  ? "نعمل جنبًا إلى جنب مع المعماريين وفرق الشراء ومديري المرافق — من المتطلبات الأولية حتى التركيب. علاقتنا لا تنتهي عند التسليم."
                  : "We work alongside architects, procurement teams, and facilities managers from brief to installation. The relationship does not end at delivery.",
              },
            ].map((value) => (
              <Reveal key={value.title}>
                <div className="border border-[rgba(0,0,0,0.21)] rounded-sm p-6">
                  <div className="w-10 h-10 border border-[rgba(0,0,0,0.21)] rounded-sm flex items-center justify-center text-sm font-bold text-[#0c0c0c] mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#0c0c0c] mb-3">{value.title}</h3>
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
              {isAr ? "تفضل بزيارتنا" : "Come See Us in Person"}
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              {isAr
                ? "معارضنا مفتوحة لاستقبالكم من الأحد إلى الخميس. فريقنا جاهز لمساعدتكم في إيجاد الحل المثالي لمساحتكم."
                : "Our showrooms are open Sunday through Thursday. Our team is ready to help you find the right solution for your space."}
            </p>
            <Link
              href="/showrooms"
              className="btn-press inline-block bg-white text-[#0c0c0c] px-10 py-3.5 font-semibold text-sm tracking-wide rounded-sm hover:bg-[#fafafa] transition-colors"
            >
              {isAr ? "تصفح معارضنا" : "Visit Our Showroom"}
            </Link>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
