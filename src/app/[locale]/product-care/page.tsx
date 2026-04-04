import type { Metadata } from "next";
import { Reveal } from "@/components/common/reveal";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr
      ? "العناية بالمنتجات والصيانة — ماجيستيك للأثاث"
      : "Product Care & Maintenance — Majestic Furniture",
    description: isAr
      ? "أدلة العناية والصيانة لأثاث مكاتب ماجيستيك. حافظ على استثمارك في بيئة عملك."
      : "Care and maintenance guides for Majestic office furniture. Keep your workspace investment in peak condition.",
    alternates: {
      canonical: `https://thedeskco.net/${locale}/product-care`,
      languages: {
        en: "/en/product-care",
        ar: "/ar/product-care",
        "x-default": "/en/product-care",
      },
    },
  };
}

export default async function ProductCarePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const careCategories = isAr
    ? [
        {
          title: "الكراسي المنجدة",
          tips: [
            "شفط الغبار أسبوعياً باستخدام ملحق ناعم",
            "تنظيف البقع بقطعة قماش مبللة وصابون خفيف",
            "تجنب التعرض المباشر لأشعة الشمس للحفاظ على الألوان",
          ],
        },
        {
          title: "الأسطح الخشبية",
          tips: [
            "مسح الغبار بقطعة قماش جافة وناعمة",
            "استخدام منظف خشب متخصص مرة كل شهر",
            "تجنب وضع الأغراض الرطبة مباشرة على السطح",
          ],
        },
        {
          title: "الهياكل المعدنية",
          tips: [
            "مسحها بقطعة قماش مبللة قليلاً",
            "تجفيف فوري بعد التنظيف لمنع الصدأ",
            "فحص المفاصل والوصلات سنوياً",
          ],
        },
        {
          title: "الأسطح الزجاجية",
          tips: [
            "استخدام منظف زجاج متخصص وقطعة ميكروفايبر",
            "تجنب المنظفات المحتوية على الأمونيا",
            "تنظيفها بحركات أفقية أو رأسية وليس دائرية",
          ],
        },
      ]
    : [
        {
          title: "Upholstered Chairs",
          tips: [
            "Vacuum weekly using a soft brush attachment",
            "Spot clean with a damp cloth and mild detergent",
            "Avoid direct sunlight to prevent color fading",
          ],
        },
        {
          title: "Wooden Surfaces",
          tips: [
            "Dust with a dry, soft cloth",
            "Use a specialist wood cleaner monthly",
            "Avoid placing wet items directly on the surface",
          ],
        },
        {
          title: "Metal Frames",
          tips: [
            "Wipe with a lightly damp cloth",
            "Dry immediately after cleaning to prevent rust",
            "Check joints and connections annually",
          ],
        },
        {
          title: "Glass Surfaces",
          tips: [
            "Use a specialist glass cleaner and microfiber cloth",
            "Avoid ammonia-based cleaning products",
            "Clean with straight strokes, not circular motions",
          ],
        },
      ];

  const avoidProducts = isAr
    ? [
        { name: "المبيض", reason: "يتلف الأقمشة والأسطح الملونة" },
        { name: "الأمونيا", reason: "تخدش الأسطح الزجاجية وتضر بالطلاء" },
        { name: "المنظفات الكاشطة", reason: "تخدش الأسطح وتزيل الطلاء" },
      ]
    : [
        { name: "Bleach", reason: "Damages fabrics and colored surfaces" },
        { name: "Ammonia", reason: "Scratches glass surfaces and harms lacquer finishes" },
        { name: "Abrasive Cleaners", reason: "Scratch surfaces and remove protective coatings" },
      ];

  const proTips = isAr
    ? [
        {
          title: "الصيانة السنوية",
          desc: "خصص وقتاً كل عام لفحص الأثاث والتحقق من إحكام المسامير وسلامة الوصلات وجودة الأسطح.",
        },
        {
          title: "نصائح التخزين",
          desc: "عند تخزين الأثاث لفترة طويلة، غطّه بأغطية قماشية قابلة للتنفس وتجنب المناطق ذات الرطوبة العالية.",
        },
        {
          title: "نقل الأثاث",
          desc: "عند تحريك القطع الثقيلة، استخدم واقيات للأرضية وتجنب سحبها؛ الرفع دائماً أفضل للأثاث والأرضية.",
        },
      ]
    : [
        {
          title: "Annual Maintenance",
          desc: "Set aside time each year to inspect furniture, check that screws are tight, connections are sound, and surfaces are in good condition.",
        },
        {
          title: "Storage Tips",
          desc: "When storing furniture for extended periods, cover with breathable fabric covers and avoid areas with high humidity.",
        },
        {
          title: "Moving Furniture",
          desc: "When moving heavy pieces, use floor protectors and avoid dragging. Lifting is always better for both the furniture and your flooring.",
        },
      ];

  return (
    <main className="flex-1 pt-20 bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-[rgba(0,0,0,0.08)] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#484848] mb-3">
            <Link href="/" className="hover:text-gray-900] transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            {" / "}
            {isAr ? "دليل العناية بالمنتجات" : "Product Care Guide"}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900]">
            {isAr ? "دليل العناية بالمنتجات" : "Product Care Guide"}
          </h1>
          <p className="text-[#484848] text-sm mt-3 max-w-md">
            {isAr
              ? "نصائح وإرشادات لإطالة عمر أثاثك والحفاظ على مظهره الأنيق."
              : "Tips and guidance for extending the life of your furniture and maintaining its appearance."}
          </p>
        </div>
      </section>

      {/* Section 1 — Care categories 2x2 */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900] tracking-tight mb-10">
              {isAr ? "دليل العناية حسب نوع المنتج" : "Care by Product Type"}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careCategories.map((cat) => (
              <Reveal key={cat.title}>
                <div className="border border-[rgba(0,0,0,0.21)] rounded-sm p-6">
                  <h3 className="text-base font-bold text-gray-900] mb-4">{cat.title}</h3>
                  <ul className="space-y-2">
                    {cat.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-3 text-sm text-[#484848] leading-relaxed">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#484848] flex-shrink-0"
                          aria-hidden="true"
                        />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 — Products to avoid */}
      <section className="py-12 bg-white border-t border-[rgba(0,0,0,0.08)]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900] tracking-tight mb-8">
              {isAr ? "منتجات يجب تجنبها" : "Cleaning Products to Avoid"}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {avoidProducts.map((product) => (
              <Reveal key={product.name}>
                <div className="border border-red-200 bg-red-50 rounded-sm p-6">
                  <h3 className="text-base font-bold text-red-800 mb-2">{product.name}</h3>
                  <p className="text-sm text-red-700 leading-relaxed">{product.reason}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Pro tips strip */}
      <section className="py-12 bg-white border-y border-[rgba(0,0,0,0.08)]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900] tracking-tight mb-8">
              {isAr ? "نصائح احترافية" : "Pro Tips"}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proTips.map((tip) => (
              <Reveal key={tip.title}>
                <div>
                  <h3 className="text-sm font-bold text-gray-900] uppercase tracking-wider mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-[#484848] leading-relaxed">{tip.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
