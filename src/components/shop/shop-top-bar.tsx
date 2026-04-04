"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { useState } from "react";

interface ShopTopBarProps {
  productCount: number;
  activeSort?: string;
}

export function ShopTopBar({ productCount, activeSort = "featured" }: ShopTopBarProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [view, setView] = useState<"grid" | "list">("grid");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      {/* Left: count + mobile filter button */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden flex items-center gap-1.5 border border-[rgba(0,0,0,0.21)]
          rounded-sm px-3 py-2 text-xs font-medium text-gray-900] hover:bg-[#fafafa]
          transition-colors btn-press"
          aria-label={isAr ? "فتح التصفية" : "Open filters"}
        >
          <SlidersHorizontal size={13} aria-hidden="true" />
          {isAr ? "تصفية" : "Filters"}
        </button>
        <span className="hidden sm:block text-sm text-[#484848]">
          {isAr ? `${productCount} منتج` : `${productCount} products`}
        </span>
      </div>

      {/* Right: sort + view toggle */}
      <div className="flex items-center gap-2">
        <select
          value={activeSort}
          onChange={(e) => handleSort(e.target.value)}
          className="text-xs border border-[rgba(0,0,0,0.21)] rounded-sm px-2.5 py-2
          bg-white text-gray-900] focus:outline-none focus:border-[#0c0c0c] cursor-pointer"
          aria-label={isAr ? "ترتيب المنتجات" : "Sort products"}
        >
          <option value="featured">{isAr ? "المميزة" : "Featured"}</option>
          <option value="price-asc">{isAr ? "السعر: من الأقل" : "Price: Low to High"}</option>
          <option value="price-desc">{isAr ? "السعر: من الأعلى" : "Price: High to Low"}</option>
          <option value="newest">{isAr ? "الأحدث" : "Newest"}</option>
        </select>

        {/* View toggle */}
        <div className="flex border border-[rgba(0,0,0,0.21)] rounded-sm overflow-hidden">
          <button
            onClick={() => setView("grid")}
            className={`p-2 transition-colors ${view === "grid" ? "bg-white] text-white" : "bg-white text-[#484848] hover:bg-[#fafafa]"}`}
            aria-label={isAr ? "عرض شبكي" : "Grid view"}
            aria-pressed={view === "grid"}
          >
            <LayoutGrid size={13} aria-hidden="true" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 transition-colors ${view === "list" ? "bg-white] text-white" : "bg-white text-[#484848] hover:bg-[#fafafa]"}`}
            aria-label={isAr ? "عرض قائمة" : "List view"}
            aria-pressed={view === "list"}
          >
            <List size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
