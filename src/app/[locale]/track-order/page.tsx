import type { Metadata } from "next";
import { Reveal } from "@/components/common/reveal";
import { Link } from "@/i18n/navigation";
import { TrackForm } from "@/components/support/track-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "تتبع طلبك" : "Track Your Order",
    robots: { index: false, follow: false },
  };
}

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <main className="flex-1 pt-20 bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-[rgba(0,0,0,0.08)] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#484848] mb-3">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            {" / "}
            {isAr ? "تتبع طلبك" : "Track Your Order"}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            {isAr ? "تتبع طلبك" : "Track Your Order"}
          </h1>
          <p className="text-[#484848] text-sm mt-3 max-w-md">
            {isAr
              ? "أدخل رقم طلبك وبريدك الإلكتروني لمتابعة حالة توصيلك."
              : "Enter your order number and email to check the status of your delivery."}
          </p>
        </div>
      </section>

      {/* Tracking form */}
      <section className="py-16 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <Reveal>
              <TrackForm isAr={isAr} />
            </Reveal>

            {/* Help text */}
            <Reveal>
              <div className="mt-8 text-center">
                <p className="text-sm text-[#484848]">
                  {isAr ? "هل تحتاج مساعدة بشأن طلبك؟ " : "Need help with your order? "}
                  <a
                    href="mailto:support@majestic.com.sa"
                    className="text-gray-900 font-semibold underline underline-offset-2 hover:text-[#484848] transition-colors"
                  >
                    support@majestic.com.sa
                  </a>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
