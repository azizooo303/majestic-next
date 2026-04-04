"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Search,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";

/* ------------------------------------------------------------------ */
/*  NAV CONFIG                                                         */
/* ------------------------------------------------------------------ */

interface NavChild {
  key: string;
  href: string;
  image?: string;
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
      { key: "executiveChairs", href: "/shop?category=executive-chairs", image: "https://thedeskco.net/wp-content/uploads/2026/03/menu-seating.png" },
      { key: "taskChairs", href: "/shop?category=task-chairs", image: "https://thedeskco.net/wp-content/uploads/2026/03/menu-seating.png" },
      { key: "meetingChairs", href: "/shop?category=meeting-chairs", image: "https://thedeskco.net/wp-content/uploads/2026/03/menu-seating.png" },
      { key: "lounge", href: "/shop?category=lounge-chairs", image: "https://thedeskco.net/wp-content/uploads/2026/03/menu-lounge.png" },
    ],
  },
  {
    key: "desks",
    href: "/shop?category=tables",
    mega: true,
    children: [
      { key: "executiveDesks", href: "/shop?category=executive-desks", image: "https://thedeskco.net/wp-content/uploads/2026/03/menu-tables.png" },
      { key: "workstations", href: "/shop?category=workstations", image: "https://thedeskco.net/wp-content/uploads/2026/03/menu-workstations.png" },
      { key: "heightAdjustable", href: "/shop?category=height-adjustable", image: "https://thedeskco.net/wp-content/uploads/2026/03/menu-tables.png" },
      { key: "accessories", href: "/shop?category=accessories", image: "https://thedeskco.net/wp-content/uploads/2026/03/menu-storage.png" },
      { key: "meetingTables", href: "/shop?category=meeting-tables", image: "https://thedeskco.net/wp-content/uploads/2026/03/menu-tables.png" },
      { key: "receptionDesk", href: "/shop?category=reception", image: "https://thedeskco.net/wp-content/uploads/2026/03/menu-lounge.png" },
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
      <div className="fixed top-0 inset-x-0 z-[61] bg-white border-b border-[rgba(0,0,0,0.12)] py-5 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto flex items-center gap-4">
          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-3">
            <Search className="w-5 h-5 text-[#484848] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                locale === "ar" ? "ابحث عن المنتجات..." : "Search products..."
              }
              className="flex-1 text-base text-gray-900] bg-transparent outline-none placeholder:text-[#484848]/50"
            />
          </form>
          <button
            onClick={onClose}
            className="p-2 text-gray-900] hover:text-[#484848] cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  HEADER                                                             */
/* ------------------------------------------------------------------ */

// Total header height: ~30px (utility) + ~120px (logo row) + ~46px (nav row) = ~196px
export const HEADER_HEIGHT = 196;

interface AnnouncementBarData {
  enabled: boolean
  message: { en: string; ar: string }
  bgColor: string
  link: string
}

interface HeaderProps {
  announcement?: AnnouncementBarData
}

export function Header({ announcement }: HeaderProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(HEADER_HEIGHT);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white] focus:text-white focus:rounded-sm focus:font-medium"
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 w-full z-50 bg-white transition-all duration-300",
          scrolled && "shadow-sm"
        )}
      >
        {/* ── Announcement Bar ── */}
        {announcement?.enabled && announcement.message && (
          <div
            className={cn(
              "w-full text-center text-xs font-medium py-2 px-4 overflow-hidden transition-all duration-300",
              scrolled ? "max-h-0 py-0" : "max-h-[40px]"
            )}
            style={{ backgroundColor: announcement.bgColor || '#2C2C2C', color: '#fff' }}
          >
            {announcement.link ? (
              <a href={announcement.link} className="hover:underline">
                {locale === 'ar' ? announcement.message.ar : announcement.message.en}
              </a>
            ) : (
              <span>{locale === 'ar' ? announcement.message.ar : announcement.message.en}</span>
            )}
          </div>
        )}

        {/* ── Row 1: Utility bar — hidden when scrolled ── */}
        <div className={cn(
          "hidden md:block border-b border-[rgba(0,0,0,0.08)] bg-white overflow-hidden transition-all duration-300",
          scrolled ? "max-h-0 border-b-0" : "max-h-[40px]"
        )}>
          <div className="max-w-screen-xl mx-auto px-8 py-1.5 flex items-center gap-1 text-xs text-[#484848]">
            <Link
              href="/showrooms"
              className="hover:text-gray-900] transition-colors px-2 py-0.5"
            >
              {t("nav.showrooms")}
            </Link>
            <span className="text-[rgba(0,0,0,0.2)]">|</span>
            <Link
              href="/materials"
              className="hover:text-gray-900] transition-colors px-2 py-0.5"
            >
              {t("nav.materialColors")}
            </Link>
            <span className="text-[rgba(0,0,0,0.2)]">|</span>
            <Link
              href="/warranty"
              className="hover:text-gray-900] transition-colors px-2 py-0.5"
            >
              {t("nav.warranty")}
            </Link>
          </div>
        </div>

        {/* ── Row 2: Logo + icons ── */}
        <div className="border-b border-[rgba(0,0,0,0.12)]">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 md:py-5 grid grid-cols-3 items-center">

            {/* Left: hamburger on mobile, spacer on desktop */}
            <div className="flex items-center">
              <button
                className="lg:hidden p-2 text-gray-900] cursor-pointer"
                onClick={() => setIsMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Center: logo — always centered */}
            <div className="flex justify-center">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/images/majestic-logo-original.png"
                  alt="Majestic Furniture"
                  width={220}
                  height={62}
                  style={{ width: "auto" }}
                  className="h-12 md:h-20 lg:h-24"
                  priority
                />
              </Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-0.5 md:gap-1 justify-end">
              {/* Search — desktop + tablet */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex p-2 md:p-2.5 text-gray-900] hover:text-[#484848] transition-colors cursor-pointer"
                aria-label={locale === "ar" ? "بحث" : "Search"}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account — desktop only */}
              <Link
                href="/account"
                className="p-2 md:p-2.5 text-gray-900] hover:text-[#484848] transition-colors hidden sm:flex"
                aria-label={locale === "ar" ? "حسابي" : "Account"}
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart — always visible */}
              <Link
                href="/cart"
                className="p-2 md:p-2.5 text-gray-900] hover:text-[#484848] transition-colors relative"
                aria-label={locale === "ar" ? "سلة التسوق" : `Cart, ${itemCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1 end-1 w-3.5 h-3.5 bg-white] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              </Link>

              {/* Language toggle — desktop only */}
              <LanguageToggle />
            </div>
          </div>
        </div>

        {/* ── Row 3: Category nav (desktop only) ── */}
        <div className="hidden lg:block border-b border-[rgba(0,0,0,0.12)] bg-white">
          <div className="max-w-screen-xl mx-auto px-8">
            <nav className="flex items-center">
              {/* Primary nav items */}
              {NAV_ITEMS.map((item) => (
                <DesktopNavItem
                  key={item.key}
                  item={item}
                  pathname={pathname}
                  t={t}
                  navRowOffset={headerHeight}
                />
              ))}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Secondary nav items */}
              {SECONDARY_NAV.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium px-3 py-3.5 transition-colors hover:text-[#484848] whitespace-nowrap",
                    item.key === "eQuotation"
                      ? "border border-[rgba(0,0,0,0.38)] rounded-sm mx-1 my-2 py-2 px-3 text-xs"
                      : "",
                    pathname === item.href
                      ? "text-gray-900] border-b-2 border-[#0c0c0c]"
                      : "text-gray-900]"
                  )}
                >
                  {item.key === "eQuotation" && (
                    <FileText className="w-3.5 h-3.5" />
                  )}
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
            </nav>
          </div>
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
  navRowOffset,
}: {
  item: NavItem;
  pathname: string;
  t: ReturnType<typeof useTranslations>;
  navRowOffset: number;
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

  const label = t(`nav.${item.key}`);

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className={cn(
          "text-sm font-medium px-3 py-3.5 transition-colors duration-200 hover:text-[#484848] whitespace-nowrap",
          isActive
            ? "text-gray-900] border-b-2 border-[#0c0c0c]"
            : "text-gray-900] nav-underline"
        )}
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={open} onMouseLeave={close}>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-1 text-sm font-medium px-3 py-3.5 transition-colors duration-200 hover:text-[#484848] whitespace-nowrap",
          isActive
            ? "text-gray-900] border-b-2 border-[#0c0c0c]"
            : "text-gray-900] nav-underline"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className={cn(
            "w-3 h-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Link>

      {isOpen &&
        (item.mega ? (
          <MegaMenu
            item={item}
            t={t}
            onMouseEnter={open}
            onMouseLeave={close}
            topOffset={navRowOffset}
          />
        ) : (
          <SimpleDropdown
            item={item}
            t={t}
            pathname={pathname}
            onMouseEnter={open}
            onMouseLeave={close}
          />
        ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MEGA MENU                                                          */
/* ------------------------------------------------------------------ */

function MegaMenu({
  item,
  t,
  onMouseEnter,
  onMouseLeave,
  topOffset,
}: {
  item: NavItem;
  t: ReturnType<typeof useTranslations>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  topOffset: number;
}) {
  return (
    <div
      className="fixed inset-x-0 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
      style={{ top: `${topOffset}px` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-white border-b border-[rgba(0,0,0,0.12)] shadow-md">
        <div className="max-w-screen-xl mx-auto px-8 py-8">
          <div className="flex gap-12">
            {/* Left: Subcategory links */}
            <div className="w-52 flex-shrink-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#484848] mb-4">
                {t(`nav.${item.key}`)}
              </p>
              <ul className="space-y-1">
                {item.children!.map((child) => (
                  <li key={child.key}>
                    <Link
                      href={child.href}
                      className="block text-sm text-gray-900] hover:text-[#484848] py-1.5 transition-colors"
                    >
                      {t(`nav.${child.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-[rgba(0,0,0,0.08)]">
                <Link
                  href={item.href}
                  className="text-xs font-semibold text-gray-900] hover:text-[#484848] inline-flex items-center gap-1 transition-colors"
                >
                  {t("common.viewAll")} <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Right: Featured product cards */}
            <div className="flex-1 grid grid-cols-3 gap-4">
              {item.children!.slice(0, 3).map((child) => (
                <Link
                  key={child.key}
                  href={child.href}
                  className="group block"
                >
                  <div className="aspect-[4/3] bg-[#f2f2f2] overflow-hidden mb-2 relative">
                    {child.image ? (
                      <Image
                        src={child.image}
                        alt={t(`nav.${child.key}`)}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="200px"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#ebebeb]" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-900] group-hover:text-[#484848] transition-colors">
                    {t(`nav.${child.key}`)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SIMPLE DROPDOWN                                                    */
/* ------------------------------------------------------------------ */

function SimpleDropdown({
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
      className="absolute top-full start-0 pt-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-white shadow-md border border-[rgba(0,0,0,0.08)] w-52 py-2">
        {item.children!.map((child) => (
          <Link
            key={child.key}
            href={child.href}
            className={cn(
              "block px-4 py-2.5 text-sm transition-colors hover:bg-[#fafafa] hover:text-gray-900]",
              pathname === child.href
                ? "text-gray-900] font-semibold"
                : "text-[#484848]"
            )}
          >
            {t(`nav.${child.key}`)}
          </Link>
        ))}
      </div>
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
      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-900] hover:text-[#484848] transition-colors"
    >
      {isAr ? "EN" : "AR"}
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
  const drawerPathname = usePathname();

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

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden flex flex-col",
          "end-0",
          isOpen
            ? "translate-x-0"
            : "ltr:translate-x-full rtl:-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(0,0,0,0.08)]">
          <Image
            src="/images/majestic-logo-original.png"
            alt="Majestic Furniture"
            width={120}
            height={34}
            style={{ width: "auto" }}
            className="h-8"
          />
          <button
            onClick={onClose}
            className="p-2 text-gray-900] hover:text-[#484848] cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Utility links — mobile */}
        <div className="px-6 py-3 border-b border-[rgba(0,0,0,0.06)] flex gap-4">
          <Link href="/showrooms" onClick={onClose} className="text-xs text-[#484848] hover:text-gray-900]">
            {t("nav.showrooms")}
          </Link>
          <span className="text-[rgba(0,0,0,0.2)] text-xs">|</span>
          <Link href="/warranty" onClick={onClose} className="text-xs text-[#484848] hover:text-gray-900]">
            {t("nav.warranty")}
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {allNavItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedKey === item.key;
            const label = t(`nav.${item.key}`);

            return (
              <div
                key={item.key}
                className="border-b border-[rgba(0,0,0,0.06)]"
              >
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.key)}
                      className="w-full flex items-center justify-between px-6 py-4 text-base font-medium text-gray-900] hover:text-[#484848] transition-colors cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      {label}
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        isExpanded
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="bg-[#fafafa] py-2">
                        {item.children!.map((child) => (
                          <Link
                            key={child.key}
                            href={child.href}
                            onClick={onClose}
                            className={cn(
                              "block px-10 py-3 text-sm transition-colors hover:text-gray-900]",
                              drawerPathname === child.href
                                ? "text-gray-900] font-semibold"
                                : "text-[#484848]"
                            )}
                          >
                            {t(`nav.${child.key}`)}
                          </Link>
                        ))}
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="block px-10 py-3 text-sm font-semibold text-gray-900] inline-flex items-center gap-1"
                        >
                          {t("common.viewAll")}{" "}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "block px-6 py-4 text-base font-medium transition-colors hover:text-[#484848]",
                      pathname === item.href
                        ? "text-gray-900] border-s-2 border-[#0c0c0c]"
                        : "text-gray-900]"
                    )}
                  >
                    {label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom: Language + Account */}
        <div className="border-t border-[rgba(0,0,0,0.08)] p-4 space-y-3">
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-medium text-gray-900] hover:text-[#484848] transition-colors"
          >
            <User className="w-4 h-4" />
            {locale === "ar" ? "تسجيل الدخول" : "Sign In"}
          </Link>
          <Link
            href={drawerPathname}
            locale={locale === "ar" ? "en" : "ar"}
            onClick={onClose}
            className="flex items-center gap-1 text-sm font-medium text-gray-900] hover:text-[#484848] transition-colors"
          >
            {locale === "ar" ? "EN" : "AR"}
          </Link>
        </div>
      </div>
    </>
  );
}
