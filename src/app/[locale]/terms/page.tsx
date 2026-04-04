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
    title: isAr ? "الشروط والأحكام" : "Terms & Conditions",
    robots: { index: false, follow: false },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const sections = isAr
    ? [
        {
          id: "acceptance",
          heading: "قبول الشروط",
          paragraphs: [
            "باستخدامك لموقع ماجستيك للأثاث أو تقديمك أي طلب عبره، فإنك توافق على الالتزام بهذه الشروط والأحكام الواردة في هذه الصفحة.",
            "إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام الموقع أو خدماتنا. نحتفظ بالحق في تعديل هذه الشروط في أي وقت مع إخطارك بالتغييرات الجوهرية.",
            "الاستمرار في استخدام الموقع بعد نشر أي تعديلات يُعدّ قبولاً صريحاً للشروط المحدّثة.",
          ],
        },
        {
          id: "products",
          heading: "معلومات المنتجات",
          paragraphs: [
            "نبذل قصارى جهدنا لعرض معلومات دقيقة عن المنتجات، غير أن الأسعار والتوافر قابلان للتغيير دون إشعار مسبق.",
            "الصور المعروضة توضيحية فقط. قد تختلف الألوان والأبعاد الفعلية قليلاً عما يظهر على الشاشة نظراً لاختلاف إعدادات العرض.",
            "في حال وجود تناقض بين السعر المعروض والسعر الفعلي عند معالجة الطلب، سنتواصل معك فوراً قبل إتمام العملية.",
          ],
        },
        {
          id: "orders",
          heading: "الطلبات والدفع",
          paragraphs: [
            "يُشترط سداد كامل قيمة الطلب قبل الشروع في التجهيز والتسليم. تتم المعاملات بالريال السعودي (SAR) وتشمل ضريبة القيمة المضافة 15% وفقاً لنظام هيئة الزكاة والضريبة والجمارك.",
            "نقبل الدفع بواسطة البطاقات الائتمانية وبطاقات الخصم المباشر والتحويل البنكي. تُعالَج عمليات الدفع عبر بوابات دفع آمنة ومعتمدة.",
            "عند إتمام الطلب ستصلك رسالة تأكيد على بريدك الإلكتروني. وجود رسالة التأكيد لا يعني بالضرورة توافر المنتج في المخزون؛ سنتواصل معك في حال الاحتياج لأي توضيح.",
          ],
        },
        {
          id: "delivery",
          heading: "التسليم",
          paragraphs: [
            "يتم التسليم داخل الرياض خلال 5 إلى 7 أيام عمل، وفي باقي مناطق المملكة العربية السعودية خلال 7 إلى 14 يوم عمل من تاريخ تأكيد الطلب.",
            "تواريخ التسليم المُعطاة تقديرية وقد تتأثر بعوامل خارجة عن إرادتنا. سنحرص على إبلاغك فوراً بأي تأخير محتمل.",
          ],
        },
        {
          id: "returns",
          heading: "الإرجاع والاسترداد",
          paragraphs: [
            "نقبل إرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام، شريطة أن تكون غير مستعملة وفي عبواتها الأصلية.",
            "تكاليف الشحن العكسي تقع على عاتق العميل ما لم يكن الإرجاع ناتجاً عن خطأ من جانبنا أو وجود عيب تصنيعي.",
            "يُعاد المبلغ إلى وسيلة الدفع الأصلية خلال 5 إلى 7 أيام عمل بعد استلامنا للمنتج والتحقق من حالته.",
          ],
        },
        {
          id: "warranty",
          heading: "الضمان",
          paragraphs: [
            "تشمل جميع المنتجات ضمان الشركة المصنّعة لمدة عام واحد على الأقل ضد عيوب المواد والتصنيع.",
            "يغطي الضمان إصلاح أو استبدال المنتج المعيب حسب تقديرنا، ولا يشمل تلف التسليم أو سوء الاستخدام أو التآكل الطبيعي.",
          ],
        },
        {
          id: "law",
          heading: "القانون المطبق",
          paragraphs: [
            "تخضع هذه الشروط وتُفسَّر وفقاً لأنظمة وتشريعات المملكة العربية السعودية.",
            "في حالة نشوء أي نزاع، تختص المحاكم السعودية المختصة بالفصل فيه.",
            "إذا تبيّن أن أي بند من هذه الشروط غير قانوني أو باطل، يبقى سائر الشروط سارية المفعول دون تأثر.",
          ],
        },
      ]
    : [
        {
          id: "acceptance",
          heading: "Acceptance of Terms",
          paragraphs: [
            "By using the Majestic Furniture website or placing any order through it, you agree to be bound by these terms and conditions.",
            "If you do not agree to these terms, please do not use the site or our services. We reserve the right to modify these terms at any time and will notify you of material changes.",
            "Continued use of the site after any modifications are posted constitutes express acceptance of the updated terms.",
          ],
        },
        {
          id: "products",
          heading: "Product Information",
          paragraphs: [
            "We make every effort to display accurate product information, however prices and availability are subject to change without prior notice.",
            "Images shown are for illustrative purposes only. Actual colors and dimensions may differ slightly from what appears on screen due to display settings.",
            "If there is a discrepancy between the displayed price and the actual price at order processing, we will contact you immediately before completing the transaction.",
          ],
        },
        {
          id: "orders",
          heading: "Orders and Payment",
          paragraphs: [
            "Full payment is required before processing and dispatch. All transactions are in Saudi Riyal (SAR) and include 15% VAT in accordance with the Zakat, Tax and Customs Authority regulations.",
            "We accept payment by credit card, debit card, and bank transfer. All payments are processed through secure, certified payment gateways.",
            "You will receive a confirmation email upon placing your order. A confirmation does not guarantee stock availability; we will contact you if any clarification is needed.",
          ],
        },
        {
          id: "delivery",
          heading: "Delivery",
          paragraphs: [
            "Delivery within Riyadh takes 5–7 business days and to other regions of the Kingdom of Saudi Arabia 7–14 business days from order confirmation.",
            "Delivery dates given are estimates and may be affected by factors outside our control. We will notify you promptly of any potential delay.",
          ],
        },
        {
          id: "returns",
          heading: "Returns and Refunds",
          paragraphs: [
            "We accept returns within 14 days of receipt, provided items are unused and in their original packaging.",
            "Return shipping costs are the customer's responsibility unless the return is due to our error or a manufacturing defect.",
            "Refunds are issued to the original payment method within 5–7 business days after we receive and inspect the returned item.",
          ],
        },
        {
          id: "warranty",
          heading: "Warranty",
          paragraphs: [
            "All products include a minimum one-year manufacturer warranty against defects in materials and workmanship.",
            "The warranty covers repair or replacement of the defective product at our discretion, and does not cover delivery damage, misuse, or natural wear.",
          ],
        },
        {
          id: "law",
          heading: "Governing Law",
          paragraphs: [
            "These terms are governed by and construed in accordance with the laws and regulations of the Kingdom of Saudi Arabia.",
            "In the event of any dispute, the competent Saudi courts shall have jurisdiction.",
            "If any provision of these terms is found to be unlawful or void, the remaining provisions continue in full force.",
          ],
        },
      ];

  return (
    <main className="flex-1 pt-20 bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-[rgba(0,0,0,0.08)] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#484848] mb-3">
            <Link href="/" className="hover:text-[#0c0c0c] transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            {" / "}
            {isAr ? "شروط الخدمة" : "Terms of Service"}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0c0c0c]">
            {isAr ? "شروط الخدمة" : "Terms of Service"}
          </h1>
          <p className="text-[#484848] text-sm mt-3">
            {isAr ? "آخر تحديث: أبريل 2025" : "Last updated: April 2025"}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
          {sections.map((section, index) => (
            <Reveal key={section.id}>
              <div
                className={
                  index < sections.length - 1
                    ? "border-b border-[rgba(0,0,0,0.08)] pb-8 mb-8"
                    : ""
                }
              >
                <h2 className="text-2xl md:text-3xl font-bold text-[#0c0c0c] tracking-tight mb-4">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-[#484848] leading-relaxed mb-3 last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
