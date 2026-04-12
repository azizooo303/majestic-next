import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { StaggerGrid } from "@/components/common/stagger-grid";

/* ------------------------------------------------------------------ */
/*  Footer — workspace.ae dark 5-column layout                         */
/* ------------------------------------------------------------------ */

export async function Footer() {
  const locale = await getLocale();
  const year = new Date().getFullYear();
  const isAr = locale === "ar";

  /* ── Column 1 — Brand ── */
  const colBrand = (
    <div className="col-span-2 md:col-span-3 lg:col-span-1">
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/images/majestic-logo-original.png"
          alt="Majestic Furniture"
          width={120}
          height={34}
          loading="lazy"
          style={{ width: "auto" }}
          className="h-8"
          onError={undefined}
        />
      </div>
      <p className="text-sm text-[#3A3A3A] leading-relaxed max-w-[210px]">
        {isAr
          ? "تورّد ماجستيك للأثاث بيئات عمل احترافية للعملاء في القطاعين الحكومي والخاص في المملكة العربية السعودية ودول الخليج."
          : "Majestic Furniture supplies professional workspace environments to corporate and government clients across Saudi Arabia and the Gulf."}
      </p>
      {/* Social links */}
      <div className="flex gap-5 mt-6">
        {[
          { label: "Instagram", href: "https://www.instagram.com/majesticarabia/" },
          { label: "LinkedIn", href: "https://www.linkedin.com/company/majestic-office-for-furniture/" },
          { label: "WhatsApp", href: "https://wa.me/96692001219" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="text-xs text-[#3A3A3A] hover:text-[#2C2C2C] transition-colors font-medium"
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );

  /* ── Column 2 — Shop ── */
  const colShop = (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-[#3A3A3A] mb-4 font-medium">
        {isAr ? "تسوق" : "Shop"}
      </h3>
      <ul className="space-y-2.5">
        {[
          { label: isAr ? "الكراسي" : "Seating", href: "/shop?category=seating" },
          { label: isAr ? "المكاتب" : "Desks", href: "/shop?category=tables" },
          { label: isAr ? "التخزين" : "Storage", href: "/shop?category=storage" },
          { label: isAr ? "محطات العمل" : "Workstations", href: "/shop?category=workstations" },
          { label: isAr ? "حلول الصوتيات" : "Acoustic Solutions", href: "/shop?category=acoustics" },
          { label: isAr ? "الاستقبال" : "Lounge", href: "/shop?category=lounge" },
          { label: isAr ? "الوافد الجديد" : "New Arrivals", href: "/shop?sort=new" },
          { label: isAr ? "تخفيضات" : "Sale", href: "/shop?sort=sale" },
        ].map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[#3A3A3A] hover:text-[#2C2C2C] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  /* ── Column 3 — Company ── */
  const colCompany = (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-[#3A3A3A] mb-4 font-medium">
        {isAr ? "الشركة" : "Company"}
      </h3>
      <ul className="space-y-2.5">
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
              className="text-sm text-[#3A3A3A] hover:text-[#2C2C2C] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  /* ── Column 4 — Support ── */
  const colSupport = (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-[#3A3A3A] mb-4 font-medium">
        {isAr ? "الدعم" : "Support"}
      </h3>
      <ul className="space-y-2.5">
        {[
          { label: isAr ? "الأسئلة الشائعة" : "FAQ", href: "/faq" },
          { label: isAr ? "تواصل معنا" : "Contact Us", href: "/contact" },
          { label: isAr ? "التوصيل والإرجاع" : "Delivery & Returns", href: "/delivery" },
          { label: isAr ? "العناية بالمنتج" : "Product Care", href: "/product-care" },
          { label: isAr ? "الضمان" : "Warranty", href: "/warranty" },
          { label: isAr ? "تتبع طلبك" : "Track Your Order", href: "/track-order" },
        ].map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[#3A3A3A] hover:text-[#2C2C2C] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  /* ── Column 5 — Contact ── */
  const colContact = (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-[#3A3A3A] mb-4 font-medium">
        {isAr ? "تواصل" : "Contact"}
      </h3>
      <address className="not-italic space-y-2.5">
        <p className="text-sm text-[#3A3A3A]">
          {isAr
            ? "أركيد سنتر، الرشيدية، الرياض"
            : "Arcade Centre, Al Rashidiah, Riyadh"}
        </p>
        <a
          href="tel:+96692001219"
          className="block text-sm text-[#3A3A3A] hover:text-[#2C2C2C] transition-colors"
        >
          +966 9200 12019
        </a>
        <a
          href="mailto:info@majestic.com.sa"
          className="block text-sm text-[#3A3A3A] hover:text-[#2C2C2C] transition-colors"
        >
          info@majestic.com.sa
        </a>
        <p className="text-sm text-[#3A3A3A]">
          {isAr ? "الأحد–الخميس، ٩ص–٩م" : "Sun–Thu 9am–9pm"}
        </p>
      </address>
    </div>
  );

  const columns = [colBrand, colShop, colCompany, colSupport, colContact];

  return (
    <footer className="bg-white border-t border-[#D4D4D4]">
      {/* Main grid */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-14 md:py-16">
        <StaggerGrid
          stagger={0.07}
          isRTL={isAr}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6"
        >
          {columns}
        </StaggerGrid>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#D4D4D4]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#3A3A3A]">
            &copy; {year} {isAr ? "ماجستيك للأثاث. جميع الحقوق محفوظة." : "Majestic Furniture. All rights reserved."}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-[#3A3A3A] hover:text-[#2C2C2C] transition-colors"
            >
              {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <span className="text-[#D4D4D4] text-xs">|</span>
            <Link
              href="/terms"
              className="text-xs text-[#3A3A3A] hover:text-[#2C2C2C] transition-colors"
            >
              {isAr ? "شروط الخدمة" : "Terms of Service"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
