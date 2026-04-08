import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { ContactForm } from "@/components/contact/contact-form";
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
    title: isAr ? "تواصل مع ماجستيك — أثاث مكتبي السعودية" : "Contact Majestic — Office Furniture Saudi Arabia",
    description: isAr
      ? "تواصل مع ماجستيك لمشاريع الأثاث المكتبي وعروض الأسعار وزيارة المعرض في السعودية ودول الخليج. الأحد–الخميس."
      : "Contact Majestic for office furniture projects, quotations, and showroom visits across Saudi Arabia and the Gulf. Sunday–Thursday.",
    alternates: {
      canonical: siteUrl(`/${locale}/contact`),
      languages: {
        en: siteUrl("/en/contact"),
        ar: siteUrl("/ar/contact"),
        "x-default": siteUrl("/en/contact"),
      },
    },
    openGraph: {
      title: isAr ? "تواصل مع ماجستيك | أثاث مكتبي" : "Contact Majestic | Office Furniture",
      description: isAr
        ? "تواصل مع ماجستيك لمشاريع الأثاث المكتبي وعروض الأسعار وزيارة المعرض."
        : "Contact Majestic for office furniture projects, quotations, and showroom visits.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_SA",
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
      <section className="bg-white border-b border-[rgba(0,0,0,0.08)] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#484848] mb-3">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            {isAr ? "تواصل معنا" : "Contact Us"}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            {isAr ? "تواصل معنا." : "Get in Touch."}
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
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-8">
                  {isAr ? "أرسل رسالة." : "Send a Message."}
                </h2>
                <ContactForm isAr={isAr} />
              </div>
            </Reveal>

            {/* Right: Contact info */}
            <Reveal>
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-8">
                    {isAr ? "أين نحن." : "Find Us."}
                  </h2>

                  {/* Google Maps — Al Olaya, Riyadh */}
                  <div className="h-48 rounded-sm overflow-hidden mb-8">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.674689!2d46.6885!3d24.6908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAl+Olaya%2C+Riyadh!5e0!3m2!1sen!2ssa!4v1"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={isAr ? "موقعنا على الخريطة" : "Our location on map"}
                    />
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
                        <p className="text-gray-900 text-sm leading-relaxed">
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
                          className="text-gray-900 text-sm hover:text-[#484848] transition-colors"
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
                          className="text-gray-900 text-sm hover:text-[#484848] transition-colors"
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
                        <p className="text-gray-900 text-sm">
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
                        className="flex items-center justify-between py-2.5 border-b border-[rgba(0,0,0,0.08)] text-sm text-gray-900 hover:text-[#484848] transition-colors group"
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
