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
      ? "الضمان وخدمة ما بعد البيع — ماجستيك للأثاث"
      : "Warranty & After-Sales — Majestic Furniture",
    description: isAr
      ? "شروط ضمان ماجستيك للأثاث وخدمة ما بعد البيع. نقف خلف كل منتج نورّده ونركّبه."
      : "Majestic Furniture warranty terms and after-sales service. We stand behind every product we supply and install.",
    alternates: {
      canonical: siteUrl(`/${locale}/warranty`),
      languages: {
        en: siteUrl("/en/warranty"),
        ar: siteUrl("/ar/warranty"),
        "x-default": siteUrl("/en/warranty"),
      },
    },
  };
}

export default async function WarrantyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const coverageRows = isAr
    ? [
        { type: "المكاتب التنفيذية", period: "5 سنوات", coverage: "الهيكل والسطح" },
        { type: "الكراسي الإرغونومية", period: "3 سنوات", coverage: "الآلية والقماش" },
        { type: "وحدات التخزين", period: "5 سنوات", coverage: "الهيكل" },
        { type: "محطات العمل", period: "3 سنوات", coverage: "الهيكل الكامل" },
        { type: "الإكسسوارات", period: "سنة واحدة", coverage: "عيوب التصنيع" },
      ]
    : [
        { type: "Executive Desks", period: "5 Years", coverage: "Structure and surface" },
        { type: "Ergonomic Chairs", period: "3 Years", coverage: "Mechanism and fabric" },
        { type: "Storage Units", period: "5 Years", coverage: "Structure" },
        { type: "Workstations", period: "3 Years", coverage: "Full structure" },
        { type: "Accessories", period: "1 Year", coverage: "Manufacturing defects" },
      ];

  const notCovered = isAr
    ? [
        "التآكل الطبيعي الناتج عن الاستخدام اليومي",
        "الأضرار الناجمة عن سوء الاستخدام أو الإهمال",
        "التعديلات أو الإصلاحات غير المرخصة",
        "أضرار الرطوبة والماء",
      ]
    : [
        "Normal wear from daily use",
        "Damage caused by misuse or negligence",
        "Unauthorized modifications or repairs",
        "Water and moisture damage",
      ];

  const claimSteps = isAr
    ? [
        { title: "تواصل معنا", desc: "أرسل بريداً إلكترونياً إلى warranty@majestic.com.sa مع وصف المشكلة." },
        { title: "قدم دليل الشراء", desc: "أرفق الفاتورة أو إيصال الشراء الأصلي." },
        { title: "نرتب الاستلام أو الإصلاح", desc: "سنتواصل معك لترتيب استلام المنتج أو إرسال فني إلى موقعك." },
      ]
    : [
        { title: "Contact Us", desc: "Email warranty@majestic.com.sa with a description of the issue." },
        { title: "Provide Proof of Purchase", desc: "Attach your original invoice or purchase receipt." },
        { title: "We Arrange Collection or Repair", desc: "We will contact you to arrange collection of the item or dispatch a technician to your location." },
      ];

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
            {isAr ? "معلومات الضمان" : "Warranty Information"}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#2C2C2C]">
            {isAr ? "معلومات الضمان" : "Warranty Information"}
          </h1>
        </div>
      </section>

      {/* Section 1 — Coverage Table */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-8">
              {isAr ? "تغطية الضمان" : "Warranty Coverage"}
            </h2>
          </Reveal>
          <Reveal>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm border-collapse"
                aria-label={isAr ? "جدول تغطية الضمان" : "Warranty coverage table"}
              >
                <thead>
                  <tr className="border-b-2 border-[#2C2C2C]">
                    <th className="text-start py-3 px-4 font-semibold text-[#2C2C2C]">
                      {isAr ? "نوع المنتج" : "Product Type"}
                    </th>
                    <th className="text-start py-3 px-4 font-semibold text-[#2C2C2C]">
                      {isAr ? "مدة الضمان" : "Warranty Period"}
                    </th>
                    <th className="text-start py-3 px-4 font-semibold text-[#2C2C2C]">
                      {isAr ? "التغطية" : "Coverage"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coverageRows.map((row, index) => (
                    <tr
                      key={row.type}
                      className={`border-b border-[#D4D4D4] ${
                        index % 2 === 1 ? "bg-[#F5F5F5]" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-4 text-[#2C2C2C] font-medium">{row.type}</td>
                      <td className="py-3 px-4 text-[#3A3A3A]">{row.period}</td>
                      <td className="py-3 px-4 text-[#3A3A3A]">{row.coverage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section 2 — Not Covered */}
      <section className="py-12 bg-white border-y border-[#D4D4D4]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-6">
                {isAr ? "ما لا يشمله الضمان" : "What Is Not Covered"}
              </h2>
              <ul className="space-y-3">
                {notCovered.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#3A3A3A] leading-relaxed">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3A3A3A] flex-shrink-0"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 3 — How to Claim */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight mb-10">
              {isAr ? "كيفية تقديم طلب ضمان" : "How to Make a Warranty Claim"}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {claimSteps.map((step, index) => (
              <Reveal key={step.title}>
                <div className="border border-[rgba(0,0,0,0.21)] rounded-none p-6">
                  <span className="text-3xl font-extrabold text-[#D4D4D4] select-none">
                    0{index + 1}
                  </span>
                  <h3 className="text-base font-bold text-[#2C2C2C] mt-2 mb-2">{step.title}</h3>
                  <p className="text-sm text-[#3A3A3A] leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — CTA */}
      <Reveal>
        <section className="py-12 bg-white border-t border-[#D4D4D4]">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <p className="text-lg font-semibold text-[#2C2C2C] mb-4">
              {isAr ? "سجّل منتجك الآن" : "Register your product"}
            </p>
            <Link
              href="/contact"
              className="btn-press inline-block bg-[#2C2C2C] text-white px-10 py-3.5 font-semibold
                text-sm tracking-wide rounded-none hover:bg-[#3A3A3A] transition-colors"
            >
              {isAr ? "تسجيل المنتج" : "Register Now"}
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
