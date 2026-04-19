"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { WCCategory } from "@/lib/woocommerce";

interface CategoryTabsProps {
  categories: WCCategory[];
  locale?: string;
}

export function CategoryTabs({ categories, locale }: CategoryTabsProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const isAr = locale === "ar";

  return (
    <div
      role="tablist"
      className="flex items-center gap-2 overflow-x-auto no-scrollbar"
    >
      <Link
        href="/shop"
        role="tab"
        aria-selected={!activeCategory}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-none whitespace-nowrap transition-colors",
          !activeCategory
            ? "bg-primary text-white"
            : "text-gray-800 hover:text-[#2C2C2C]"
        )}
      >
        {isAr ? "الكل" : "All"}
      </Link>
      {categories.slice(0, 8).map((cat) => {
        const isActive = activeCategory === String(cat.id);
        return (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.id}`}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-none whitespace-nowrap transition-colors",
              isActive
                ? "bg-primary text-white"
                : "text-gray-800 hover:text-[#2C2C2C]"
            )}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
