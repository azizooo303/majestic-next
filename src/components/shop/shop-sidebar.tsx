"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { ChevronRight } from "lucide-react";

const SIDEBAR_CATEGORIES = [
  { slug: "seating",     en: "Seating",      ar: "الجلوس" },
  { slug: "tables",      en: "Desks",         ar: "المكاتب" },
  { slug: "storage",     en: "Storage",       ar: "التخزين" },
  { slug: "workstations",en: "Workstations",  ar: "محطات العمل" },
  { slug: "acoustics",   en: "Acoustics",     ar: "العوازل" },
  { slug: "lounge",      en: "Lounge",        ar: "الاسترخاء" },
];

const BRANDS = [
  { value: "majestic",   en: "Majestic",   ar: "ماجيستيك" },
  { value: "chairline",  en: "ChairLine",  ar: "شيرلاين" },
  { value: "other",      en: "Other",      ar: "أخرى" },
];

interface ShopSidebarProps {
  activeCategory?: string;
  activeSort?: string;
}

export function ShopSidebar({ activeCategory }: ShopSidebarProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("category") === slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function resetAll() {
    router.push(pathname);
  }

  return (
    <aside
      className="hidden lg:block w-[260px] shrink-0 sticky top-[200px]"
      aria-label={isAr ? "تصفية المنتجات" : "Product filters"}
    >
      {/* Heading + Reset */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900] uppercase tracking-wide">
          {isAr ? "تصفية" : "Filters"}
        </h2>
        <button
          onClick={resetAll}
          className="text-xs text-[#484848] hover:text-gray-900] transition-colors underline underline-offset-2"
        >
          {isAr ? "إعادة تعيين" : "Reset all"}
        </button>
      </div>

      {/* Category */}
      <div className="border-t border-[rgba(0,0,0,0.08)] pt-4 pb-4">
        <details open className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none mb-3">
            <span className="text-xs font-semibold text-gray-900] uppercase tracking-wide">
              {isAr ? "الفئة" : "Category"}
            </span>
            <ChevronRight
              size={13}
              className="text-[#484848] group-open:rotate-90 transition-transform duration-200"
              aria-hidden="true"
            />
          </summary>
          <ul className="space-y-2.5">
            {SIDEBAR_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <li key={cat.slug}>
                  <label className="flex items-center gap-2.5 cursor-pointer group/item">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => setCategory(cat.slug)}
                      className="w-3.5 h-3.5 rounded-sm border border-[rgba(0,0,0,0.21)] accent-[#0c0c0c] cursor-pointer"
                    />
                    <span
                      className={`text-sm transition-colors group-hover/item:text-gray-900] ${
                        isActive ? "text-gray-900] font-semibold" : "text-[#484848]"
                      }`}
                    >
                      {isAr ? cat.ar : cat.en}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </details>
      </div>

      {/* Price range */}
      <div className="border-t border-[rgba(0,0,0,0.08)] pt-4 pb-4">
        <details open className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none mb-3">
            <span className="text-xs font-semibold text-gray-900] uppercase tracking-wide">
              {isAr ? "نطاق السعر" : "Price Range"}
            </span>
            <ChevronRight
              size={13}
              className="text-[#484848] group-open:rotate-90 transition-transform duration-200"
              aria-hidden="true"
            />
          </summary>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-[#484848] block mb-1">
                {isAr ? "من" : "Min"}
              </label>
              <input
                type="number"
                placeholder="0"
                min={0}
                max={10000}
                className="w-full border border-[rgba(0,0,0,0.21)] rounded-sm px-2 py-1.5 text-xs
                  text-gray-900] placeholder:text-[#484848] focus:outline-none focus:border-[#0c0c0c] bg-white"
              />
            </div>
            <span className="text-[#484848] text-xs mt-4">—</span>
            <div className="flex-1">
              <label className="text-[10px] text-[#484848] block mb-1">
                {isAr ? "إلى" : "Max"}
              </label>
              <input
                type="number"
                placeholder="10,000"
                min={0}
                max={10000}
                className="w-full border border-[rgba(0,0,0,0.21)] rounded-sm px-2 py-1.5 text-xs
                  text-gray-900] placeholder:text-[#484848] focus:outline-none focus:border-[#0c0c0c] bg-white"
              />
            </div>
          </div>
          <p className="text-[10px] text-[#484848] mt-1.5">SAR 0 — SAR 10,000</p>
        </details>
      </div>

      {/* Brand */}
      <div className="border-t border-[rgba(0,0,0,0.08)] pt-4 pb-4">
        <details open className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none mb-3">
            <span className="text-xs font-semibold text-gray-900] uppercase tracking-wide">
              {isAr ? "العلامة التجارية" : "Brand"}
            </span>
            <ChevronRight
              size={13}
              className="text-[#484848] group-open:rotate-90 transition-transform duration-200"
              aria-hidden="true"
            />
          </summary>
          <ul className="space-y-2.5">
            {BRANDS.map((b) => (
              <li key={b.value}>
                <label className="flex items-center gap-2.5 cursor-pointer group/item">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded-sm border border-[rgba(0,0,0,0.21)] accent-[#0c0c0c] cursor-pointer"
                  />
                  <span className="text-sm text-[#484848] group-hover/item:text-gray-900] transition-colors">
                    {isAr ? b.ar : b.en}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </details>
      </div>

      {/* In Stock toggle */}
      <div className="border-t border-[rgba(0,0,0,0.08)] pt-4 pb-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold text-gray-900] uppercase tracking-wide">
            {isAr ? "متوفر في المخزون" : "In Stock Only"}
          </span>
          <div className="relative w-9 h-5">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-9 h-5 bg-[rgba(0,0,0,0.12)] peer-checked:bg-white] rounded-full transition-colors duration-200 cursor-pointer" />
            <div className="absolute top-0.5 start-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 peer-checked:translate-x-4" />
          </div>
        </label>
      </div>
    </aside>
  );
}
