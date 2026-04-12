import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { StaggerGrid } from "@/components/common/stagger-grid";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import { client, SHOWROOMS_QUERY, urlFor } from "@/lib/sanity";
import type { SanityShowroom } from "@/lib/sanity";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "معارض أثاث مكتبي الرياض | ماجستيك" : "Office Furniture Showrooms Riyadh | Majestic",
    description: isAr
      ? "زور أحد معارض ماجستيك الثلاثة في الرياض وشاهد مجموعتنا من الأثاث المكتبي الراقي. مفتوح الأحد–الخميس من 9 صباحاً حتى 9 مساءً."
      : "Visit one of Majestic's three Riyadh showrooms and experience our premium office furniture collection in person. Open Sunday–Thursday, 9am–9pm.",
    alternates: {
      canonical: siteUrl(`/${locale}/showrooms`),
      languages: {
        en: siteUrl("/en/showrooms"),
        ar: siteUrl("/ar/showrooms"),
        "x-default": siteUrl("/en/showrooms"),
      },
    },
    openGraph: {
      title: isAr ? "معارضنا في الرياض | ماجستيك" : "Our Riyadh Showrooms | Majestic Furniture",
      description: isAr
        ? "3 معارض في الرياض، مفتوحة الأحد–الخميس."
        : "3 showrooms in Riyadh, open Sunday–Thursday.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_SA",
      siteName: "Majestic Furniture",
    },
  };
}

export default async function ShowroomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const showroomsData: SanityShowroom[] = await client
    .fetch<SanityShowroom[]>(SHOWROOMS_QUERY)
    .catch(() => [] as SanityShowroom[]);

  const showroomItems = showroomsData.map((s) => {
    const name = isAr ? s.nameAr : s.nameEn;
    const address = isAr ? (s.addressAr ?? s.addressEn ?? "") : (s.addressEn ?? "");
    const hours = isAr ? (s.hoursAr ?? s.hoursEn ?? "") : (s.hoursEn ?? "");
    const imageUrl = s.image
      ? urlFor(s.image).width(800).height(450).url()
      : "/images/website/showroom-riyadh.jpg";
    return (
    <div
      key={s._id}
      className="border border-[rgba(0,0,0,0.21)] rounded-none overflow-hidden group relative"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Coming soon overlay */}
        {s.isComingSoon && (
          <div className="absolute inset-0 bg-white flex items-center justify-center">
            <span className="text-[#2C2C2C] font-bold text-lg tracking-wide uppercase">
              {isAr ? "قريباً" : "Coming Soon"}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-[#2C2C2C] mb-3">{name}</h3>
        <div className="space-y-2 mb-6">
          <p className="text-sm text-[#3A3A3A] leading-relaxed">{address}</p>
          <p className="text-sm text-[#3A3A3A]">{hours}</p>
          {s.phone && s.phone !== "—" && (
            <a
              href={`tel:${s.phone.replace(/\s/g, "")}`}
              className="text-sm text-[#2C2C2C] hover:text-[#3A3A3A] transition-colors font-medium"
              dir="ltr"
            >
              {s.phone}
            </a>
          )}
        </div>
        {!s.isComingSoon && s.mapsUrl && (
          <a
            href={s.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press inline-block border border-[#2C2C2C] text-[#2C2C2C] px-5 py-2.5 text-sm font-semibold rounded-none hover:bg-[#F5F5F5] hover:text-[#2C2C2C] transition-colors"
            aria-label={isAr ? `الحصول على الاتجاهات — ${name}` : `Get directions — ${name}`}
          >
            {isAr ? "الحصول على الاتجاهات" : "Get Directions"}
          </a>
        )}
      </div>
    </div>
    );
  });

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
            {isAr ? "معارضنا" : "Showrooms"}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2C2C2C]">
            {isAr ? "معارضنا" : "Our Showrooms"}
          </h1>
        </div>
      </section>

      {/* Showrooms grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <p className="text-[#3A3A3A] leading-relaxed max-w-xl mb-12">
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
      <section className="bg-white border-t border-[#D4D4D4] py-12">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <Reveal>
            <p className="text-[#3A3A3A] text-sm mb-4">
              {isAr
                ? "هل لديك استفسار قبل زيارتنا؟"
                : "Have a question before visiting us?"}
            </p>
            <Link
              href="/contact"
              className="text-sm font-semibold text-[#2C2C2C] border-b border-[#2C2C2C] pb-0.5 hover:text-[#3A3A3A] hover:border-[#3A3A3A] transition-colors"
            >
              {isAr ? "تواصل معنا" : "Get in touch"}
            </Link>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
