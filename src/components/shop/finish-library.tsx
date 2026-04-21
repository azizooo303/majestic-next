/**
 * FinishLibrary — tabbed finish picker with persistent callout panel.
 * Phase 3 of the configurator redesign (2026-04-21).
 *
 * Tabs: All (32) · Whites (3) · Oaks (9) · Walnuts (4) · Greys & Blacks (8) · Stone & Neutrals (8)
 * Selected state: outline:1px solid var(--fg); outline-offset:3px  (NOT scale-110)
 * Callout: 56×56 swatch + name + meta, updates live on every selection.
 * Brand rules: no box-shadow, no backdrop-filter, no gradients (except material previews).
 */

"use client";

import { useState } from "react";
import { DESK_TOP_FINISHES, DESK_TOP_FINISH_HEX, DESK_TOP_FINISH_TEXTURE, FINISH_META } from "@/data/families";
import type { FinishGroup } from "@/data/families";

type Tab = "all" | FinishGroup;

const TABS: { id: Tab; labelEn: string; labelAr: string; count: number }[] = [
  { id: "all",     labelEn: "All",              labelAr: "الكل",             count: 32 },
  { id: "whites",  labelEn: "Whites",            labelAr: "البيض",            count: 3  },
  { id: "oaks",    labelEn: "Oaks",              labelAr: "البلوط",           count: 9  },
  { id: "walnuts", labelEn: "Walnuts",           labelAr: "الجوز",            count: 4  },
  { id: "greys",   labelEn: "Greys & Blacks",    labelAr: "الرمادي والأسود",  count: 8  },
  { id: "stone",   labelEn: "Stone & Neutrals",  labelAr: "الحجري والمحايد",  count: 8  },
];

type FinishLibraryProps = {
  value: string;
  onChange: (finish: string) => void;
  locale: "en" | "ar";
};

export function FinishLibrary({ value, onChange, locale }: FinishLibraryProps) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const isAr = locale === "ar";

  const visibleFinishes = DESK_TOP_FINISHES.filter((f) => {
    if (activeTab === "all") return true;
    return FINISH_META[f]?.group === activeTab;
  });

  const selectedMeta = FINISH_META[value];
  const selectedHex = DESK_TOP_FINISH_HEX[value] ?? "#E7E7E7";
  const selectedTexture = DESK_TOP_FINISH_TEXTURE[value];

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex gap-0 overflow-x-auto border-b border-[#D4D4D4] mb-4"
        style={{ scrollbarWidth: "none" }}
        role="tablist"
        aria-label={isAr ? "تصفية النهايات" : "Filter finishes"}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "px-3.5 py-2.5 text-[11.5px] uppercase whitespace-nowrap font-medium",
              "border-b border-transparent -mb-px transition-colors",
              isAr ? "tracking-normal" : "tracking-[0.1em]",
              activeTab === tab.id
                ? "text-[#2C2C2C] border-[#2C2C2C]"
                : "text-[#6B6B6B] hover:text-[#2C2C2C]",
            ].join(" ")}
          >
            {isAr ? tab.labelAr : tab.labelEn}
            <span className="text-[#6B6B6B] text-[10.5px] ms-1.5">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* 6-col swatch grid */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(6, 1fr)" }}
        role="radiogroup"
        aria-label={isAr ? "لون السطح" : "Desktop finish"}
      >
        {visibleFinishes.map((f) => {
          const hex = DESK_TOP_FINISH_HEX[f] ?? "#E7E7E7";
          const texture = DESK_TOP_FINISH_TEXTURE[f];
          const isSelected = value === f;
          return (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={f}
              title={f}
              onClick={() => onChange(f)}
              className={[
                "relative aspect-square border border-black/[0.08]",
                "transition-transform duration-200",
                "hover:-translate-y-0.5",
                isSelected ? "outline outline-1 outline-[#2C2C2C] outline-offset-[3px]" : "",
              ].join(" ")}
              style={{
                backgroundColor: hex,
                backgroundImage: texture ? `url(${texture})` : undefined,
                backgroundSize: "cover",
              }}
            >
              {isSelected && (
                <span className="absolute inset-0 border border-white/50 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Persistent finish callout */}
      <div className="mt-4 p-3.5 bg-[#FAFAF8] grid gap-3.5 items-center" style={{ gridTemplateColumns: "56px 1fr" }}>
        <div
          className="w-14 h-14 border border-black/[0.08] flex-shrink-0"
          style={{
            backgroundColor: selectedHex,
            backgroundImage: selectedTexture ? `url(${selectedTexture})` : undefined,
            backgroundSize: "cover",
          }}
          aria-hidden="true"
        />
        <div>
          <div className={[
            "text-[14px] font-semibold text-[#2C2C2C]",
            isAr ? "tracking-normal" : "tracking-[-0.005em]",
          ].join(" ")}>
            {value}
          </div>
          <div className={[
            "text-[11.5px] text-[#3A3A3A] mt-0.5",
            isAr ? "tracking-normal" : "tracking-[0.01em]",
          ].join(" ")}>
            {selectedMeta?.meta ?? "Laminate · Matte"}
          </div>
        </div>
      </div>
    </div>
  );
}
