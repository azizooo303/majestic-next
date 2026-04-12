import type { Metadata } from "next";
import { Reveal } from "@/components/common/reveal";
import { Link } from "@/i18n/navigation";
import { siteUrl } from "@/lib/site-url";

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
      ? "التوصيل والتركيب — ماجستيك للأثاث"
      : "Delivery & Installation — Majestic Furniture",
    description: isAr
      ? "توصيل وتركيب احترافي في جميع أنحاء المملكة العربية السعودية ودول الخليج. أثاث مكتبي يصل في موعده."
      : "Nationwide delivery and professional installation across Saudi Arabia and the GCC. Office furniture delivered on time, every time.",
    alternates: {
      canonical: siteUrl(`/${locale}/delivery`),
      languages: {
        en: siteUrl("/en/delivery"),
        ar: siteUrl("/ar/delivery"),
        "x-default": siteUrl("/en/delivery"),
      },
    },
    openGraph: {
      title: isAr
        ? "التوصيل والتركيب — ماجستيك للأثاث"
        : "Delivery & Installation — Majestic Furniture",
      description: isAr
        ? "توصيل وتركيب احترافي في جميع أنحاء المملكة العربية السعودية ودول الخليج. أثاث مكتبي يصل في موعده."
        : "Nationwide delivery and professional installation across Saudi Arabia and the GCC. Office furniture delivered on time, every time.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_SA",
      siteName: "Majestic Furniture",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function DeliveryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const deliveryZones = isAr
    ? [
        {
          title: "الرياض",
          days: "5–7 أيام عمل",
          fee: "مجاني للطلبات التي تتجاوز 500 ريال",
        },
        {
          title: "مدن المملكة الأخرى",
          days: "7–14 يوم عمل",
          fee: "75 ريال سعودي",
        },
        {
          title: "التركيب",
          days: "مشمول مع جميع الطلبات",
          fee: "مجاني",
        },
      ]
    : [
        {
          title: "Riyadh",
          days: "5–7 business days",
          fee: "Free over SAR 500",
        },
        {
          title: "Other KSA Cities",
          days: "7–14 business days",
          fee: "SAR 75 flat rate",
        },
        {
          title: "Assembly",
          days: "Included with all orders",
          fee: "Free",
        },
      ];

  const processSteps = isAr
    ? ["تم الطلب", "تم التأكيد (24 ساعة)", "تم الشحن", "تم التسليم", "التركيب"]
    : ["Order Placed", "Confirmed (24h)", "Dispatched", "Delivered", "Assembly"];

  return (
    <main id="main-content" className="flex-1 pt-24 bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-[#D4D4D4] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#3A3A3A] mb-3">
            <Link href="/" className="hover:text-[#2C2C2C] transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            {" / "}
            {isAr ? "التوصيل والإرجاع" : "Delivery and Returns"}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#2C2C2C]">
            {isAr ? "التوصيل والإرجاع" : "Delivery and Returns"}
          </h1>
        </div>
      </section>

      {/* Section 1 — Delivery Zones */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-10">
              {isAr ? "مناطق التوصيل" : "Delivery Zones"}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliveryZones.map((zone) => (
              <Reveal key={zone.title}>
                <div className="border border-[rgba(0,0,0,0.21)] rounded-none p-6 flex flex-col gap-4">
                  {/* Icon placeholder */}
                  <div
                    className="w-10 h-10 rounded-none border border-[rgba(0,0,0,0.21)] flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="w-3 h-3 bg-white inline-block" />
                  </div>
                  <h3 className="text-lg font-bold text-[#2C2C2C]">{zone.title}</h3>
                  <p className="text-[#3A3A3A] text-sm leading-relaxed">{zone.days}</p>
                  <p className="text-sm font-semibold text-[#2C2C2C]">{zone.fee}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 — Delivery Process */}
      <section className="py-12 bg-white border-y border-[#D4D4D4]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-10">
              {isAr ? "مراحل التوصيل" : "Delivery Process"}
            </h2>
          </Reveal>
          <Reveal>
            <ol
              className="flex flex-col md:flex-row items-start md:items-center gap-0"
              aria-label={isAr ? "خطوات التوصيل" : "Delivery steps"}
            >
              {processSteps.map((step, index) => (
                <li key={step} className="flex md:flex-1 items-center gap-0 w-full">
                  <div className="flex flex-col md:flex-row items-center flex-1">
                    {/* Step number */}
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-none bg-[#2C2C2C] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-xs font-medium text-[#2C2C2C] text-center mt-2 max-w-[80px] md:hidden">
                        {step}
                      </p>
                    </div>
                    {/* Connector line */}
                    {index < processSteps.length - 1 && (
                      <>
                        {/* Mobile: vertical */}
                        <div className="w-px h-6 bg-[#D4D4D4] mx-auto md:hidden" />
                        {/* Desktop: horizontal */}
                        <div className="hidden md:block flex-1 h-px bg-[#D4D4D4] mx-2" />
                      </>
                    )}
                  </div>
                  {/* Desktop label under step */}
                  <p className="hidden md:block absolute text-xs font-medium text-[#2C2C2C] text-center" />
                </li>
              ))}
            </ol>
            {/* Desktop labels row */}
            <div className="hidden md:flex mt-3">
              {processSteps.map((step) => (
                <div key={step} className="flex-1 text-center">
                  <span className="text-xs font-medium text-[#3A3A3A]">{step}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section 3 — Returns */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-6">
                {isAr ? "سياسة الإرجاع" : "Return Policy"}
              </h2>
              <div className="space-y-4 text-[#3A3A3A] leading-relaxed">
                <p>
                  {isAr
                    ? "يمكنك إرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام."
                    : "You may return products within 14 days of receiving your order."}
                </p>
                <p>
                  {isAr
                    ? "يجب أن تكون المنتجات غير مستعملة وفي عبوتها الأصلية الكاملة."
                    : "Items must be unused and in their original, undamaged packaging."}
                </p>
                <p>
                  {isAr
                    ? "لبدء عملية الإرجاع، تواصل معنا عبر البريد الإلكتروني: returns@majestic.com.sa"
                    : "To initiate a return, contact us at: returns@majestic.com.sa"}
                </p>
                <p>
                  {isAr
                    ? "يُعاد المبلغ خلال 5 إلى 7 أيام عمل من استلامنا للمنتج."
                    : "Refunds are processed within 5–7 business days after collection."}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 4 — CTA */}
      <Reveal>
        <section className="py-12 bg-white border-t border-[#D4D4D4]">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <p className="text-lg font-semibold text-[#2C2C2C] mb-4">
              {isAr ? "هل لديك استفسار؟" : "Have a question?"}
            </p>
            <Link
              href="/contact"
              className="btn-press inline-block bg-[#2C2C2C] text-white px-10 py-3.5 font-semibold
                text-sm tracking-wide rounded-none hover:bg-[#3A3A3A] transition-colors"
            >
              {isAr ? "تواصل معنا" : "Contact Us"}
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
