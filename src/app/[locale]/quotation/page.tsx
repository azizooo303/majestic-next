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
    title: isAr ? "طلب عرض سعر — ماجستيك للأثاث" : "Request a Quotation — Majestic Furniture",
    description: isAr
      ? "احصل على عرض سعر مخصص لمشروع أثاثك المكتبي. نخدم المؤسسات الحكومية والخاصة في المملكة."
      : "Get a custom quotation for your office furniture project. We serve government and private organisations across Saudi Arabia.",
    alternates: {
      canonical: siteUrl(`/${locale}/quotation`),
      languages: {
        en: siteUrl("/en/quotation"),
        ar: siteUrl("/ar/quotation"),
        "x-default": siteUrl("/en/quotation"),
      },
    },
  };
}

export default async function QuotationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      <div className="max-w-screen-md mx-auto px-4 md:px-8 py-16">
        <Reveal>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900] tracking-tight mb-3">
            {isAr ? "طلب عرض سعر" : "Request a Quotation"}
          </h1>
          <p className="text-[#484848] text-base mb-10">
            {isAr
              ? "أخبرنا عن مشروعك وسيتواصل معك فريقنا خلال يوم عمل."
              : "Tell us about your project and our team will get back to you within one business day."}
          </p>
        </Reveal>

        {/* Reuse the existing contact form — source="quotation" tags the row in Supabase */}
        <ContactForm isAr={isAr} source="quotation" />
      </div>
    </PageWrapper>
  );
}
