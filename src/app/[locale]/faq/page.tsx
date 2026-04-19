import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { FaqPageJsonLd } from "@/components/common/json-ld";
import { FaqClient } from "@/components/faq/faq-client";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import { client, FAQ_QUERY } from "@/lib/sanity";
import type { SanityFaqItem } from "@/lib/sanity";

export const revalidate = 86400;

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

// Category labels shown in the UI (localized)
const CATEGORY_LABELS = (isAr: boolean) => [
  isAr ? "الكل" : "All",
  isAr ? "الطلبات" : "Ordering",
  isAr ? "التوصيل" : "Delivery",
  isAr ? "المنتجات" : "Products",
  isAr ? "الضمان" : "Warranty",
  isAr ? "الإرجاع" : "Returns",
];

// English values used to match against faqItem.category from Sanity
const CATEGORY_VALUES = ["all", "ordering", "delivery", "products", "warranty", "returns"];

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
    category: item.category,
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
          {/*
           * TODO: FAQ search bar — implement full-text search once FAQ volume justifies it.
           * Client-side filtering over the faqs array is the simplest approach.
           * Do not re-add a readOnly/disabled input — it is worse than no input.
           */}

          {/* Interactive tabs + filtered accordion (client component) */}
          <FaqClient
            faqs={faqs}
            categories={categories}
            categoryValues={CATEGORY_VALUES}
            isAr={isAr}
          />

          {/* Bottom CTA */}
          <Reveal>
            <div className="mt-16 text-center border border-[#D4D4D4] rounded-none p-10">
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
