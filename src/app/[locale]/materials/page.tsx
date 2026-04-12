import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { Link } from "@/i18n/navigation";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "المواد والألوان — ماجستيك للأثاث" : "Materials & Colors — Majestic Furniture",
    description: isAr
      ? "استعرض مجموعة المواد والألوان المتوفرة لتخصيص أثاثك المكتبي."
      : "Explore our range of materials and finishes available for customising your office furniture.",
    alternates: {
      canonical: siteUrl(`/${locale}/materials`),
      languages: {
        en: siteUrl("/en/materials"),
        ar: siteUrl("/ar/materials"),
        "x-default": siteUrl("/en/materials"),
      },
    },
    openGraph: {
      title: isAr ? "المواد والألوان — ماجستيك للأثاث" : "Materials & Colors — Majestic Furniture",
      description: isAr
        ? "استعرض مجموعة المواد والألوان المتوفرة لتخصيص أثاثك المكتبي."
        : "Explore our range of materials and finishes available for customising your office furniture.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_SA",
      siteName: "Majestic Furniture",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
  };
}

const SWATCHES = [
  { name: "Warm White",    nameAr: "أبيض دافئ",    hex: "#F5F5F0" },
  { name: "Ivory",         nameAr: "عاجي",           hex: "#FFFFF0" },
  { name: "Light Grey",   nameAr: "رمادي فاتح",    hex: "#D0D0D0" },
  { name: "Mid Grey",     nameAr: "رمادي متوسط",   hex: "#909090" },
  { name: "Charcoal",     nameAr: "فحمي",           hex: "#3C3C3C" },
  { name: "Matte Black",  nameAr: "أسود مطفأ",     hex: "#1A1A1A" },
  { name: "Walnut",       nameAr: "جوز",            hex: "#7B4F2E" },
  { name: "Oak",          nameAr: "بلوط",           hex: "#C8A165" },
  { name: "Sand",         nameAr: "رملي",           hex: "#C2B280" },
  { name: "Navy",         nameAr: "كحلي",           hex: "#1B3A5C" },
  { name: "Forest",       nameAr: "أخضر غابي",     hex: "#2D5016" },
  { name: "Terracotta",   nameAr: "تيراكوتا",      hex: "#C1440E" },
];

export default async function MaterialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
        <Reveal>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] tracking-tight mb-3">
            {isAr ? "المواد والألوان" : "Materials & Colors"}
          </h1>
          <p className="text-[#3A3A3A] text-base max-w-xl mb-12">
            {isAr
              ? "نقدم مجموعة واسعة من المواد والتشطيبات لتتناسب مع هوية مساحة عملك."
              : "We offer a wide range of materials and finishes to match your workspace identity."}
          </p>
        </Reveal>

        {/* Swatches grid */}
        <Reveal>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5 mb-16">
            {SWATCHES.map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-2">
                <div
                  className="w-full aspect-square rounded-none border border-[#D4D4D4]"
                  style={{ backgroundColor: s.hex }}
                />
                <span className="text-xs text-[#3A3A3A] text-center">
                  {isAr ? s.nameAr : s.name}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="border-t border-[#D4D4D4] pt-10 text-center">
            <p className="text-[#3A3A3A] text-sm mb-4">
              {isAr
                ? "هل تحتاج إلى لون أو مادة غير موجودة هنا؟ تواصل معنا لخيارات التخصيص."
                : "Need a finish not listed here? Contact us for custom options."}
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#2C2C2C] text-white px-8 py-3 text-sm font-semibold
                rounded-none hover:bg-[#3A3A3A] transition-colors"
            >
              {isAr ? "تواصل معنا" : "Contact Us"}
            </Link>
          </div>
        </Reveal>
      </div>
    </PageWrapper>
  );
}
