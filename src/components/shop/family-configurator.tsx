/**
 * Family page — the configurator experience.
 * Route: /[locale]/shop/[family]/page.tsx
 *
 * Drop into: src/app/[locale]/shop/[family]/page.tsx
 *
 * This is a CLIENT component because picker state is all live.
 * Data fetching happens via a wrapping server component (fetch WC variable product).
 */

"use client";

import {useState, useMemo} from "react";
import type {DeskFamily} from "@/data/families";
import {
  DESK_TOP_FINISHES,
  LEG_COLORS,
  CONFIG_EXTRA_PRICES,
  isValidCombo,
} from "@/data/families";
import {ConfiguratorPicker} from "@/components/shop/configurator-picker";
import {LivePrice} from "@/components/shop/live-price";

type FamilyConfiguratorProps = {
  family: DeskFamily;
  basePrice: number; // from WC variable product list_price (or fallback to 2400)
  variations?: Array<{
    id: number;
    sku: string;
    attributes: Record<string, string>;
    price: number;
  }>;
  locale: "en" | "ar";
};

// Sizes available per Config (reflects Odoo Active Sizes per config)
const SIZE_OPTIONS_PER_CONFIG: Record<string, string[]> = {
  "Executive": ["160x80", "180x90", "200x100", "220x100", "CUSTOM"],
  "Manager": ["140x70", "160x80", "180x80", "CUSTOM"],
  "Operator": ["120x60", "140x60", "160x70", "CUSTOM"],
  "L-Shape": ["160x80+120x60", "180x90+120x60", "CUSTOM"],
  "U-Shape": ["180x90+2x120x60", "CUSTOM"],
  "Conference": ["180x90", "240x100", "300x110", "360x120", "CUSTOM"],
  "Custom (Contact Us)": ["CUSTOM"],
  "Height-Adjustable": ["120x60", "140x70", "160x80", "180x80", "CUSTOM"],
};

const SIZE_EXTRA_PRICES: Record<string, number> = {
  "120x60": 0, "140x60": 0, "140x70": 100, "160x70": 150, "160x80": 200,
  "180x80": 300, "180x90": 400, "200x80": 500, "200x100": 650,
  "220x90": 700, "220x100": 800, "240x100": 900, "300x110": 1200, "360x120": 1500,
  "CUSTOM": 0,
};

export function FamilyConfigurator({family, basePrice, locale}: FamilyConfiguratorProps) {
  const isAr = locale === "ar";

  // Default selections (first valid combination)
  const [config, setConfig] = useState(family.configs[0] || "Executive");
  const [size, setSize] = useState(SIZE_OPTIONS_PER_CONFIG[config]?.[0] || "160x80");
  const [finish, setFinish] = useState<string>(DESK_TOP_FINISHES[0]);
  const [leg, setLeg] = useState<string>("Polished Chrome");
  const [sideUnitFinish, setSideUnitFinish] = useState<string>("");
  const [pedestalFinish, setPedestalFinish] = useState<string>("");

  const isCustomQuote = config === "Custom (Contact Us)" || size === "CUSTOM";

  // Build extras lookup
  const extraPriceLookup = useMemo(() => {
    const map: Record<string, number> = {};
    Object.entries(CONFIG_EXTRA_PRICES).forEach(([k, v]) => {
      map[`Config:${k}`] = v;
    });
    Object.entries(SIZE_EXTRA_PRICES).forEach(([k, v]) => {
      map[`Size:${k}`] = v;
    });
    return map;
  }, []);

  const selections = {
    Config: config,
    Size: size,
    "Desk Top Finish": finish,
    "Leg Color": leg,
  };

  // Exclusions for Size based on selected Config
  const excludedSizes = useMemo(() => {
    const valid = SIZE_OPTIONS_PER_CONFIG[config] || [];
    const ALL_SIZES = ["120x60", "140x60", "140x70", "160x70", "160x80", "180x80", "180x90",
                       "200x80", "200x100", "220x90", "220x100", "240x100", "300x110", "360x120",
                       "160x80+120x60", "180x90+120x60", "180x90+2x120x60", "CUSTOM"];
    return ALL_SIZES.filter(s => !valid.includes(s));
  }, [config]);

  // Exclusions for Leg Color based on family + config
  const excludedLegs = useMemo(() => {
    return LEG_COLORS.filter(leg => {
      const check = isValidCombo(family.sku, config, size, leg);
      return !check.valid;
    });
  }, [family.sku, config, size]);

  // Add to cart handler
  async function handleAddToCart() {
    if (isCustomQuote) {
      window.location.href = `/${locale}/quotation?family=${family.slug}&size=${size}&finish=${finish}&leg=${leg}`;
      return;
    }
    // Find matching variation in the variations[] from WC (parent-injected)
    // For now, fallback: add template + selection to cart as metadata
    // TODO: wire to /api/cart POST once WC Store API endpoint is ready
    console.log("Add to cart:", {family: family.sku, config, size, finish, leg, sideUnitFinish, pedestalFinish});
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8 px-4 max-w-7xl mx-auto">
      {/* Left — 3D viewer / hero */}
      <div className="bg-[#F7F7F7] aspect-square lg:aspect-auto lg:h-[600px] flex items-center justify-center">
        {family.hasGlb ? (
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-[#3A3A3A]">3D Viewer</div>
            <div className="text-sm text-[#3A3A3A] mt-2">[GLB: {family.glbUrl}]</div>
            <div className="text-xs text-[#3A3A3A] mt-2">Material swap: Wave 4</div>
          </div>
        ) : (
          <div className="text-[#3A3A3A] text-center">
            <div className="text-sm uppercase tracking-wider">{family.nameEn}</div>
            <div className="text-xs mt-2">3D coming soon</div>
          </div>
        )}
      </div>

      {/* Right — picker */}
      <div>
        <h1 className="text-3xl font-medium text-[#2C2C2C]">
          {isAr ? family.nameAr : family.nameEn}
        </h1>
        {family.tagline && (
          <p className="text-[#3A3A3A] mt-2">{isAr ? family.tagline.ar : family.tagline.en}</p>
        )}

        <div className="mt-8 space-y-4">
          <ConfiguratorPicker
            axis="Config"
            value={config}
            onChange={setConfig}
            options={family.configs.map(c => ({
              value: c,
              labelEn: c,
              labelAr: c, // TODO: translate
              extraPrice: CONFIG_EXTRA_PRICES[c] || 0,
              isCustom: c === "Custom (Contact Us)",
            }))}
            displayMode="radio"
            locale={locale}
          />

          <ConfiguratorPicker
            axis="Size"
            value={size}
            onChange={setSize}
            options={Object.keys(SIZE_EXTRA_PRICES).map(s => ({
              value: s,
              labelEn: s,
              labelAr: s,
              extraPrice: SIZE_EXTRA_PRICES[s],
              isCustom: s === "CUSTOM",
            }))}
            displayMode="radio"
            exclusions={excludedSizes}
            locale={locale}
          />

          <ConfiguratorPicker
            axis="Desk Top Finish"
            value={finish}
            onChange={setFinish}
            options={DESK_TOP_FINISHES.map(f => ({
              value: f,
              labelEn: f,
              labelAr: f,
              swatchHex: "#D4B895", // TODO: per-finish hex from material library
            }))}
            displayMode="color-swatch"
            locale={locale}
          />

          <ConfiguratorPicker
            axis="Leg Color"
            value={leg}
            onChange={setLeg}
            options={LEG_COLORS.map(l => ({
              value: l,
              labelEn: l,
              labelAr: l,
              swatchHex: l.includes("Black") ? "#2C2C2C" : l.includes("White") ? "#FFFFFF" : l.includes("Silver") ? "#C0C0C0" : "#E0E0E0",
            }))}
            displayMode="radio"
            exclusions={excludedLegs}
            locale={locale}
          />

          {/* Optional configurator-only axes */}
          <ConfiguratorPicker
            axis="Side Unit Finish"
            value={sideUnitFinish}
            onChange={setSideUnitFinish}
            options={[{value: "", labelEn: "None", labelAr: "بدون"}].concat(
              DESK_TOP_FINISHES.map(f => ({value: f, labelEn: f, labelAr: f}))
            )}
            displayMode="dropdown"
            locale={locale}
            required={false}
          />

          <ConfiguratorPicker
            axis="Pedestal Finish"
            value={pedestalFinish}
            onChange={setPedestalFinish}
            options={[{value: "", labelEn: "None", labelAr: "بدون"}].concat(
              DESK_TOP_FINISHES.map(f => ({value: f, labelEn: f, labelAr: f}))
            )}
            displayMode="dropdown"
            locale={locale}
            required={false}
          />
        </div>

        <LivePrice
          basePrice={basePrice}
          selections={selections}
          extraPriceLookup={extraPriceLookup}
          locale={locale}
          showBreakdown={true}
          isCustomQuote={isCustomQuote}
        />

        <div className="mt-6 space-y-2">
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-[#2C2C2C] text-white font-medium uppercase tracking-wide hover:bg-[#3A3A3A] transition-colors"
          >
            {isCustomQuote
              ? (isAr ? "طلب عرض سعر" : "Request Quote")
              : (isAr ? "أضف إلى السلة" : "Add to Cart")}
          </button>
          <button
            className="w-full py-3 border border-[#2C2C2C] text-[#2C2C2C] text-sm uppercase tracking-wide hover:bg-[#F7F7F7]"
          >
            {isAr ? "احفظ التكوين" : "Save Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}
