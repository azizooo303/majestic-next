import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

/* ------------------------------------------------------------------ */
/*  Footer — Windows 2000 Taskbar + System Tray style                  */
/* ------------------------------------------------------------------ */

export async function Footer() {
  const locale = await getLocale();
  const year = new Date().getFullYear();
  const isAr = locale === "ar";

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <footer className="bg-[#D4D0C8]" style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}>
      {/* Main content area — Win2K window panels */}
      <div
        className="px-3 py-3"
        style={{ borderTop: '2px solid #FFFFFF', borderBottom: '1px solid #808080' }}
      >
        <div
          className="mx-auto win2k-window"
          style={{ maxWidth: '1200px' }}
        >
          {/* Title bar */}
          <div className="win2k-titlebar px-2 py-0.5 text-xs flex items-center gap-1">
            <span>&#128196;</span>
            <span>{isAr ? "ماجيستيك للأثاث — معلومات الاتصال والروابط" : "Majestic Furniture — Site Links & Contact"}</span>
          </div>

          {/* 5-column grid inside sunken panel */}
          <div
            className="m-2"
            style={{
              background: '#ECE9D8',
              border: '2px solid #808080',
              boxShadow: 'inset 1px 1px 0 #404040, inset -1px -1px 0 #FFFFFF',
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0">

              {/* Column 1 — Brand */}
              <div
                className="p-3 col-span-2 md:col-span-3 lg:col-span-1"
                style={{ borderRight: '1px solid #808080' }}
              >
                <div className="mb-2">
                  <Image
                    src="/images/majestic-logo-original.png"
                    alt="Majestic Furniture"
                    width={100}
                    height={28}
                    loading="lazy"
                    style={{ width: "auto" }}
                    className="h-7"
                  />
                </div>
                <p className="text-[10px] text-black leading-relaxed mb-3">
                  {isAr
                    ? "أثاث مكتبي احترافي لبيئة العمل الحديثة"
                    : "Premium Office Furniture for the Modern Workplace"}
                </p>
                {/* Win2K social links styled as file shortcuts */}
                <div className="flex flex-col gap-1">
                  {[
                    { label: "Instagram", href: "https://instagram.com" },
                    { label: "LinkedIn", href: "https://linkedin.com" },
                    { label: "Facebook", href: "https://facebook.com" },
                    { label: "X (Twitter)", href: "https://x.com" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#0000FF] underline hover:text-[#800080] flex items-center gap-1"
                    >
                      <span className="text-[9px]">&#128279;</span>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Column 2 — Shop */}
              <div className="p-3" style={{ borderRight: '1px solid #808080' }}>
                <p className="text-[10px] font-bold text-black uppercase tracking-wide mb-2">
                  {isAr ? "تسوق" : "Shop"}
                </p>
                <ul className="space-y-1">
                  {[
                    { label: isAr ? "الكراسي" : "Seating", href: "/shop?category=seating" },
                    { label: isAr ? "المكاتب" : "Desks", href: "/shop?category=tables" },
                    { label: isAr ? "التخزين" : "Storage", href: "/shop?category=storage" },
                    { label: isAr ? "محطات العمل" : "Workstations", href: "/shop?category=workstations" },
                    { label: isAr ? "الصوتيات" : "Acoustics", href: "/shop?category=acoustics" },
                    { label: isAr ? "الاستقبال" : "Lounge", href: "/shop?category=lounge" },
                    { label: isAr ? "الوافد الجديد" : "New Arrivals", href: "/shop?sort=new" },
                    { label: isAr ? "تخفيضات" : "Sale", href: "/shop?sort=sale" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[10px] text-[#0000FF] underline hover:text-[#800080] flex items-center gap-1"
                      >
                        <span className="text-[9px]">&#128196;</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3 — Company */}
              <div className="p-3" style={{ borderRight: '1px solid #808080' }}>
                <p className="text-[10px] font-bold text-black uppercase tracking-wide mb-2">
                  {isAr ? "الشركة" : "Company"}
                </p>
                <ul className="space-y-1">
                  {[
                    { label: isAr ? "من نحن" : "About Us", href: "/about" },
                    { label: isAr ? "مشاريعنا" : "Projects", href: "/projects" },
                    { label: isAr ? "العلامات التجارية" : "Brands", href: "/brands" },
                    { label: isAr ? "المعارض" : "Showrooms", href: "/showrooms" },
                    { label: isAr ? "وظائف" : "Careers", href: "/careers" },
                    { label: isAr ? "المدونة" : "Blog", href: "/blog" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[10px] text-[#0000FF] underline hover:text-[#800080] flex items-center gap-1"
                      >
                        <span className="text-[9px]">&#128196;</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4 — Support */}
              <div className="p-3" style={{ borderRight: '1px solid #808080' }}>
                <p className="text-[10px] font-bold text-black uppercase tracking-wide mb-2">
                  {isAr ? "الدعم" : "Support"}
                </p>
                <ul className="space-y-1">
                  {[
                    { label: isAr ? "الأسئلة الشائعة" : "FAQ", href: "/faq" },
                    { label: isAr ? "تواصل معنا" : "Contact Us", href: "/contact" },
                    { label: isAr ? "التوصيل والإرجاع" : "Delivery & Returns", href: "/delivery" },
                    { label: isAr ? "العناية بالمنتج" : "Product Care", href: "/product-care" },
                    { label: isAr ? "الضمان" : "Warranty", href: "/warranty" },
                    { label: isAr ? "تتبع طلبك" : "Track Order", href: "/track-order" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[10px] text-[#0000FF] underline hover:text-[#800080] flex items-center gap-1"
                      >
                        <span className="text-[9px]">&#128196;</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 5 — Contact */}
              <div className="p-3">
                <p className="text-[10px] font-bold text-black uppercase tracking-wide mb-2">
                  {isAr ? "تواصل" : "Contact"}
                </p>
                <address className="not-italic space-y-1.5">
                  <p className="text-[10px] text-black flex items-start gap-1">
                    <span>&#128205;</span>
                    {isAr ? "أركيد سنتر، الرشيدية، الرياض" : "Arcade Centre, Al Rashidiah, Riyadh"}
                  </p>
                  <a
                    href="tel:+96692001219"
                    className="text-[10px] text-[#0000FF] underline flex items-center gap-1 hover:text-[#800080]"
                  >
                    <span>&#128222;</span>
                    +966 9200 12019
                  </a>
                  <a
                    href="mailto:info@majestic.com.sa"
                    className="text-[10px] text-[#0000FF] underline flex items-center gap-1 hover:text-[#800080]"
                  >
                    <span>&#128140;</span>
                    info@majestic.com.sa
                  </a>
                  <p className="text-[10px] text-black flex items-center gap-1">
                    <span>&#128336;</span>
                    {isAr ? "الأحد–الخميس، ٩ص–٥م" : "Sun–Thu 9am–5pm"}
                  </p>
                </address>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Win2K Taskbar — the bottom bar */}
      <div
        className="bg-[#D4D0C8] px-2 py-1 flex items-center gap-2"
        style={{
          borderTop: '2px solid #FFFFFF',
          borderBottom: '2px solid #404040',
          minHeight: '32px',
        }}
      >
        {/* Start button */}
        <button
          className="win2k-btn-primary !min-w-0 flex items-center gap-1 px-3 py-0.5 text-xs font-bold"
        >
          <div
            className="w-4 h-4 flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #00CC00 0%, #0000FF 50%, #FF0000 100%)',
              border: '1px solid #000',
            }}
          />
          {isAr ? "ابدأ" : "Start"}
        </button>

        {/* Vertical separator */}
        <div style={{ borderLeft: '1px solid #808080', borderRight: '1px solid #FFFFFF', height: '20px', width: '2px' }} />

        {/* Running "app" items in taskbar */}
        <div
          className="win2k-raised px-3 py-0.5 text-xs text-black flex items-center gap-1 flex-shrink-0 hidden sm:flex"
          style={{ minWidth: '120px', maxWidth: '180px' }}
        >
          <span>&#128196;</span>
          <span className="truncate">Majestic.exe</span>
        </div>

        {/* Copyright in taskbar */}
        <p className="text-[10px] text-black px-2 hidden md:block">
          &copy; {year} Majestic.{" "}
          {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          {" | "}
          <Link href="/privacy" className="text-[#0000FF] underline hover:text-[#800080] text-[10px]">
            {isAr ? "الخصوصية" : "Privacy"}
          </Link>
          {" | "}
          <Link href="/terms" className="text-[#0000FF] underline hover:text-[#800080] text-[10px]">
            {isAr ? "الشروط" : "Terms"}
          </Link>
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* System tray */}
        <div
          className="flex items-center gap-1 px-2 py-0.5"
          style={{
            background: '#D4D0C8',
            borderTop: '1px solid #808080',
            borderLeft: '1px solid #808080',
            borderRight: '1px solid #FFFFFF',
            borderBottom: '1px solid #FFFFFF',
          }}
        >
          <span className="text-[10px]">&#127760;</span>
          <span className="text-[10px]">&#128266;</span>
          <span className="text-[10px] text-black font-mono ml-1">{timeStr}</span>
        </div>
      </div>
    </footer>
  );
}
