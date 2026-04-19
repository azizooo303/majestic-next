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

import {useState, useMemo, useEffect} from "react";
import type {DeskFamily} from "@/data/families";
import {
  DESK_TOP_FINISHES,
  DESK_TOP_FINISH_HEX,
  LEG_COLORS,
  CONFIG_EXTRA_PRICES,
  isValidCombo,
} from "@/data/families";
import {ConfiguratorPicker} from "@/components/shop/configurator-picker";
import {LivePrice} from "@/components/shop/live-price";
import {ProductViewer3D} from "@/components/product/product-viewer-3d";
import {getProduct3DModel} from "@/lib/products-3d";

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

  // If the current size isn't valid for the new config, snap to that config's first size.
  useEffect(() => {
    const valid = SIZE_OPTIONS_PER_CONFIG[config];
    if (!valid) return;
    if (!valid.includes(size)) setSize(valid[0]);
  }, [config, size]);

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
      <div className="bg-[#F7F7F7] lg:h-[600px] flex flex-col items-center justify-center relative">
        {family.hasGlb && getProduct3DModel(family.sku) ? (
          <>
            <ProductViewer3D
              model={getProduct3DModel(family.sku)!}
              name={isAr ? family.nameAr : family.nameEn}
              familySku={family.sku}
              topFinishName={finish}
              legColorName={leg}
            />
            {config !== "Executive" && (
              <div className="absolute top-3 left-3 bg-white/90 text-[#3A3A3A] text-[10px] uppercase tracking-wider px-3 py-1.5 border border-[#D4D4D4]">
                {isAr
                  ? `معاينة ثلاثية الأبعاد: تنفيذي فقط (${config} قريباً)`
                  : `3D preview: Executive only (${config} coming soon)`}
              </div>
            )}
          </>
        ) : (
          <div className="text-[#3A3A3A] text-center aspect-square w-full flex items-center justify-center">
            <div>
              <div className="text-sm uppercase tracking-wider">{family.nameEn}</div>
              <div className="text-xs mt-2">{isAr ? "قريباً" : "3D coming soon"}</div>
            </div>
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
              swatchHex: DESK_TOP_FINISH_HEX[f] ?? "#D4B895",
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
              swatchHex:
                l === "Black Powder Coat"  ? "#2B2B2B" :
                l === "White Powder Coat"  ? "#F4F4F4" :
                l === "Silver Powder Coat" ? "#9A9CA0" :
                l === "Polished Chrome"    ? "#D9D9D9" :
                "#E0E0E0",
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
