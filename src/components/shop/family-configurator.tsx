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

import {useState, useEffect, useMemo} from "react";
import type {DeskFamily} from "@/data/families";
import {
  DESK_TOP_FINISHES,
  DESK_TOP_FINISH_HEX,
  DESK_TOP_FINISH_TEXTURE,
  LEG_COLORS,
  CONFIG_EXTRA_PRICES,
  isValidCombo,
} from "@/data/families";
import {ConfiguratorPicker} from "@/components/shop/configurator-picker";
import {LivePrice} from "@/components/shop/live-price";
import {ProductViewer3D} from "@/components/product/product-viewer-3d";
import {AssemblyViewer} from "@/components/product/assembly-viewer";
import {getProduct3DModel} from "@/lib/products-3d";
import type {FamilyManifest, AssemblyState} from "@/lib/scene-composer";
import {accessoryAxesInConfig, DIVIDER_COLOR_MATERIAL, DEFAULT_DIVIDER_COLOR} from "@/lib/scene-composer";

// Family slug -> manifest URL. Families present here use the part-composition
// viewer; others fall back to the single-GLB <ProductViewer3D>.
const FAMILY_MANIFEST_URL: Record<string, string> = {
  cratos:  "/3d-parts/cratos/manifest.json",
  lyra:    "/3d-parts/lyra/manifest.json",
  newton:  "/3d-parts/newton/manifest.json",
  semina:  "/3d-parts/semina/manifest.json",
  diamond: "/3d-parts/diamond/manifest.json",
  nepton:  "/3d-parts/nepton/manifest.json",
  maximus: "/3d-parts/maximus/manifest.json",
  davinci: "/3d-parts/davinci/manifest.json",
  tesla:   "/3d-parts/tesla/manifest.json",
  beauty:  "/3d-parts/beauty/manifest.json",
};

/** Return the accessory axes that have at least one part in this config's manifest. */
function accessoryAxesForCurrentConfig(
  manifest: FamilyManifest,
  config: string,
): string[] {
  const cfg = manifest.configs[config];
  if (!cfg) return [];
  return accessoryAxesInConfig(cfg);
}

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
  // Meeting tables — rectangle tops by seating count.
  "Meeting 4-Person": ["120x120", "140x140", "CUSTOM"],
  "Meeting 6-Person": ["180x90", "240x100", "CUSTOM"],
  "Meeting (Large)": ["300x110", "360x120", "420x140", "CUSTOM"],
  // Workstation cluster — size refers to per-seat desktop
  "Workstation 6-Person": ["120x60", "140x70", "160x80", "CUSTOM"],
  // Non-desk product types
  "Storage Credenza": ["120x40", "160x40", "180x40", "CUSTOM"],
  "Tall Credenza":    ["80x40x180", "100x40x180", "CUSTOM"],
  "Coffee Table":     ["120x60", "140x70", "CUSTOM"],
  "Shelf Credenza":   ["160x40", "200x40", "CUSTOM"],
  "Meeting":          ["180x90", "240x100", "300x110", "CUSTOM"],    // Semina generic meeting
  "Workstation":      ["120x60", "140x70", "160x80", "CUSTOM"],       // Semina generic WS
  "Custom (Contact Us)": ["CUSTOM"],
  "Height-Adjustable": ["120x60", "140x70", "160x80", "180x80", "CUSTOM"],
};

const SIZE_EXTRA_PRICES: Record<string, number> = {
  "120x60": 0, "140x60": 0, "140x70": 100, "160x70": 150, "160x80": 200,
  "180x80": 300, "180x90": 400, "200x80": 500, "200x100": 650,
  "220x90": 700, "220x100": 800, "240x100": 900, "300x110": 1200, "360x120": 1500,
  // Meeting table sizes
  "120x120": 300, "140x140": 500, "420x140": 2000,
  // Credenza / coffee table / semina sizes
  "120x40": 200, "160x40": 400, "180x40": 500, "200x40": 600,
  "80x40x180": 700, "100x40x180": 900,
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
  const [dividerColor, setDividerColor] = useState<string>(DEFAULT_DIVIDER_COLOR);

  // If the current size isn't valid for the new config, snap to that config's first size.
  // React 19 pattern: derived state during render — avoids setState-in-effect cascade.
  const [prevConfig, setPrevConfig] = useState(config);
  if (prevConfig !== config) {
    setPrevConfig(config);
    const valid = SIZE_OPTIONS_PER_CONFIG[config];
    if (valid && !valid.includes(size)) {
      setSize(valid[0]);
    }
  }

  // Accessory picker state — one boolean per accessory axis. Each axis only
  // appears in the UI if the current config's manifest has a part on it.
  //
  // Screens default ON — SYS-CRATOS-WS-6P carries real full-size fabric
  // acoustic dividers (verified 2026-04-20). In configs where the classifier
  // catches tiny decorative plates instead of real panels, they render as
  // near-invisible specks, not broken visuals. Always-on is the honest default.
  const [accessories, setAccessories] = useState<Record<string, boolean>>({
    modesty: true,
    pedestal: true,       // show drawer unit when config has one
    cable_tray: true,
    cable_spine: true,
    grommet: true,
    powerbox: true,       // no geometry yet in masters, still auto-hides per config
    screen_front: true,   // real fabric dividers in Workstation 6P
    screen_side: true,
  });

  // Fetch the family's parts manifest on mount (if one exists).
  const [manifest, setManifest] = useState<FamilyManifest | null>(null);
  useEffect(() => {
    const url = FAMILY_MANIFEST_URL[family.slug];
    if (!url) return;
    let cancelled = false;
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: FamilyManifest | null) => {
        if (!cancelled) setManifest(data);
      })
      .catch((err) => console.warn("[configurator] manifest fetch failed", err));
    return () => { cancelled = true; };
  }, [family.slug]);

  const useAssemblyViewer = !!manifest && !!manifest.configs[config];

  const assemblyState: AssemblyState = {
    config,
    size,
    topFinishName: finish,
    legColorName: leg,
    dividerColorName: dividerColor,
    accessories,
  };

  // Does the current config have any fabric divider parts?
  const configHasDividers = useMemo(() => {
    if (!manifest) return false;
    const cfg = manifest.configs[config];
    if (!cfg) return false;
    return Object.keys(cfg.parts).some((k) => k.startsWith("screen_front") || k.startsWith("screen_side"));
  }, [manifest, config]);

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
                       "120x120", "140x140", "420x140",
                       "120x40", "160x40", "180x40", "200x40", "80x40x180", "100x40x180",
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

  // Smart viewer background:
  // Default = warm off-white (actiu-style, softer than #F5F5F5).
  // Switch to neutral grey ONLY when the user selects a white top or white legs,
  // otherwise white-on-white would wash out the product.
  const isWhiteTop = finish === "Premium White" || /white/i.test(finish);
  const isWhiteLegs = /white/i.test(leg);
  const viewerBg = isWhiteTop || isWhiteLegs ? "#E8E8E8" : "#F7F4EE";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto items-start">
      {/* Left — 3D viewer / hero. Wrapper + sticky inner pattern: the outer
          div is a normal grid item (no stretch thanks to items-start on the
          grid); the inner div is position:sticky so it pins to top-6 while
          the right column scrolls past. */}
      <div className="lg:sticky lg:top-6 self-start w-full">
      <div
        className="h-[420px] lg:h-[600px] flex flex-col items-center justify-center relative border border-[#E7E7E7] transition-colors"
        style={{ backgroundColor: viewerBg }}
      >
        {useAssemblyViewer && manifest ? (
          <AssemblyViewer
            manifest={manifest}
            state={assemblyState}
            name={isAr ? family.nameAr : family.nameEn}
          />
        ) : family.hasGlb && getProduct3DModel(family.sku, config) ? (
          <>
            <ProductViewer3D
              model={getProduct3DModel(family.sku, config)!}
              name={isAr ? family.nameAr : family.nameEn}
              familySku={family.sku}
              config={config}
              topFinishName={finish}
              legColorName={leg}
            />
            {!getProduct3DModel(family.sku, config)?.label?.includes(config) && (
              <div className="absolute top-3 left-3 bg-white/90 text-[#3A3A3A] text-[10px] uppercase tracking-[0.14em] px-3 py-1.5 border border-[#D4D4D4]">
                {isAr
                  ? `معاينة: ${config} قريباً`
                  : `3D preview: ${config} coming soon`}
              </div>
            )}
          </>
        ) : (
          <div className="text-[#3A3A3A] text-center aspect-square w-full flex items-center justify-center">
            <div>
              <p className="overline">{family.nameEn}</p>
              <p className="text-[12px] text-[#3A3A3A] mt-2">{isAr ? "قريباً" : "3D coming soon"}</p>
            </div>
          </div>
        )}
      </div>
      </div>{/* /sticky wrapper */}

      {/* Right — picker */}
      <div className="space-y-5">
        {/* Category eyebrow — kit overline */}
        <p className="overline">
          {isAr ? "تشكيلة المكاتب" : "Desk Collection"}
        </p>

        {/* Product H1 — kit editorial scale */}
        <h1 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#2C2C2C] leading-[1.15] tracking-[-0.01em]">
          {isAr ? family.nameAr : family.nameEn}
        </h1>

        {/* Brand line */}
        <p className="text-[14px] text-[#3A3A3A]">
          {isAr ? "ماجستيك · صُنع للمشاريع" : "Majestic · Built for contract"}
        </p>

        {family.tagline && (
          <p className="text-[15px] text-[#3A3A3A] leading-[1.6] max-w-prose">
            {isAr ? family.tagline.ar : family.tagline.en}
          </p>
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
              swatchImage: DESK_TOP_FINISH_TEXTURE[f],
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

          {/* Divider (acoustic panel) fabric color — only shown if current config
              actually has fabric divider parts. 7 colors matching workspace.sa's
              Eilif-style acoustic panel catalog. */}
          {configHasDividers && (
            <ConfiguratorPicker
              axis="Divider Color"
              value={dividerColor}
              onChange={setDividerColor}
              options={Object.entries(DIVIDER_COLOR_MATERIAL).map(([key, entry]) => ({
                value: key,
                labelEn: entry.label,
                labelAr: entry.label,
                swatchHex: entry.hex,
              }))}
              displayMode="color-swatch"
              locale={locale}
            />
          )}

          {/* Accessory toggles — only shown when the current config has a part
              on that axis in the manifest. Uses ACCESSORY_AXIS to introspect. */}
          {useAssemblyViewer && manifest && (
            <div className="mb-6">
              <h4 className="text-[#2C2C2C] font-medium text-sm uppercase tracking-wide mb-2">
                {isAr ? "ملحقات" : "Accessories"}
              </h4>
              <div className="flex flex-wrap gap-3">
                {(() => {
                  const axes = accessoryAxesForCurrentConfig(manifest, config);
                  const labels: Record<string, { en: string; ar: string }> = {
                    modesty:      { en: "Modesty panel",    ar: "لوحة أمامية" },
                    pedestal:     { en: "Pedestal drawer",  ar: "خزانة جانبية" },
                    cable_tray:   { en: "Cable tray",       ar: "حامل الكابلات" },
                    cable_spine:  { en: "Cable spine",      ar: "عمود الكابلات" },
                    grommet:      { en: "Cable grommets",   ar: "فتحات الكابلات" },
                    powerbox:     { en: "Powerbox / outlet",ar: "صندوق الطاقة" },
                    screen_front: { en: "Front divider",    ar: "فاصل أمامي" },
                    screen_side:  { en: "Side divider",     ar: "فاصل جانبي" },
                  };
                  return axes.map((axis) => {
                    const label = labels[axis] || { en: axis, ar: axis };
                    const on = !!accessories[axis];
                    return (
                      <label
                        key={axis}
                        className={[
                          "flex items-center gap-2 px-3 py-2 border cursor-pointer select-none text-sm transition-colors",
                          on
                            ? "border-[#2C2C2C] bg-[#2C2C2C] text-white"
                            : "border-[#D4D4D4] text-[#2C2C2C] hover:border-[#3A3A3A]",
                        ].join(" ")}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={(e) =>
                            setAccessories((prev) => ({ ...prev, [axis]: e.target.checked }))
                          }
                          className="sr-only"
                        />
                        <span>{on ? "✓" : "○"}</span>
                        <span>{isAr ? label.ar : label.en}</span>
                      </label>
                    );
                  });
                })()}
              </div>
            </div>
          )}

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

        {/* Spec grid — kit editorial style */}
        <hr className="border-[#D4D4D4] mt-6" />
        <dl className="grid grid-cols-2 gap-x-6 gap-y-0 text-[13px] mt-4">
          <div className="flex items-baseline justify-between py-2 border-b border-dashed border-[#D4D4D4]">
            <dt className="text-[#3A3A3A]">{isAr ? "الضمان" : "Warranty"}</dt>
            <dd className="font-medium text-[#2C2C2C]">{isAr ? "10 سنوات" : "10 years"}</dd>
          </div>
          <div className="flex items-baseline justify-between py-2 border-b border-dashed border-[#D4D4D4]">
            <dt className="text-[#3A3A3A]">{isAr ? "مدة التوصيل" : "Lead time"}</dt>
            <dd className="font-medium text-[#2C2C2C]">{isAr ? "3–5 أسابيع" : "3–5 weeks"}</dd>
          </div>
          <div className="flex items-baseline justify-between py-2 border-b border-dashed border-[#D4D4D4]">
            <dt className="text-[#3A3A3A]">{isAr ? "الشحن من" : "Ships from"}</dt>
            <dd className="font-medium text-[#2C2C2C]">{isAr ? "الرياض" : "Riyadh"}</dd>
          </div>
          <div className="flex items-baseline justify-between py-2 border-b border-dashed border-[#D4D4D4]">
            <dt className="text-[#3A3A3A]">SKU</dt>
            <dd className="font-medium text-[#2C2C2C]">{family.sku}</dd>
          </div>
        </dl>
        <hr className="border-[#D4D4D4] mt-2" />

        <div className="mt-6 space-y-3">
          <button
            onClick={handleAddToCart}
            className="w-full h-11 bg-[#2C2C2C] text-white font-semibold text-[13px] rounded-none hover:bg-[#3A3A3A] active:scale-[0.98] transition-all"
          >
            {isCustomQuote
              ? (isAr ? "طلب عرض سعر" : "Request a Quote")
              : (isAr ? "أضف إلى السلة" : "Add to Cart")}
          </button>
          <button
            className="w-full h-11 border border-[#2C2C2C] text-[#2C2C2C] text-[13px] font-semibold rounded-none hover:bg-[#F5F5F5] active:scale-[0.98] transition-all"
          >
            {isAr ? "احفظ التكوين" : "Save Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}
