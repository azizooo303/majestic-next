"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { WCCategory } from "@/lib/woocommerce";

interface CategoryTabsProps {
  categories: WCCategory[];
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
      <Link
        href="/shop"
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors",
          !activeCategory
            ? "bg-primary text-white"
            : "text-gray-800 hover:text-gray-900"
        )}
      >
        All
      </Link>
      {categories.slice(0, 8).map((cat) => (
        <Link
          key={cat.id}
          href={`/shop?category=${cat.id}`}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors",
            activeCategory === String(cat.id)
              ? "bg-primary text-white"
              : "text-gray-800 hover:text-gray-900"
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
