"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  NAV CONFIG                                                         */
/* ------------------------------------------------------------------ */

interface NavChild {
  key: string;
  href: string;
}

interface NavItem {
  key: string;
  href: string;
  mega?: boolean;
  children?: NavChild[];
}

const NAV_ITEMS: NavItem[] = [
  {
    key: "chairs",
    href: "/shop?category=seating",
    children: [
      { key: "executiveChairs", href: "/shop?category=executive-chairs" },
      { key: "taskChairs", href: "/shop?category=task-chairs" },
      { key: "meetingChairs", href: "/shop?category=meeting-chairs" },
      { key: "lounge", href: "/shop?category=lounge-chairs" },
    ],
  },
  {
    key: "desks",
    href: "/shop?category=tables",
    mega: true,
    children: [
      { key: "executiveDesks", href: "/shop?category=executive-desks" },
      { key: "workstations", href: "/shop?category=workstations" },
      { key: "heightAdjustable", href: "/shop?category=height-adjustable" },
      { key: "accessories", href: "/shop?category=accessories" },
      { key: "meetingTables", href: "/shop?category=meeting-tables" },
      { key: "receptionDesk", href: "/shop?category=reception" },
    ],
  },
  { key: "storage", href: "/shop?category=storage" },
  { key: "lounge", href: "/shop?category=lounge" },
  { key: "acoustics", href: "/shop?category=acoustics" },
  { key: "accessories", href: "/shop?category=accessories" },
];

const SECONDARY_NAV: NavItem[] = [
  { key: "inspirations", href: "/inspirations" },
  { key: "eQuotation", href: "/quotation" },
];

/* ------------------------------------------------------------------ */
/*  SEARCH MODAL                                                       */
/* ------------------------------------------------------------------ */

function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Win2K dialog window */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-[420px] win2k-window">
        {/* Title bar */}
        <div className="win2k-titlebar">
          <span className="text-xs">&#128269;</span>
          <span>Search Products</span>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs font-bold leading-4"
            aria-label="Close search"
          >
            &#x2715;
          </button>
        </div>
        {/* Content area */}
        <div className="p-4 bg-[#D4D0C8]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-xs text-black font-normal" htmlFor="win2k-search-input">
              {locale === "ar" ? "ابحث عن المنتجات:" : "Search for products:"}
            </label>
            <input
              id="win2k-search-input"
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={locale === "ar" ? "اكتب هنا..." : "Type here..."}
              className="win2k-sunken bg-white text-black text-xs px-2 py-1 outline-none w-full"
            />
            <div className="flex gap-2 justify-end mt-1">
              <button type="submit" className="win2k-btn-primary text-xs px-4 py-1">
                {locale === "ar" ? "بحث" : "Search"}
              </button>
              <button type="button" onClick={onClose} className="win2k-btn text-xs px-4 py-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  HEADER                                                             */
/* ------------------------------------------------------------------ */

export const HEADER_HEIGHT = 100;

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#0A246A] focus:text-white focus:font-medium"
      >
        Skip to content
      </a>

      <header className="fixed top-0 w-full z-50 bg-[#D4D0C8]" style={{ borderBottom: '2px solid #404040' }}>
        {/* ── Row 1: Title Bar (branding) ── */}
        <div className="win2k-titlebar px-3 py-1.5 flex items-center gap-2">
          {/* Tiny pixel-art window icon placeholder */}
          <div className="w-4 h-4 flex-shrink-0" style={{
            background: 'linear-gradient(135deg, #FFCC00 0%, #FF6600 50%, #FF0000 100%)',
            border: '1px solid #000'
          }} />
          <span className="text-white text-xs font-bold tracking-wide">
            Majestic Furniture — Premium Office Solutions
          </span>
          <div className="flex-1" />
          {/* Classic Win2K window control buttons */}
          <div className="flex gap-1">
            <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px]" aria-label="Minimize">_</button>
            <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px]" aria-label="Maximize">&#9633;</button>
            <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px] font-bold" aria-label="Close">&#x2715;</button>
          </div>
        </div>

        {/* ── Row 2: Classic menu bar ── */}
        <div className="bg-[#D4D0C8]" style={{ borderBottom: '1px solid #808080' }}>
          <div className="flex items-center px-2" style={{ borderTop: '1px solid #FFFFFF' }}>
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 mr-4 py-1">
              <Image
                src="/images/majestic-logo-original.png"
                alt="Majestic Furniture"
                width={120}
                height={34}
                style={{ width: "auto" }}
                className="h-8"
                priority
              />
            </Link>

            {/* Vertical separator */}
            <div className="w-0.5 h-6 mr-2 flex-shrink-0" style={{
              borderLeft: '1px solid #808080',
              borderRight: '1px solid #FFFFFF'
            }} />

            {/* Menu bar items */}
            <nav className="hidden lg:flex items-center flex-1" aria-label="Main navigation">
              {/* File / Home menu */}
              <DesktopNavItem item={{ key: "home", href: "/" }} pathname={pathname} t={t} />
              {NAV_ITEMS.map((item) => (
                <DesktopNavItem
                  key={item.key}
                  item={item}
                  pathname={pathname}
                  t={t}
                />
              ))}
              {SECONDARY_NAV.map((item) => (
                <DesktopNavItem
                  key={item.key}
                  item={item}
                  pathname={pathname}
                  t={t}
                />
              ))}
            </nav>

            <div className="flex-1 lg:flex-none" />

            {/* Right side utility icons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="win2k-btn !min-w-0 !px-2 !py-0.5 text-xs hidden sm:flex items-center gap-1"
                aria-label={locale === "ar" ? "بحث" : "Search"}
              >
                <span>&#128269;</span>
                <span className="hidden md:inline">{locale === "ar" ? "بحث" : "Search"}</span>
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="win2k-btn !min-w-0 !px-2 !py-0.5 text-xs flex items-center gap-1 no-underline text-black"
                aria-label={locale === "ar" ? "السلة" : "Cart"}
              >
                <span>&#128717;</span>
                <span className="text-xs font-bold">(0)</span>
              </Link>

              {/* Language toggle */}
              <LanguageToggle />

              {/* Mobile hamburger */}
              <button
                className="lg:hidden win2k-btn !min-w-0 !px-2 !py-0.5 text-xs"
                onClick={() => setIsMobileOpen(true)}
                aria-label="Open menu"
              >
                &#9776;
              </button>
            </div>
          </div>
        </div>

        {/* ── Row 3: Address bar (utility links) ── */}
        <div className="hidden md:flex items-center bg-[#D4D0C8] px-2 py-0.5 gap-1 text-xs"
          style={{ borderTop: '1px solid #FFFFFF', borderBottom: '1px solid #808080' }}>
          <span className="text-black font-normal mr-1">Address:</span>
          <div className="win2k-sunken flex-1 bg-white px-2 py-0.5 flex items-center gap-2 max-w-xs">
            <span className="text-xs text-[#0000FF]">&#127760;</span>
            <span className="text-xs text-[#0000FF] underline truncate">https://majestic.com.sa/en</span>
          </div>
          <div className="flex-1" />
          <Link href="/showrooms" className="win2k-menu-item text-xs">{t("nav.showrooms")}</Link>
          <div style={{ borderLeft: '1px solid #808080', borderRight: '1px solid #FFFFFF', height: '14px', width: '2px' }} />
          <Link href="/warranty" className="win2k-menu-item text-xs">{t("nav.warranty")}</Link>
          <div style={{ borderLeft: '1px solid #808080', borderRight: '1px solid #FFFFFF', height: '14px', width: '2px' }} />
          <Link href="/contact" className="win2k-menu-item text-xs">Help</Link>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        t={t}
        pathname={pathname}
        locale={locale}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  DESKTOP NAV ITEM                                                   */
/* ------------------------------------------------------------------ */

function DesktopNavItem({
  item,
  pathname,
  t,
}: {
  item: NavItem;
  pathname: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const open = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 120);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const hasChildren = item.children && item.children.length > 0;
  const isActive =
    pathname === item.href ||
    (hasChildren && item.children!.some((c) => pathname === c.href));

  // Special label for "home"
  const label = item.key === "home" ? "Home" : t(`nav.${item.key}`);

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className={cn(
          "win2k-menu-item text-xs whitespace-nowrap",
          isActive && "bg-[#0A246A] text-white"
        )}
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={open} onMouseLeave={close}>
      <button
        className={cn(
          "win2k-menu-item text-xs whitespace-nowrap flex items-center gap-0.5",
          isActive && "bg-[#0A246A] text-white",
          isOpen && "bg-[#0A246A] text-white"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <span className="text-[9px] ml-0.5">&#9660;</span>
      </button>

      {isOpen && (
        <DropdownMenu
          item={item}
          t={t}
          pathname={pathname}
          onMouseEnter={open}
          onMouseLeave={close}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DROPDOWN MENU                                                      */
/* ------------------------------------------------------------------ */

function DropdownMenu({
  item,
  t,
  pathname,
  onMouseEnter,
  onMouseLeave,
}: {
  item: NavItem;
  t: ReturnType<typeof useTranslations>;
  pathname: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="absolute top-full start-0 z-50 min-w-[160px]"
      style={{
        background: '#D4D0C8',
        borderTop: '2px solid #FFFFFF',
        borderLeft: '2px solid #FFFFFF',
        borderRight: '2px solid #404040',
        borderBottom: '2px solid #404040',
        boxShadow: '2px 2px 4px rgba(0,0,0,0.4)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Menu header */}
      <div style={{ borderBottom: '1px solid #808080', background: '#D4D0C8' }} className="px-2 py-0.5">
        <span className="text-xs font-bold text-black">{t(`nav.${item.key}`)}</span>
      </div>
      {item.children!.map((child, i) => (
        <Link
          key={child.key}
          href={child.href}
          className={cn(
            "block px-4 py-1 text-xs",
            i > 0 && "border-t border-[#C0C0C0]",
            pathname === child.href
              ? "bg-[#0A246A] text-white"
              : "text-black hover:bg-[#0A246A] hover:text-white"
          )}
        >
          {t(`nav.${child.key}`)}
        </Link>
      ))}
      {/* View All separator + link */}
      <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #FFFFFF' }} className="my-0.5" />
      <Link
        href={item.href}
        className="block px-4 py-1 text-xs text-black hover:bg-[#0A246A] hover:text-white font-bold"
      >
        View All &rsaquo;
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LANGUAGE TOGGLE                                                    */
/* ------------------------------------------------------------------ */

function LanguageToggle() {
  const pathname = usePathname();
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <Link
      href={pathname}
      locale={isAr ? "en" : "ar"}
      className="win2k-btn !min-w-0 !px-2 !py-0.5 text-xs hidden sm:flex items-center gap-0.5 no-underline text-black"
    >
      <span>&#127760;</span>
      <span>{isAr ? "EN" : "AR"}</span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  MOBILE DRAWER                                                      */
/* ------------------------------------------------------------------ */

function MobileDrawer({
  isOpen,
  onClose,
  t,
  pathname,
  locale,
}: {
  isOpen: boolean;
  onClose: () => void;
  t: ReturnType<typeof useTranslations>;
  pathname: string;
  locale: string;
}) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const toggleExpand = (key: string) => {
    setExpandedKey(expandedKey === key ? null : key);
  };

  const allNavItems = [...NAV_ITEMS, ...SECONDARY_NAV];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer — Win2K window panel */}
      <div
        className={cn(
          "fixed top-0 z-50 h-full w-72 max-w-[85vw] transition-transform duration-200 ease-out lg:hidden flex flex-col",
          "end-0",
          isOpen
            ? "translate-x-0"
            : "ltr:translate-x-full rtl:-translate-x-full"
        )}
        style={{
          background: '#D4D0C8',
          borderLeft: '2px solid #FFFFFF',
          borderTop: '2px solid #FFFFFF',
          boxShadow: '4px 4px 8px rgba(0,0,0,0.5)',
        }}
      >
        {/* Drawer title bar */}
        <div className="win2k-titlebar">
          <span className="text-xs">&#9776;</span>
          <span>Navigation</span>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px] font-bold"
            aria-label="Close menu"
          >
            &#x2715;
          </button>
        </div>

        {/* Logo */}
        <div className="p-3 flex items-center gap-2" style={{ borderBottom: '1px solid #808080' }}>
          <Image
            src="/images/majestic-logo-original.png"
            alt="Majestic"
            width={80}
            height={24}
            style={{ width: "auto" }}
            className="h-7"
          />
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto">
          {allNavItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedKey === item.key;

            return (
              <div key={item.key} style={{ borderBottom: '1px solid #C0C0C0' }}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.key)}
                      className="w-full text-start px-4 py-2 text-xs text-black flex items-center justify-between hover:bg-[#0A246A] hover:text-white"
                    >
                      <span>{t(`nav.${item.key}`)}</span>
                      <span className="text-[9px]">{isExpanded ? "▲" : "▼"}</span>
                    </button>
                    {isExpanded && (
                      <div style={{ background: '#ECE9D8', borderTop: '1px solid #808080' }}>
                        {item.children!.map((child) => (
                          <Link
                            key={child.key}
                            href={child.href}
                            onClick={onClose}
                            className="block px-8 py-1.5 text-xs text-black hover:bg-[#0A246A] hover:text-white"
                            style={{ borderBottom: '1px solid #C0C0C0' }}
                          >
                            {t(`nav.${child.key}`)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "block px-4 py-2 text-xs",
                      pathname === item.href
                        ? "bg-[#0A246A] text-white"
                        : "text-black hover:bg-[#0A246A] hover:text-white"
                    )}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Status bar */}
        <div className="win2k-statusbar flex items-center gap-2 px-2 py-1">
          <div className="win2k-raised px-2 py-0.5 text-xs text-black flex-1">
            {locale === "ar" ? "عربي" : "English"} — Ready
          </div>
        </div>
      </div>
    </>
  );
}
