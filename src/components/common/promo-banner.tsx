import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface PromoBannerProps {
  isAr: boolean;
  headline: string;
  body: string;
  cta: string;
  ctaHref: string;
}

export function PromoBanner({ isAr, headline, body, cta, ctaHref }: PromoBannerProps) {
  return (
    <section className="px-3 py-2 bg-[#D4D0C8]" aria-label="Promotional Banner">
      {/* Win2K window chrome */}
      <div
        className="mx-auto win2k-window"
        style={{ maxWidth: '1200px' }}
      >
        {/* Title bar */}
        <div className="win2k-titlebar px-2 py-0.5 text-xs flex items-center gap-1">
          <span>&#128161;</span>
          <span>{isAr ? "معلومات المنتج" : "Product Information"}</span>
          <div className="flex-1" />
          <div className="flex gap-1">
            <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px]">_</button>
            <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px]">&#9633;</button>
            <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px] font-bold">&#x2715;</button>
          </div>
        </div>

        {/* Content — two column */}
        <div className="flex flex-col md:flex-row bg-[#D4D0C8]">
          {/* Text side */}
          <div
            className={`flex flex-col justify-center p-5 md:w-[50%] bg-[#D4D0C8] ${isAr ? "md:order-2" : "md:order-1"}`}
            style={{
              borderRight: isAr ? 'none' : '1px solid #808080',
              borderLeft: isAr ? '1px solid #808080' : 'none',
            }}
          >
            {/* Win2K info icon + headline */}
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-xl"
                style={{
                  background: '#ECE9D8',
                  border: '2px solid #808080',
                  boxShadow: 'inset 1px 1px 0 #FFFFFF',
                }}
              >
                &#8505;
              </div>
              <div>
                <h2
                  className="text-base font-bold text-black leading-tight"
                  style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
                >
                  {headline}
                </h2>
              </div>
            </div>

            {/* Body in Win2K group box */}
            <div className="win2k-groupbox relative">
              <span className="absolute -top-2 left-2 bg-[#D4D0C8] px-1 text-xs font-bold text-black">
                {isAr ? "التفاصيل" : "Details"}
              </span>
              <p
                className="text-xs text-black leading-relaxed"
                style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
              >
                {body}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <Link
                href={ctaHref}
                className="win2k-btn-primary text-xs px-6 py-1.5 font-bold no-underline text-black inline-block text-center"
              >
                {cta}
              </Link>
              <Link
                href="/shop"
                className="win2k-btn text-xs px-6 py-1.5 no-underline text-black inline-block text-center"
              >
                {isAr ? "تسوق الآن" : "Shop Now"}
              </Link>
            </div>
          </div>

          {/* Image side */}
          <div
            className={`relative min-h-[260px] md:w-[50%] overflow-hidden ${isAr ? "md:order-1" : "md:order-2"}`}
            style={{
              background: '#ECE9D8',
              borderTop: '2px solid #FFFFFF',
            }}
          >
            <Image
              src="/images/hero-tables.jpg"
              alt="Office furniture"
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Win2K caption bar at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs text-black"
              style={{ background: '#D4D0C8', borderTop: '2px solid #FFFFFF' }}
            >
              {isAr ? "&#128247; معرض الصور — مجموعة ماجيستيك" : "&#128247; Gallery — Majestic Collection"}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          className="win2k-statusbar flex items-center gap-1 px-2 py-1"
          style={{ borderTop: '2px solid #FFFFFF' }}
        >
          <div className="win2k-raised px-2 py-0.5 text-xs">
            {isAr ? "مصمم في المملكة العربية السعودية" : "Designed for Saudi Arabia"}
          </div>
          <div className="flex-1" />
          <div className="win2k-raised px-2 py-0.5 text-xs">&#127760; thedeskco.net</div>
        </div>
      </div>
    </section>
  );
}
