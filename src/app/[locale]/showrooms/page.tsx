import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { StaggerGrid } from "@/components/common/stagger-grid";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "معارضنا — معارض أثاث مكتبي في الرياض | ماجيستيك" : "Our Showrooms — Office Furniture Showrooms in Riyadh | Majestic",
    description: isAr
      ? "زور أحد معارض ماجيستيك الثلاثة في الرياض وشاهد مجموعتنا من الأثاث المكتبي الراقي. مفتوح الأحد–الخميس من 9 صباحاً حتى 6 مساءً."
      : "Visit one of Majestic's three Riyadh showrooms and experience our premium office furniture collection in person. Open Sunday–Thursday, 9am–6pm.",
    alternates: {
      canonical: `https://thedeskco.net/en/showrooms`,
      languages: {
        en: "https://thedeskco.net/en/showrooms",
        ar: "https://thedeskco.net/ar/showrooms",
        "x-default": "https://thedeskco.net/en/showrooms",
      },
    },
    openGraph: {
      title: isAr ? "معارضنا في الرياض | ماجيستيك" : "Our Riyadh Showrooms | Majestic Furniture",
      description: isAr
        ? "3 معارض في الرياض، مفتوحة الأحد–الخميس."
        : "3 showrooms in Riyadh, open Sunday–Thursday.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
      siteName: "Majestic Furniture",
    },
  };
}

interface Showroom {
  name: string;
  address: string;
  hours: string;
  phone: string;
  comingSoon: boolean;
}

export default async function ShowroomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const showrooms: Showroom[] = [
    {
      name: isAr ? "الرياض — العليا" : "Riyadh — Al Olaya",
      address: isAr
        ? "شارع العليا العام، برج المملكة، الرياض"
        : "King Fahad Road, Al Olaya District, Riyadh",
      hours: isAr ? "الأحد – الخميس: 9 ص – 6 م" : "Sun – Thu: 9am – 6pm",
      phone: "+966 11 234 5678",
      comingSoon: false,
    },
    {
      name: isAr ? "الرياض — الملز" : "Riyadh — Al Malaz",
      address: isAr
        ? "شارع الملز، حي الملز، الرياض"
        : "Al Malaz Street, Al Malaz District, Riyadh",
      hours: isAr ? "الأحد – الخميس: 9 ص – 6 م" : "Sun – Thu: 9am – 6pm",
      phone: "+966 11 345 6789",
      comingSoon: false,
    },
    {
      name: isAr ? "جدة — قريباً" : "Jeddah — Coming Soon",
      address: isAr ? "جدة، المملكة العربية السعودية" : "Jeddah, Saudi Arabia",
      hours: isAr ? "قريباً" : "Opening Soon",
      phone: "—",
      comingSoon: true,
    },
  ];

  const showroomItems = showrooms.map((s) => (
    <div
      key={s.name}
      className="border border-[rgba(0,0,0,0.21)] rounded-sm overflow-hidden group relative"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src="/images/hero-tables.jpg"
          alt={s.name}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Coming soon overlay */}
        {s.comingSoon && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-wide uppercase">
              {isAr ? "قريباً" : "Coming Soon"}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-[#0c0c0c] mb-3">{s.name}</h3>
        <div className="space-y-2 mb-6">
          <p className="text-sm text-[#484848] leading-relaxed">{s.address}</p>
          <p className="text-sm text-[#484848]">{s.hours}</p>
          {s.phone !== "—" && (
            <a
              href={`tel:${s.phone.replace(/\s/g, "")}`}
              className="text-sm text-[#0c0c0c] hover:text-[#484848] transition-colors font-medium"
              dir="ltr"
            >
              {s.phone}
            </a>
          )}
        </div>
        {!s.comingSoon && (
          <a
            href="#"
            className="btn-press inline-block border border-[#0c0c0c] text-[#0c0c0c] px-5 py-2.5 text-sm font-semibold rounded-sm hover:bg-[#0c0c0c] hover:text-white transition-colors"
            aria-label={isAr ? `الحصول على الاتجاهات — ${s.name}` : `Get directions — ${s.name}`}
          >
            {isAr ? "الحصول على الاتجاهات" : "Get Directions"}
          </a>
        )}
      </div>
    </div>
  ));

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
            {isAr ? "معارضنا" : "Showrooms"}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0c0c0c]">
            {isAr ? "معارضنا" : "Our Showrooms"}
          </h1>
        </div>
      </section>

      {/* Showrooms grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <p className="text-[#484848] leading-relaxed max-w-xl mb-12">
              {isAr
                ? "تفضل بزيارة أحد معارضنا لتجربة مجموعاتنا الكاملة من الأثاث المكتبي الراقي بنفسك. فريقنا جاهز لمساعدتك في اختيار الحل المثالي."
                : "Visit one of our showrooms to experience our full range of premium office furniture in person. Our team is on hand to help you find the right solution."}
            </p>
          </Reveal>
          <StaggerGrid
            stagger={0.1}
            isRTL={isAr}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {showroomItems}
          </StaggerGrid>
        </div>
      </section>

      {/* Contact strip */}
      <section className="bg-[#fafafa] border-t border-[rgba(0,0,0,0.08)] py-12">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <Reveal>
            <p className="text-[#484848] text-sm mb-4">
              {isAr
                ? "هل لديك استفسار قبل زيارتنا؟"
                : "Have a question before visiting us?"}
            </p>
            <Link
              href="/contact"
              className="text-sm font-semibold text-[#0c0c0c] border-b border-[#0c0c0c] pb-0.5 hover:text-[#484848] hover:border-[#484848] transition-colors"
            >
              {isAr ? "تواصل معنا" : "Get in touch"}
            </Link>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
