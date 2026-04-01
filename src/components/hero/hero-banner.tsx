import Image from "next/image";
import { Link } from "@/i18n/navigation";

export interface HeroSlide {
  image: string;
  mobileImage?: string;
  alt: string;
  headline: string;
  tagline?: string;
  collection?: string;
  cta: string;
  href: string;
  locale?: string;
}

export function HeroBanner({ slide }: { slide: HeroSlide }) {
  const isAr = slide.locale === "ar";

  return (
    <section className="w-full p-3 bg-[#D4D0C8]" aria-label="Hero Banner">
      {/* Outer Win2K window chrome */}
      <div
        className="win2k-window mx-auto"
        style={{ maxWidth: '1200px' }}
      >
        {/* Title bar */}
        <div className="win2k-titlebar">
          <div
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #FFCC00 0%, #FF6600 50%, #FF0000 100%)',
              border: '1px solid #000',
            }}
          />
          <span>
            {isAr ? "معرض ماجيستيك — المنتجات المميزة" : "Majestic Furniture — Featured Collection"}
          </span>
          <div className="flex-1" />
          <div className="flex gap-1">
            <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px]">_</button>
            <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px]">&#9633;</button>
            <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px] font-bold">&#x2715;</button>
          </div>
        </div>

        {/* Menu bar of the "app" */}
        <div
          className="flex items-center px-2 py-0.5 bg-[#D4D0C8] text-xs gap-1"
          style={{ borderBottom: '1px solid #808080', borderTop: '1px solid #FFFFFF' }}
        >
          <button className="win2k-menu-item">File</button>
          <button className="win2k-menu-item">View</button>
          <button className="win2k-menu-item">Favourites</button>
          <button className="win2k-menu-item">Tools</button>
          <button className="win2k-menu-item">Help</button>
        </div>

        {/* Main content — two pane layout */}
        <div className="flex flex-col md:flex-row min-h-[420px] bg-[#D4D0C8]">
          {/* Left panel — text content */}
          <div
            className={`flex flex-col justify-between p-4 md:w-[40%] bg-[#D4D0C8] ${isAr ? "md:order-2" : "md:order-1"}`}
            style={{ borderRight: isAr ? 'none' : '2px solid #808080', borderLeft: isAr ? '2px solid #808080' : 'none' }}
          >
            {/* Icon + title */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {/* Simulated file/folder icon */}
                <div
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-sm"
                  style={{
                    background: '#ECE9D8',
                    border: '1px solid #808080',
                    boxShadow: 'inset 1px 1px 0 #FFFFFF'
                  }}
                >
                  &#128196;
                </div>
                <div>
                  <p className="text-xs text-[#555] uppercase tracking-wider font-bold">
                    {slide.collection || (isAr ? "المجموعة المميزة" : "Featured Collection")}
                  </p>
                </div>
              </div>

              {/* Win2K group box for headline */}
              <div className="win2k-groupbox relative mt-4">
                <span
                  className="absolute -top-2 left-2 bg-[#D4D0C8] px-1 text-xs font-bold text-black"
                >
                  {isAr ? "وصف المنتج" : "Product Description"}
                </span>
                <h1
                  className="text-2xl md:text-3xl font-bold text-black leading-tight"
                  style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
                >
                  {slide.headline}
                </h1>
                {slide.tagline && (
                  <p className="text-xs text-[#555] mt-2 leading-relaxed">
                    {slide.tagline}
                  </p>
                )}
              </div>

              {/* Properties-style info table */}
              <div
                className="mt-3 win2k-sunken bg-white text-xs"
              >
                <div
                  className="flex"
                  style={{ borderBottom: '1px solid #C0C0C0' }}
                >
                  <span
                    className="w-1/2 px-2 py-1 font-bold bg-[#ECE9D8] border-r border-[#C0C0C0]"
                  >
                    {isAr ? "الشركة" : "Company"}
                  </span>
                  <span className="w-1/2 px-2 py-1">Majestic Furniture</span>
                </div>
                <div
                  className="flex"
                  style={{ borderBottom: '1px solid #C0C0C0' }}
                >
                  <span className="w-1/2 px-2 py-1 font-bold bg-[#ECE9D8] border-r border-[#C0C0C0]">
                    {isAr ? "الموقع" : "Location"}
                  </span>
                  <span className="w-1/2 px-2 py-1">{isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}</span>
                </div>
                <div className="flex">
                  <span className="w-1/2 px-2 py-1 font-bold bg-[#ECE9D8] border-r border-[#C0C0C0]">
                    {isAr ? "الموقع الإلكتروني" : "Website"}
                  </span>
                  <span className="w-1/2 px-2 py-1 text-[#0000FF] underline">thedeskco.net</span>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-2 mt-4">
              <Link
                href={slide.href}
                className="win2k-btn-primary text-xs px-5 py-1.5 font-bold no-underline text-black inline-block text-center"
              >
                {slide.cta}
              </Link>
              <Link
                href="/contact"
                className="win2k-btn text-xs px-5 py-1.5 no-underline text-black inline-block text-center"
              >
                {isAr ? "تواصل معنا" : "Contact Us"}
              </Link>
            </div>

            {/* Status bar */}
            <div
              className="mt-3 flex items-center gap-1 text-xs text-black"
              style={{ borderTop: '1px solid #808080', paddingTop: '4px' }}
            >
              <div
                className="win2k-raised px-2 py-0.5 text-xs"
              >
                {isAr ? "&#127760; متاح الآن" : "&#127760; Available Now"}
              </div>
              <div className="flex-1" />
              <div className="win2k-raised px-2 py-0.5 text-xs">
                {isAr ? "شحن مجاني" : "Free Delivery"}
              </div>
            </div>
          </div>

          {/* Right panel — image */}
          <div
            className={`relative flex-1 min-h-[260px] md:min-h-[420px] overflow-hidden bg-[#ECE9D8] ${isAr ? "md:order-1" : "md:order-2"}`}
            style={{
              borderTop: '2px solid #FFFFFF',
              borderLeft: isAr ? '2px solid #FFFFFF' : 'none',
              borderRight: isAr ? 'none' : '2px solid #FFFFFF',
            }}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            {/* Win2K image toolbar overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 flex items-center gap-1 px-2 py-1"
              style={{
                background: '#D4D0C8',
                borderTop: '2px solid #FFFFFF',
              }}
            >
              <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs">&#8592;</button>
              <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs">&#8594;</button>
              <div className="flex-1" />
              <span className="text-xs text-black">1 / 1</span>
              <div className="flex-1" />
              <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs">&#128269;+</button>
              <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs">&#128269;-</button>
              <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs">&#9974;</button>
            </div>
          </div>
        </div>

        {/* Window status bar */}
        <div
          className="flex items-center gap-1 px-2 py-1 bg-[#D4D0C8] text-xs text-black"
          style={{ borderTop: '2px solid #FFFFFF' }}
        >
          <div className="win2k-raised px-3 py-0.5 text-xs flex-shrink-0">
            {isAr ? "جاهز" : "Ready"}
          </div>
          <div className="win2k-raised px-3 py-0.5 text-xs flex-1">
            {isAr ? "١ عنصر | مجموعة ماجيستيك" : "1 object(s) | Majestic Collection"}
          </div>
          <div className="win2k-raised px-3 py-0.5 text-xs flex-shrink-0">
            {isAr ? "الرياض" : "Riyadh, SA"}
          </div>
        </div>
      </div>
    </section>
  );
}
