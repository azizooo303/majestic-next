import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { FaqPageJsonLd } from "@/components/common/json-ld";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import { client, FAQ_QUERY } from "@/lib/sanity";
import type { SanityFaqItem } from "@/lib/sanity";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "الأسئلة الشائعة — التوصيل والإرجاع والضمان | ماجستيك" : "FAQ — Delivery, Returns & Warranty | Majestic Furniture",
    description: isAr
      ? "إجابات على أكثر الأسئلة شيوعاً حول التوصيل، التركيب، سياسة الإرجاع، الضمان، وطرق الدفع في ماجستيك للأثاث المكتبي."
      : "Answers to the most common questions about delivery, assembly, return policy, warranty, and payment methods at Majestic Furniture.",
    alternates: {
      canonical: siteUrl(`/${locale}/faq`),
      languages: {
        en: siteUrl("/en/faq"),
        ar: siteUrl("/ar/faq"),
        "x-default": siteUrl("/en/faq"),
      },
    },
    openGraph: {
      title: isAr ? "الأسئلة الشائعة | ماجستيك" : "FAQ | Majestic Furniture",
      description: isAr
        ? "إجابات على أسئلتكم حول التوصيل والإرجاع والضمان."
        : "Answers to your questions about delivery, returns, and warranty.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_SA",
      siteName: "Majestic Furniture",
    },
  };
}

const CATEGORY_LABELS = (isAr: boolean) => [
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
  const categories = CATEGORY_LABELS(isAr);

  const faqItems: SanityFaqItem[] = await client
    .fetch<SanityFaqItem[]>(FAQ_QUERY)
    .catch(() => [] as SanityFaqItem[]);

  const faqs = faqItems.map((item) => ({
    q: isAr ? item.questionAr : item.questionEn,
    a: isAr ? item.answerAr : item.answerEn,
  }));

  // Build EN FAQ list for JSON-LD schema
  const faqSchemaItems = faqItems.map((item) => ({
    question: item.questionEn,
    answer: item.answerEn,
  }));

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      <FaqPageJsonLd faqs={faqSchemaItems} />
      {/* Hero */}
      <section className="bg-white border-b border-[#D4D4D4] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#3A3A3A] mb-3">
            <Link href="/" className="hover:text-[#2C2C2C] transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            {isAr ? "الأسئلة الشائعة" : "FAQ"}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2C2C2C]">
            {isAr ? "أسئلة. وإجابات." : "Questions. Answered."}
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3A3A3A] pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {/* TODO: wire search */}
                <input
                  type="search"
                  placeholder={isAr ? "ابحث في الأسئلة..." : "Search questions..."}
                  className="border border-[#D4D4D4] rounded-none px-4 py-3 ps-10 w-full text-sm text-[#2C2C2C] placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#2C2C2C] transition-colors cursor-not-allowed opacity-50"
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
                  className={`px-4 py-2 text-sm font-medium rounded-none border transition-colors ${
                    i === 0
                      ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                      : "bg-white text-[#3A3A3A] border-[rgba(0,0,0,0.21)] hover:border-[#2C2C2C] hover:text-[#2C2C2C]"
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
                  className="group border border-[rgba(0,0,0,0.21)] rounded-none overflow-hidden"
                  open={i === 0}
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none select-none hover:bg-white transition-colors">
                    <span className="font-semibold text-[#2C2C2C] text-sm md:text-base pr-4">
                      {faq.q}
                    </span>
                    <span
                      className="flex-shrink-0 w-6 h-6 border border-[rgba(0,0,0,0.21)] rounded-none flex items-center justify-center text-xs font-bold text-[#3A3A3A] group-open:bg-[#2C2C2C] group-open:text-white group-open:border-[#2C2C2C] transition-colors"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 pt-1 border-t border-[#D4D4D4]">
                    <p className="text-[#3A3A3A] leading-relaxed text-sm">{faq.a}</p>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>

          {/* Bottom CTA */}
          <Reveal>
            <div className="mt-16 text-center border border-[rgba(0,0,0,0.21)] rounded-none p-10">
              <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">
                {isAr ? "لم تجد إجابتك؟" : "Didn't find your answer?"}
              </h3>
              <p className="text-[#3A3A3A] text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                {isAr
                  ? "فريقنا جاهز للإجابة على جميع استفساراتكم."
                  : "Our team is ready to answer all your questions."}
              </p>
              <Link
                href="/contact"
                className="btn-press inline-block bg-[#2C2C2C] text-white px-8 py-3 font-semibold text-sm tracking-wide rounded-none hover:bg-[#3A3A3A] transition-colors"
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
