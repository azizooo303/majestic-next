/**
 * DisclosureAxis — collapsible add-on selector.
 * Phase 4 of the configurator redesign (2026-04-21).
 *
 * Used for Side Unit and Pedestal axes.
 * Collapsed by default. State indicator shows "Not added" / "Match desktop · +X".
 * Body: pill-row with None / Match desktop +X / Choose separately.
 * Brand rules: no box-shadow, border only, sharp corners.
 */

"use client";

import { useState } from "react";

type DisclosureOption = {
  value: string;
  labelEn: string;
  labelAr: string;
  extraPrice?: number;
  isCustom?: boolean;
};

type DisclosureAxisProps = {
  name: { en: string; ar: string };
  description?: { en: string; ar: string };
  value: string;
  onChange: (val: string) => void;
  options: DisclosureOption[];
  locale: "en" | "ar";
  defaultOpen?: boolean;
};

export function DisclosureAxis({
  name,
  description,
  value,
  onChange,
  options,
  locale,
  defaultOpen = false,
}: DisclosureAxisProps) {
  const [open, setOpen] = useState(defaultOpen);
  const isAr = locale === "ar";

  const selectedOption = options.find((o) => o.value === value);
  const hasSelection = !!value && value !== "";
  const stateLabel = (() => {
    if (!hasSelection || !selectedOption) return isAr ? "لم يُضف" : "Not added";
    if (selectedOption.isCustom) return isAr ? "مخصص" : "Custom";
    const delta = selectedOption.extraPrice ? ` · +${selectedOption.extraPrice.toLocaleString()}` : "";
    return isAr
      ? `مطابق للسطح${delta}`
      : `Match desktop${delta}`;
  })();

  return (
    <div className="border border-[#D4D4D4] mb-2.5">
      {/* Header / trigger */}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full grid items-center gap-4 px-4 py-3.5 text-left hover:bg-[#F5F5F5] transition-colors"
        style={{ gridTemplateColumns: "1fr auto auto" }}
      >
        <span className={[
          "text-[13.5px] font-medium text-[#2C2C2C]",
          isAr ? "tracking-normal" : "",
        ].join(" ")}>
          {isAr ? name.ar : name.en}
        </span>
        <span className={[
          "text-[12px] font-variant-numeric tabular-nums",
          hasSelection ? "text-[#2C2C2C] font-medium" : "text-[#3A3A3A]",
          isAr ? "tracking-normal" : "",
        ].join(" ")}>
          {stateLabel}
        </span>
        {/* Caret — vertical only, no RTL flip needed */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={[
            "text-[#6B6B6B] transition-transform duration-[250ms]",
            open ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Body — CSS max-height animation */}
      <div
        className={[
          "overflow-hidden transition-all duration-[350ms]",
          open ? "max-h-[600px] border-t border-[#D4D4D4]" : "max-h-0",
        ].join(" ")}
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="p-4">
          {description && (
            <p className={[
              "text-[12.5px] text-[#3A3A3A] mb-3 leading-[1.55]",
              isAr ? "tracking-normal" : "",
            ].join(" ")}>
              {isAr ? description.ar : description.en}
            </p>
          )}
          {/* Pill row */}
          <div className="flex gap-0 flex-wrap border border-[#D4D4D4]">
            {options.map((opt, idx) => {
              const isSelected = value === opt.value;
              const isLast = idx === options.length - 1;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={[
                    "flex-1 min-w-[80px] px-3.5 py-3 text-[13px] font-medium",
                    "transition-colors",
                    !isLast ? "border-r border-[#D4D4D4]" : "",
                    opt.isCustom ? "border-dashed italic text-[#3A3A3A]" : "",
                    isSelected
                      ? "bg-[#2C2C2C] text-white"
                      : "hover:bg-[#F5F5F5] text-[#2C2C2C]",
                    isAr ? "tracking-normal" : "tracking-[0.01em]",
                  ].join(" ")}
                >
                  {isAr ? opt.labelAr : opt.labelEn}
                  {!opt.isCustom && typeof opt.extraPrice === "number" && opt.extraPrice > 0 && (
                    <span className={[
                      "text-[11px] ms-1.5",
                      isSelected ? "text-white/70" : "text-[#6B6B6B]",
                    ].join(" ")}>
                      +{opt.extraPrice.toLocaleString()}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
