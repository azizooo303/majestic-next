import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/common/reveal";

export function ConsultationCta({ isAr }: { isAr: boolean }) {
  return (
    <section className="w-full bg-[#0c0c0c] py-16 md:py-24">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
              {isAr ? "مشروعك القادم — وفق مواصفاتك." : "Your next workspace, built to specification."}
            </h2>
            <p className="text-[#aaaaaa] text-base leading-relaxed mb-10">
              {isAr
                ? "من مكتب واحد إلى تجهيز طوابق متعددة — ماجيستيك تُنجز مشاريع بيئات العمل في المملكة العربية السعودية ودول الخليج."
                : "From a single office to a multi-floor fit-out — Majestic delivers complete workspace environments across Saudi Arabia and the GCC."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/quotation"
                className="btn-press inline-block border border-white text-white px-8 py-3.5 text-sm font-semibold rounded-sm hover:bg-white hover:text-[#0c0c0c] transition-colors"
              >
                {isAr ? "احجز استشارة" : "Book a Consultation"}
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-[#aaaaaa] hover:text-white transition-colors border-b border-[#484848] pb-0.5"
              >
                {isAr ? "زر المعرض" : "Visit the Showroom"}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
