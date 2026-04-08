import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
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
    title: isAr ? "الإلهام — ماجستيك للأثاث" : "Inspirations — Majestic Furniture",
    description: isAr
      ? "استلهم أفكاراً لبيئة عملك من مشاريعنا المنجزة وتصاميمنا الداخلية."
      : "Get inspired by our completed projects and interior design ideas for your workspace.",
    robots: { index: false, follow: true },
    alternates: {
      canonical: siteUrl(`/${locale}/inspirations`),
      languages: {
        en: siteUrl("/en/inspirations"),
        ar: siteUrl("/ar/inspirations"),
        "x-default": siteUrl("/en/inspirations"),
      },
    },
    openGraph: {
      title: isAr ? "الإلهام — ماجستيك للأثاث" : "Inspirations — Majestic Furniture",
      description: isAr
        ? "استلهم أفكاراً لبيئة عملك من مشاريعنا المنجزة وتصاميمنا الداخلية."
        : "Get inspired by our completed projects and interior design ideas for your workspace.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_SA",
      siteName: "Majestic Furniture",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function InspirationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-20 text-center">
        <Reveal>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            {isAr ? "الإلهام" : "Inspirations"}
          </h1>
          <p className="text-[#484848] text-base max-w-md mx-auto mb-8">
            {isAr
              ? "نعمل على تجميع أجمل مشاريعنا لإلهامك. عد قريباً."
              : "We're curating our best projects to inspire you. Check back soon."}
          </p>
          <Link
            href="/projects"
            className="inline-block bg-white text-white px-8 py-3 text-sm font-semibold
              rounded-sm hover:bg-[#333] transition-colors"
          >
            {isAr ? "تصفح مشاريعنا" : "Browse Our Projects"}
          </Link>
        </Reveal>
      </div>
    </PageWrapper>
  );
}
