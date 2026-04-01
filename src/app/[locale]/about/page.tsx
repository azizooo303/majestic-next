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
      ? "ماجيستيك علامة تجارية سعودية رائدة في أثاث المكاتب الراقي. أكثر من 15 عاماً من الخبرة، 500+ مشروع منجز، و3 معارض في الرياض."
      : "Majestic is Saudi Arabia's leading premium office furniture brand. Over 15 years of experience, 500+ completed projects, and 3 showrooms in Riyadh.",
    alternates: {
      canonical: `https://thedeskco.net/en/about`,
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
                    ? "ماجيستيك علامة تجارية سعودية رائدة في مجال أثاث المكاتب الراقي، تأسست بهدف رفع معايير بيئات العمل في المملكة العربية السعودية والمنطقة. انطلقنا من قناعة راسخة بأن الفضاء المصمم بعناية يعكس قيم المؤسسة ويُعزز إنتاجية الفريق."
                    : "Majestic is a premium Saudi office furniture brand, founded to raise the standard of workspace environments across Saudi Arabia and the wider region. We started from a firm belief that a thoughtfully designed space reflects an organization's values and amplifies team productivity."}
                </p>
                <p className="text-[#484848] leading-relaxed">
                  {isAr
                    ? "نعمل مع أبرز العلامات التجارية العالمية لنوفر حلولاً متكاملة للأثاث المكتبي تخدم الشركات والمؤسسات الحكومية وقطاع الضيافة. كل مشروع نُنجزه هو شراكة حقيقية تبدأ بفهم احتياجات العميل وتنتهي بفضاء يليق بطموحاته."
                    : "We collaborate with the world's finest furniture brands to deliver complete workspace solutions for corporations, government entities, and the hospitality sector. Every project we deliver is a genuine partnership — beginning with understanding the client's needs and ending with a space worthy of their ambitions."}
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
                { number: "500+", label: isAr ? "مشروع منجز" : "Projects Completed" },
                { number: "50+", label: isAr ? "علامة تجارية" : "Brands Carried" },
                { number: "15+", label: isAr ? "سنة خبرة" : "Years of Experience" },
                { number: "3", label: isAr ? "معارض" : "Showrooms" },
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
                icon: "Q",
                title: isAr ? "الجودة" : "Quality",
                desc: isAr
                  ? "نختار كل منتج بعناية بالغة لضمان أعلى معايير الجودة والمتانة. الجودة ليست خياراً، بل هي أساس كل ما نقدمه."
                  : "Every product we carry is selected with exacting care to meet the highest standards of quality and durability. Quality is not an option — it is the foundation of everything we offer.",
              },
              {
                icon: "I",
                title: isAr ? "الابتكار" : "Innovation",
                desc: isAr
                  ? "نتبنى أحدث تصاميم الأثاث المكتبي العالمي لنوفر حلولاً تواكب متطلبات بيئات العمل الحديثة وتدعم مرونة الفرق."
                  : "We embrace the latest global office furniture design to deliver solutions that keep pace with modern work environments and support team flexibility.",
              },
              {
                icon: "S",
                title: isAr ? "الاستدامة" : "Sustainability",
                desc: isAr
                  ? "نُولي الاستدامة أهمية محورية في اختياراتنا، ونفضل الموردين الملتزمين بمعايير الإنتاج المسؤول والمواد الصديقة للبيئة."
                  : "Sustainability is central to our sourcing decisions. We prioritize suppliers committed to responsible production and environmentally conscious materials.",
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
