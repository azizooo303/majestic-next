import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "تواصل معنا — ماجيستيك للأثاث" : "Contact Us — Majestic Furniture",
    description: isAr
      ? "تواصل مع فريق ماجيستيك للأثاث المكتبي. زيارة معارضنا في الرياض، أو أرسل لنا استفساراً. الأحد–الخميس، 9 صباحاً–6 مساءً."
      : "Get in touch with the Majestic Furniture team. Visit our Riyadh showrooms or send us an enquiry. Sunday–Thursday, 9am–6pm.",
    alternates: {
      canonical: `https://thedeskco.net/en/contact`,
      languages: {
        en: "https://thedeskco.net/en/contact",
        ar: "https://thedeskco.net/ar/contact",
        "x-default": "https://thedeskco.net/en/contact",
      },
    },
    openGraph: {
      title: isAr ? "تواصل معنا | ماجيستيك" : "Contact Us | Majestic Furniture",
      description: isAr
        ? "تواصل مع فريق ماجيستيك للأثاث المكتبي."
        : "Get in touch with the Majestic Furniture team.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
      siteName: "Majestic Furniture",
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const showrooms = [
    {
      name: isAr ? "الرياض — العليا" : "Riyadh — Al Olaya",
      href: "/showrooms",
    },
    {
      name: isAr ? "الرياض — الملز" : "Riyadh — Al Malaz",
      href: "/showrooms",
    },
    {
      name: isAr ? "جدة — قريباً" : "Jeddah — Coming Soon",
      href: "/showrooms",
    },
  ];

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
            {isAr ? "تواصل معنا" : "Contact Us"}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0c0c0c]">
            {isAr ? "تواصل معنا" : "Contact Us"}
          </h1>
        </div>
      </section>

      {/* 2-col layout */}
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Form */}
            <Reveal>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0c0c0c] tracking-tight mb-8">
                  {isAr ? "أرسل لنا رسالة" : "Send Us a Message"}
                </h2>
                <ContactForm isAr={isAr} />
              </div>
            </Reveal>

            {/* Right: Contact info */}
            <Reveal>
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0c0c0c] tracking-tight mb-8">
                    {isAr ? "معلومات التواصل" : "Contact Information"}
                  </h2>

                  {/* Map placeholder */}
                  <div className="bg-[#e5e7eb] h-48 rounded-sm flex items-center justify-center text-[#9ca3af] text-sm font-medium mb-8">
                    {isAr ? "الخريطة" : "Map"}
                  </div>

                  <div className="space-y-5">
                    {/* Address */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 border border-[rgba(0,0,0,0.21)] rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold">A</span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-[#484848] mb-1">
                          {isAr ? "العنوان" : "Address"}
                        </p>
                        <p className="text-[#0c0c0c] text-sm leading-relaxed">
                          {isAr
                            ? "الرياض، المملكة العربية السعودية"
                            : "Riyadh, Saudi Arabia"}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 border border-[rgba(0,0,0,0.21)] rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold">P</span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-[#484848] mb-1">
                          {isAr ? "الهاتف" : "Phone"}
                        </p>
                        <a
                          href="tel:+966112345678"
                          className="text-[#0c0c0c] text-sm hover:text-[#484848] transition-colors"
                          dir="ltr"
                        >
                          +966 11 234 5678
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 border border-[rgba(0,0,0,0.21)] rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold">E</span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-[#484848] mb-1">
                          {isAr ? "البريد الإلكتروني" : "Email"}
                        </p>
                        <a
                          href="mailto:info@majesticfurniture.sa"
                          className="text-[#0c0c0c] text-sm hover:text-[#484848] transition-colors"
                        >
                          info@majesticfurniture.sa
                        </a>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 border border-[rgba(0,0,0,0.21)] rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold">H</span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-[#484848] mb-1">
                          {isAr ? "ساعات العمل" : "Hours"}
                        </p>
                        <p className="text-[#0c0c0c] text-sm">
                          {isAr
                            ? "الأحد – الخميس: 9 صباحاً – 6 مساءً"
                            : "Sun – Thu: 9am – 6pm"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Showroom links */}
                <div className="border-t border-[rgba(0,0,0,0.08)] pt-8">
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#484848] mb-4">
                    {isAr ? "معارضنا" : "Our Showrooms"}
                  </p>
                  <div className="space-y-2">
                    {showrooms.map((s) => (
                      <Link
                        key={s.name}
                        href={s.href}
                        className="flex items-center justify-between py-2.5 border-b border-[rgba(0,0,0,0.08)] text-sm text-[#0c0c0c] hover:text-[#484848] transition-colors group"
                      >
                        <span>{s.name}</span>
                        <span className="text-[#484848] group-hover:translate-x-1 transition-transform text-xs">
                          {isAr ? "←" : "→"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
