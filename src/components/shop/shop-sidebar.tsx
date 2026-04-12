"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const SIDEBAR_CATEGORIES = [
  { slugEn: "seating",             slugAr: "%d8%a7%d9%84%d9%85%d9%82%d8%a7%d8%b9%d8%af",       en: "Seating",      ar: "المقاعد" },
  { slugEn: "tables-en",           slugAr: "%d8%a7%d9%84%d8%b7%d8%a7%d9%88%d9%84%d8%a7%d8%aa",  en: "Desks",        ar: "الطاولات" },
  { slugEn: "storage",             slugAr: "%d8%a7%d9%84%d8%aa%d8%ae%d8%b2%d9%8a%d9%86",        en: "Storage",      ar: "التخزين" },
  { slugEn: "workstations",        slugAr: "workstations",                                       en: "Workstations", ar: "محطات العمل" },
  { slugEn: "acoustics-solutions", slugAr: "acoustics-solutions",                                en: "Acoustics",    ar: "العوازل" },
  { slugEn: "lounge",              slugAr: "%d8%a7%d9%84%d8%b5%d8%a7%d9%84%d8%a9",              en: "Lounge",       ar: "الاسترخاء" },
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

  // Local state for price inputs — applied on blur or Enter key
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  // Keep local state in sync if URL params change externally (e.g. Reset all)
  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
  }, [searchParams]);

  function applyPriceRange() {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }
    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function handlePriceKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      applyPriceRange();
    }
  }

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
        <h2 className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wide">
          {isAr ? "تصفية" : "Filters"}
        </h2>
        <button
          onClick={resetAll}
          className="text-xs text-[#3A3A3A] hover:text-[#2C2C2C] transition-colors underline underline-offset-2"
        >
          {isAr ? "إعادة تعيين" : "Reset all"}
        </button>
      </div>

      {/* Category */}
      <div className="border-t border-[#D4D4D4] pt-4 pb-4">
        <details open className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none mb-3">
            <span className="text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">
              {isAr ? "الفئة" : "Category"}
            </span>
            <ChevronRight
              size={13}
              className="text-[#3A3A3A] group-open:rotate-90 transition-transform duration-200"
              aria-hidden="true"
            />
          </summary>
          <ul className="space-y-2.5">
            {SIDEBAR_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.slugEn || activeCategory === cat.slugAr;
              return (
                <li key={cat.slugEn}>
                  <label className="flex items-center gap-2.5 cursor-pointer group/item">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => setCategory(isAr ? cat.slugAr : cat.slugEn)}
                      className="w-3.5 h-3.5 rounded-sm border border-[#D4D4D4] accent-[#2C2C2C] cursor-pointer"
                    />
                    <span
                      className={`text-sm transition-colors group-hover/item:text-[#2C2C2C] ${
                        isActive ? "text-[#2C2C2C] font-semibold" : "text-[#3A3A3A]"
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
      <div className="border-t border-[#D4D4D4] pt-4 pb-4">
        <details open className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none mb-3">
            <span className="text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">
              {isAr ? "نطاق السعر" : "Price Range"}
            </span>
            <ChevronRight
              size={13}
              className="text-[#3A3A3A] group-open:rotate-90 transition-transform duration-200"
              aria-hidden="true"
            />
          </summary>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-[#3A3A3A] block mb-1">
                {isAr ? "من" : "Min"}
              </label>
              <input
                type="number"
                placeholder="0"
                min={0}
                max={10000}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={applyPriceRange}
                onKeyDown={handlePriceKeyDown}
                aria-label={isAr ? "الحد الأدنى للسعر" : "Minimum price"}
                className="w-full border border-[#D4D4D4] rounded-sm px-2 py-1.5 text-xs
                  text-[#2C2C2C] placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#2C2C2C] bg-white"
              />
            </div>
            <span className="text-[#3A3A3A] text-xs mt-4">—</span>
            <div className="flex-1">
              <label className="text-[10px] text-[#3A3A3A] block mb-1">
                {isAr ? "إلى" : "Max"}
              </label>
              <input
                type="number"
                placeholder="10,000"
                min={0}
                max={10000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={applyPriceRange}
                onKeyDown={handlePriceKeyDown}
                aria-label={isAr ? "الحد الأقصى للسعر" : "Maximum price"}
                className="w-full border border-[#D4D4D4] rounded-sm px-2 py-1.5 text-xs
                  text-[#2C2C2C] placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#2C2C2C] bg-white"
              />
            </div>
          </div>
          <p className="text-[10px] text-[#3A3A3A] mt-1.5">SAR 0 — SAR 10,000</p>
        </details>
      </div>

      {/*
       * TODO: Brand filter — restore when WooCommerce product API returns brand metadata
       * and the filtering logic is wired to the shop page. Do not re-add without onChange handlers.
       *
       * TODO: In Stock toggle — restore when WooCommerce stock status is available in the
       * product query and the filter can be passed as ?inStock=true to the API.
       */}
    </aside>
  );
}
