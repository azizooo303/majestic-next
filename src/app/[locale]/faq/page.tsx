import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { FaqPageJsonLd } from "@/components/common/json-ld";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "الأسئلة الشائعة — التوصيل والإرجاع والضمان | ماجيستيك" : "FAQ — Delivery, Returns & Warranty | Majestic Furniture",
    description: isAr
      ? "إجابات على أكثر الأسئلة شيوعاً حول التوصيل، التركيب، سياسة الإرجاع، الضمان، وطرق الدفع في ماجيستيك للأثاث المكتبي."
      : "Answers to the most common questions about delivery, assembly, return policy, warranty, and payment methods at Majestic Furniture.",
    alternates: {
      canonical: `https://thedeskco.net/${locale}/faq`,
      languages: {
        en: "https://thedeskco.net/en/faq",
        ar: "https://thedeskco.net/ar/faq",
        "x-default": "https://thedeskco.net/en/faq",
      },
    },
    openGraph: {
      title: isAr ? "الأسئلة الشائعة | ماجيستيك" : "FAQ | Majestic Furniture",
      description: isAr
        ? "إجابات على أسئلتكم حول التوصيل والإرجاع والضمان."
        : "Answers to your questions about delivery, returns, and warranty.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
      siteName: "Majestic Furniture",
    },
  };
}

const FAQS = (isAr: boolean) => [
  {
    q: isAr ? "كم تستغرق مدة التوصيل؟" : "How long does delivery take?",
    a: isAr
      ? "يستغرق التوصيل من 5 إلى 7 أيام عمل داخل الرياض. قد تختلف المواعيد لمناطق خارج الرياض — يُرجى التواصل مع فريق المبيعات لتأكيد المدة."
      : "Delivery takes 5–7 business days within Riyadh. Timelines may vary for regions outside Riyadh — please contact our sales team to confirm your delivery window.",
  },
  {
    q: isAr ? "هل تشمل الخدمة التركيب؟" : "Do you offer assembly?",
    a: isAr
      ? "نعم، يشمل سعر التوصيل خدمة التركيب الكامل من قِبل فريقنا المتخصص. لا تحتاج إلى أي إجراء إضافي."
      : "Yes, full assembly by our specialist team is included with every delivery. No additional steps required from your side.",
  },
  {
    q: isAr ? "ما هي سياسة الإرجاع؟" : "What is your return policy?",
    a: isAr
      ? "نقبل إرجاع المنتجات غير المستخدمة خلال 14 يوماً من تاريخ الاستلام، شريطة أن تكون في حالتها الأصلية وبتغليفها الأصلي. يُرجى التواصل مع خدمة العملاء لبدء إجراءات الإرجاع."
      : "We accept returns on unused items within 14 days of receipt, provided they are in original condition and original packaging. Contact customer service to initiate a return.",
  },
  {
    q: isAr ? "هل تقدمون خصومات للشركات؟" : "Do you offer corporate discounts?",
    a: isAr
      ? "نعم، نقدم أسعاراً خاصة للمشتريات بالجملة وعملاء B2B. يُرجى التواصل معنا مباشرة للحصول على عرض سعر مخصص لمتطلبات مشروعكم."
      : "Yes, we offer special pricing for bulk purchases and B2B clients. Contact us directly for a customized quote tailored to your project requirements.",
  },
  {
    q: isAr ? "هل يمكنني زيارة أحد المعارض؟" : "Can I visit a showroom?",
    a: isAr
      ? "نعم، لدينا 3 معارض في الرياض. نرحب بزياراتكم من الأحد إلى الخميس بين الساعة 9 صباحاً و6 مساءً. يمكنكم الاطلاع على عناوين المعارض وتفاصيلها في صفحة المعارض."
      : "Yes, we have 3 showrooms in Riyadh. We welcome visits Sunday through Thursday, 9am to 6pm. You can find showroom addresses and details on our showrooms page.",
  },
  {
    q: isAr ? "هل تشحنون خارج الرياض؟" : "Do you ship outside Riyadh?",
    a: isAr
      ? "نعم، نوفر خدمة الشحن إلى جميع مناطق المملكة العربية السعودية. قد تختلف مواعيد التسليم والتكاليف حسب الموقع. تواصل معنا للاستفسار."
      : "Yes, we ship across Saudi Arabia. Delivery timelines and costs vary by location. Get in touch with us to discuss your specific requirements.",
  },
  {
    q: isAr ? "ما طرق الدفع المتاحة؟" : "What payment methods do you accept?",
    a: isAr
      ? "نقبل: مدى، Visa، Mastercard، Apple Pay، STC Pay، Tabby، وتمارة."
      : "We accept: mada, Visa, Mastercard, Apple Pay, STC Pay, Tabby, and Tamara.",
  },
  {
    q: isAr ? "كيف أتتبع طلبي؟" : "How do I track my order?",
    a: isAr
      ? "ستصلك رسالة SMS وبريد إلكتروني برابط التتبع فور إرسال طلبك. يمكنك متابعة حالة الطلب في أي وقت عبر الرابط المُرسَل."
      : "You will receive a tracking link via SMS and email as soon as your order is dispatched. Use that link to follow your order status at any time.",
  },
];

const CATEGORIES = (isAr: boolean) => [
  isAr ? "الكل" : "All",
  isAr ? "الطلبات" : "Ordering",
  isAr ? "التوصيل" : "Delivery",
  isAr ? "المنتجات" : "Products",
  isAr ? "الضمان" : "Warranty",
  isAr ? "الإرجاع" : "Returns",
];

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const faqs = FAQS(isAr);
  const categories = CATEGORIES(isAr);

  // Build EN FAQ list for JSON-LD schema (search engines prefer one language per schema block)
  const enFaqs = FAQS(false);
  const faqSchemaItems = enFaqs.map((faq) => ({
    question: faq.q,
    answer: faq.a,
  }));

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      <FaqPageJsonLd faqs={faqSchemaItems} />
      {/* Hero */}
      <section className="bg-white border-b border-[rgba(0,0,0,0.08)] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#484848] mb-3">
            <Link href="/" className="hover:text-gray-900] transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            {isAr ? "الأسئلة الشائعة" : "FAQ"}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900]">
            {isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Search bar (visual only) */}
          <Reveal>
            <div className="flex justify-center mb-12">
              <div className="relative w-full max-w-lg">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  placeholder={isAr ? "ابحث في الأسئلة..." : "Search questions..."}
                  className="border border-[rgba(0,0,0,0.21)] rounded-sm px-4 py-3 pl-10 w-full text-sm text-gray-900] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0c0c0c] transition-colors"
                  readOnly
                  aria-label={isAr ? "بحث في الأسئلة الشائعة" : "Search FAQ"}
                />
              </div>
            </div>
          </Reveal>

          {/* Category tabs — first tab visually active */}
          <Reveal>
            <div
              className="flex gap-2 flex-wrap mb-10"
              role="tablist"
              aria-label={isAr ? "تصفية الأسئلة" : "FAQ categories"}
            >
              {categories.map((cat, i) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={i === 0}
                  className={`px-4 py-2 text-sm font-medium rounded-sm border transition-colors ${
                    i === 0
                      ? "bg-white text-white border-[#0c0c0c]"
                      : "bg-white text-[#484848] border-[rgba(0,0,0,0.21)] hover:border-[#0c0c0c] hover:text-gray-900]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Accordion */}
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <Reveal key={i}>
                <details
                  className="group border border-[rgba(0,0,0,0.21)] rounded-sm overflow-hidden"
                  open={i === 0}
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none select-none hover:bg-white transition-colors">
                    <span className="font-semibold text-gray-900] text-sm md:text-base pr-4">
                      {faq.q}
                    </span>
                    <span
                      className="flex-shrink-0 w-6 h-6 border border-[rgba(0,0,0,0.21)] rounded-sm flex items-center justify-center text-xs font-bold text-[#484848] group-open:bg-white group-open:text-white group-open:border-[#0c0c0c] transition-colors"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 pt-1 border-t border-[rgba(0,0,0,0.08)]">
                    <p className="text-[#484848] leading-relaxed text-sm">{faq.a}</p>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>

          {/* Bottom CTA */}
          <Reveal>
            <div className="mt-16 text-center border border-[rgba(0,0,0,0.21)] rounded-sm p-10">
              <h3 className="text-xl font-bold text-gray-900] mb-3">
                {isAr ? "لم تجد إجابتك؟" : "Didn't find your answer?"}
              </h3>
              <p className="text-[#484848] text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                {isAr
                  ? "فريقنا جاهز للإجابة على جميع استفساراتكم."
                  : "Our team is ready to answer all your questions."}
              </p>
              <Link
                href="/contact"
                className="btn-press inline-block bg-white text-white px-8 py-3 font-semibold text-sm tracking-wide rounded-sm hover:bg-[#333] transition-colors"
              >
                {isAr ? "تواصل معنا" : "Contact Us"}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
