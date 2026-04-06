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
    title: isAr ? "سياسة الخصوصية" : "Privacy Policy",
    robots: { index: false, follow: false },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const sections = isAr
    ? [
        {
          id: "collect",
          heading: "المعلومات التي نجمعها",
          paragraphs: [
            "نجمع المعلومات التي تقدمها لنا مباشرة عند إنشاء حساب أو تقديم طلب، بما في ذلك الاسم وعنوان البريد الإلكتروني ورقم الهاتف وعنوان التسليم.",
            "نجمع أيضاً بيانات تلقائية عند تصفح الموقع مثل عنوان IP ونوع المتصفح وصفحات الزيارة والوقت المستغرق على كل صفحة.",
            "يمكن أن تشمل المعلومات المالية تفاصيل بطاقة الدفع المُعالَجة عبر مزودي خدمة الدفع الآمنين؛ ولا نخزن أرقام البطاقات الكاملة على خوادمنا.",
          ],
        },
        {
          id: "use",
          heading: "كيف نستخدم معلوماتك",
          paragraphs: [
            "نستخدم معلوماتك لمعالجة الطلبات وإدارة حسابك والتواصل معك بشأن مشترياتك وتقديم الدعم عند الحاجة.",
            "نحسّن خدماتنا وموقعنا الإلكتروني باستمرار استناداً إلى أنماط الاستخدام والتعليقات التي نتلقاها، مع الحفاظ على خصوصيتك في جميع الأوقات.",
            "قد نرسل إليك رسائل بريد إلكتروني تتعلق بطلباتك أو مجموعاتنا الجديدة إذا أعطيتنا موافقتك المسبقة.",
          ],
        },
        {
          id: "sharing",
          heading: "مشاركة البيانات",
          paragraphs: [
            "نحن لا نبيع بياناتك الشخصية إلى أي طرف ثالث بأي شكل من الأشكال.",
            "نشارك المعلومات الضرورية فقط مع شركاء التوصيل المعتمدين لإتمام عمليات التسليم إلى عنوانك.",
            "قد نفصح عن بياناتك عند الضرورة القانونية أو الامتثال لأوامر المحاكم وفقاً لأنظمة المملكة العربية السعودية.",
          ],
        },
        {
          id: "cookies",
          heading: "ملفات تعريف الارتباط",
          paragraphs: [
            "نستخدم ملفات تعريف الارتباط للجلسة للحفاظ على حالة تسجيل دخولك وسلة التسوق خلال فترة تصفحك.",
            "تُستخدم ملفات تعريف الارتباط التحليلية لفهم كيفية تفاعل الزوار مع الموقع وتحسين تجربة الاستخدام.",
            "يمكنك إيقاف تشغيل ملفات تعريف الارتباط من خلال إعدادات المتصفح، علماً بأن ذلك قد يؤثر على بعض وظائف الموقع.",
          ],
        },
        {
          id: "rights",
          heading: "حقوقك",
          paragraphs: [
            "يحق لك الاطلاع على بياناتك الشخصية التي نحتفظ بها وطلب نسخة منها في أي وقت.",
            "يمكنك طلب تصحيح أي معلومات غير دقيقة أو حذف بياناتك الشخصية، وسنستجيب لطلبك خلال 30 يوماً.",
            "لممارسة أي من هذه الحقوق، يرجى التواصل معنا عبر البريد الإلكتروني المخصص للخصوصية.",
          ],
        },
        {
          id: "contact",
          heading: "التواصل معنا",
          paragraphs: [
            "إذا كانت لديك أي استفسارات حول سياسة الخصوصية أو رغبت في ممارسة حقوقك، يمكنك التواصل مع فريق الخصوصية لدينا.",
            "البريد الإلكتروني: privacy@majestic.com.sa — نلتزم بالرد على جميع الاستفسارات خلال يومي عمل.",
          ],
        },
      ]
    : [
        {
          id: "collect",
          heading: "Information We Collect",
          paragraphs: [
            "We collect information you provide directly when creating an account or placing an order, including your name, email address, phone number, and delivery address.",
            "We also collect data automatically as you browse our site, such as IP address, browser type, pages visited, and time spent on each page.",
            "Financial information including payment card details is processed through secure payment service providers; we do not store full card numbers on our servers.",
          ],
        },
        {
          id: "use",
          heading: "How We Use Your Information",
          paragraphs: [
            "We use your information to process orders, manage your account, communicate with you about your purchases, and provide support when needed.",
            "We continuously improve our services and website based on usage patterns and feedback we receive, while maintaining your privacy at all times.",
            "We may send you emails related to your orders or our new collections if you have given us your prior consent.",
          ],
        },
        {
          id: "sharing",
          heading: "Data Sharing",
          paragraphs: [
            "We do not sell your personal data to any third party in any form.",
            "We share only necessary information with approved delivery partners to complete deliveries to your address.",
            "We may disclose your data when legally required or to comply with court orders in accordance with the regulations of the Kingdom of Saudi Arabia.",
          ],
        },
        {
          id: "cookies",
          heading: "Cookies",
          paragraphs: [
            "We use session cookies to maintain your login state and shopping cart during your browsing session.",
            "Analytics cookies are used to understand how visitors interact with the site and to improve the user experience.",
            "You can disable cookies through your browser settings, though this may affect some site functionality.",
          ],
        },
        {
          id: "rights",
          heading: "Your Rights",
          paragraphs: [
            "You have the right to access the personal data we hold about you and request a copy at any time.",
            "You may request correction of any inaccurate information or deletion of your personal data, and we will respond to your request within 30 days.",
            "To exercise any of these rights, please contact us via the dedicated privacy email below.",
          ],
        },
        {
          id: "contact",
          heading: "Contact",
          paragraphs: [
            "If you have any questions about this privacy policy or wish to exercise your rights, please reach out to our privacy team.",
            "Email: privacy@majestic.com.sa — We are committed to responding to all inquiries within two business days.",
          ],
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
            {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900]">
            {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
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
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900] tracking-tight mb-4">
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
