/**
 * Family card — shows one desk family on the /shop grid.
 * Replaces the old per-variant ProductCard when showing variable products.
 *
 * Drop this file in: src/components/shop/family-card.tsx (Majestic-Next)
 *
 * Usage:
 *   <FamilyCard family={deskFamily} locale="en" />
 */

"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useState } from "react";
import type { DeskFamily } from "@/data/families";

type FamilyCardProps = {
  family: DeskFamily;
  locale: "en" | "ar";
  startingPrice?: number; // min variation price; fetched from WC variations
};

export function FamilyCard({family, locale, startingPrice}: FamilyCardProps) {
  const isAr = locale === "ar";
  const [isHovering, setIsHovering] = useState(false);

  const name = isAr ? family.nameAr : family.nameEn;
  const tagline = family.tagline?.[isAr ? "ar" : "en"];

  return (
    <Link
      href={`/shop/${family.slug}`}
      className="group block border border-[#D4D4D4] bg-white hover:border-[#3A3A3A] transition-colors"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Hero — 4:3 aspect */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F7F7]">
        {family.heroImage ? (
          <Image
            src={family.heroImage}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#3A3A3A] font-light">
            {family.nameEn}
          </div>
        )}
        {family.status === "new" && (
          <div className="absolute top-3 left-3 bg-[#2C2C2C] text-white text-xs px-2 py-1 uppercase tracking-wide">
            {isAr ? "جديد" : "New"}
          </div>
        )}
        {family.hasGlb && (
          <div className="absolute top-3 right-3 bg-white/90 text-[#2C2C2C] text-xs px-2 py-1 uppercase tracking-wide">
            3D
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-medium text-[#2C2C2C] text-lg">{name}</h3>
        {tagline && (
          <p className="text-[#3A3A3A] text-sm mt-1 line-clamp-2">{tagline}</p>
        )}

        {/* Configurable indicators */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-[#3A3A3A]">
          <span>{family.configs.length} {isAr ? "تكوين" : "configs"}</span>
          <span>{isAr ? "32 تشطيب" : "32 finishes"}</span>
          <span>{isAr ? "4 أرجل" : "4 leg colors"}</span>
        </div>

        {/* Price line */}
        <div className="mt-4 pt-4 border-t border-[#D4D4D4] flex items-baseline justify-between">
          <div>
            {startingPrice !== undefined ? (
              <>
                <div className="text-xs text-[#3A3A3A]">
                  {isAr ? "يبدأ من" : "Starting from"}
                </div>
                <div className="text-[#2C2C2C] font-medium">
                  {startingPrice.toLocaleString(isAr ? "ar-SA" : "en-US")} {isAr ? "ريال" : "SAR"}
                </div>
              </>
            ) : (
              <div className="text-sm text-[#3A3A3A]">
                {isAr ? "السعر عند التكوين" : "Price on configure"}
              </div>
            )}
          </div>
          <div className="text-[#2C2C2C] text-sm uppercase tracking-wide group-hover:underline">
            {isAr ? "اضبط ← " : "Configure →"}
          </div>
        </div>
      </div>
    </Link>
  );
}
