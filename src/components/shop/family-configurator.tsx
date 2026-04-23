/**
 * FamilyConfigurator — the full configurator experience.
 * Route: /[locale]/shop/[family]/page.tsx
 *
 * Redesign applied 2026-04-21 per Aziz-approved v2 prototype.
 * Phases 1–7 implemented (phase 6 = viewer chrome, phase 7 = editorial strip).
 *
 * Layout: two-column grid (viewer LEFT, configurator RIGHT).
 * Left col: sticky viewer + 5 viewpoint thumbnails. Nothing else on left.
 * Right col: title → 01 Config → 02 Finish → 03 Add-ons → sticky summary.
 * Below grid: full-width editorial strip (outside the grid).
 *
 * Brand rules:
 *   - No box-shadow anywhere. Border only: border:1px solid var(--border) or var(--fg).
 *   - No backdrop-filter. Use rgba(255,255,255,0.95) opaque.
 *   - No text-shadow.
 *   - Viewer bg: #F7F4EE (NOT #F1EEE7).
 *   - Monochrome: #2C2C2C fg, #3A3A3A fg-2, #FFFFFF bg, #D4D4D4 border, #F5F5F5 hover.
 *   - [dir="rtl"] letter-spacing:0 on all tracked elements.
 *   - Polished Chrome tile gradient is OK — it's a material preview, not decoration.
 */

"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { DeskFamily } from "@/data/families";
import {
  DESK_TOP_FINISHES,
  DESK_TOP_FINISH_HEX,
  FINISH_META,
  LEG_COLORS,
  CONFIG_EXTRA_PRICES,
  isValidCombo,
} from "@/data/families";
import { FinishLibrary } from "@/components/shop/finish-library";
import { DisclosureAxis } from "@/components/shop/disclosure-axis";
import { ProductViewer3D } from "@/components/product/product-viewer-3d";
import { AssemblyViewer } from "@/components/product/assembly-viewer";
import { getProduct3DModel } from "@/lib/products-3d";
import type { FamilyManifest, AssemblyState } from "@/lib/scene-composer";
import { accessoryAxesInConfig, DIVIDER_COLOR_MATERIAL, DEFAULT_DIVIDER_COLOR } from "@/lib/scene-composer";

// ─── Config serialization (decision 6: Save = localStorage + ?cfg= URL slug) ─
type SavedConfig = {
  config: string;
  size: string;
  finish: string;
  leg: string;
  sideUnit: string;
  pedestal: string;
  dividerColor: string;
  accessories: Record<string, boolean>;
};

function serializeConfig(cfg: SavedConfig): string {
  try {
    return btoa(encodeURIComponent(JSON.stringify(cfg)));
  } catch {
    return "";
  }
}

function deserializeConfig(raw: string): SavedConfig | null {
  try {
    return JSON.parse(decodeURIComponent(atob(raw))) as SavedConfig;
  } catch {
    return null;
  }
}

// ─── Manifest URLs ────────────────────────────────────────────────────────────
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
  simple:  "/3d-parts/simple/manifest.json",
};

function accessoryAxesForCurrentConfig(manifest: FamilyManifest, config: string): string[] {
  const cfg = manifest.configs[config];
  if (!cfg) return [];
  return accessoryAxesInConfig(cfg);
}

// ─── Types ────────────────────────────────────────────────────────────────────
type FamilyConfiguratorProps = {
  family: DeskFamily;
  basePrice: number;
  variations?: Array<{
    id: number;
    sku: string;
    attributes: Record<string, string>;
    price: number;
  }>;
  locale: "en" | "ar";
};

// ─── Size tables ──────────────────────────────────────────────────────────────
const SIZE_OPTIONS_PER_CONFIG: Record<string, string[]> = {
  "Executive":            ["160x80", "180x90", "200x100", "220x100", "CUSTOM"],
  "Manager":              ["140x70", "160x80", "180x80", "CUSTOM"],
  "Operator":             ["120x60", "140x60", "160x70", "CUSTOM"],
  "L-Shape":              ["160x80+120x60", "180x90+120x60", "CUSTOM"],
  "U-Shape":              ["180x90+2x120x60", "CUSTOM"],
  "Conference":           ["180x90", "240x100", "300x110", "360x120", "CUSTOM"],
  "Meeting 4-Person":     ["120x120", "140x140", "CUSTOM"],
  "Meeting 6-Person":     ["180x90", "240x100", "CUSTOM"],
  "Meeting (Large)":      ["300x110", "360x120", "420x140", "CUSTOM"],
  "Workstation 6-Person": ["120x60", "140x70", "160x80", "CUSTOM"],
  "Storage Credenza":     ["120x40", "160x40", "180x40", "1600x540", "CUSTOM"],
  "Tall Credenza":        ["80x40x180", "100x40x180", "CUSTOM"],
  "Coffee Table":         ["120x60", "140x70", "CUSTOM"],
  "Shelf Credenza":       ["1600x700", "2000x800", "2400x800", "3000x900", "CUSTOM"],
  "Meeting":              ["180x90", "240x100", "300x110", "CUSTOM"],
  "Workstation":          ["120x60", "140x70", "160x80", "CUSTOM"],
  "Custom (Contact Us)":  ["CUSTOM"],
  "Height-Adjustable":    ["120x60", "140x70", "160x80", "180x80", "CUSTOM"],
  "Open-Frame":           ["120x60", "140x70", "160x80", "180x80", "200x100", "CUSTOM"],
  // Simple family additions (2026-04-21 — protocol §4 onboarding)
  "Meeting 10-Person":    ["320x140", "360x140", "CUSTOM"],
  "Workstation 4-Person": ["140x70", "160x80", "CUSTOM"],
  "Coffee Table (1000)":  ["100x50", "120x60", "CUSTOM"],
  "Coffee Table (500)":   ["50x50", "60x60", "CUSTOM"],
  // Diamond family additions (2026-04-23 — Gate 4 wire-up)
  // Single-entry arrays for fixed-footprint configs — size axis renders but has one option.
  "Meeting 4P":           ["1200x1200"],
  "Meeting Large":        ["3200x4000"],
  "Workstation 4P":       ["2800x1400"],
  "Side Console":         ["1000x500"],
  // "L-Shape" already exists above (generic); Diamond overrides via manifest baseSize=null
  // "Coffee Table" already exists above; Diamond uses baseSize=60x60 (manifest)
  // "Storage Credenza" already exists above; Diamond size 1600x540 added to that entry
};

const SIZE_EXTRA_PRICES: Record<string, number> = {
  "120x60": 0, "140x60": 0, "140x70": 100, "160x70": 150, "160x80": 200,
  "180x80": 300, "180x90": 400, "200x80": 500, "200x100": 650,
  "220x90": 700, "220x100": 800, "240x100": 900, "300x110": 1200, "360x120": 1500,
  "120x120": 300, "140x140": 500, "420x140": 2000,
  "120x40": 200, "160x40": 400, "180x40": 500, "200x40": 600,
  "80x40x180": 700, "100x40x180": 900,
  "160x80+120x60": 400, "180x90+120x60": 600, "180x90+2x120x60": 900,
  // Diamond fixed-footprint sizes (2026-04-23 Gate 4) — single-option configs, no upcharge
  "1200x1200": 0, "3200x4000": 0, "2800x1400": 0, "1000x500": 0, "1600x540": 0,
  "CUSTOM": 0,
};

// ─── Config meta descriptions (Cratos complete; others left empty for families without meta) ─
const CONFIG_META: Record<string, { en: string; ar: string }> = {
  "Operator":             { en: "120–160 cm · Open plan", ar: "120–160 سم · خطة مفتوحة" },
  "Manager":              { en: "140–180 cm · Private office", ar: "140–180 سم · مكتب خاص" },
  "Executive":            { en: "160–220 cm · Single user · Modesty panel", ar: "160–220 سم · مستخدم واحد · لوح أمامي" },
  "L-Shape":              { en: "Desk + return · Fixed left or right", ar: "مكتب + ذراع جانبي · يسار أو يمين" },
  "U-Shape":              { en: "Desk + two returns · Full surround", ar: "مكتب + ذراعان · إحاطة كاملة" },
  "Conference":           { en: "Boardroom table · 180 to 360 cm", ar: "طاولة اجتماعات · 180 إلى 360 سم" },
  "Meeting 4-Person":     { en: "180×90 to 240×100", ar: "180×90 إلى 240×100" },
  "Meeting 6-Person":     { en: "180×90 to 240×100", ar: "180×90 إلى 240×100" },
  "Meeting (Large)":      { en: "300 cm and up · Boardroom", ar: "300 سم وما فوق · قاعة اجتماعات" },
  "Workstation 6-Person": { en: "Bench cluster · Dividers included", ar: "محطات متراصة · فواصل مشمولة" },
  "Storage Credenza":     { en: "120–180 cm · Under-desk storage", ar: "120–180 سم · تخزين تحت المكتب" },
  "Tall Credenza":        { en: "180 cm tall · Side storage unit", ar: "180 سم ارتفاعاً · وحدة تخزين جانبية" },
  "Coffee Table":         { en: "Low table · Lounge setting", ar: "طاولة منخفضة · بيئة لاونج" },
  "Shelf Credenza":       { en: "1600–3000 mm · Reception shelf credenza", ar: "1600–3000 مم · خزانة أرفف للاستقبال" },
  "Meeting":              { en: "Meeting table", ar: "طاولة اجتماعات" },
  "Workstation":          { en: "Open-plan workstation", ar: "محطة عمل خطة مفتوحة" },
  "Height-Adjustable":    { en: "Motorised · 680–1,200 mm range", ar: "كهربائي · نطاق 680–1,200 مم" },
  "Custom (Contact Us)":  { en: "Non-standard footprint, special finish, bespoke details", ar: "مقاسات غير نمطية، تشطيب خاص، تفاصيل مخصصة" },
  // Diamond family — short-form config keys matching manifest (2026-04-23 Gate 4)
  "Meeting 4P":           { en: "1200×1200 · 4-person round/square", ar: "1200×1200 · 4 أشخاص" },
  "Meeting Large":        { en: "3200×4000 · Boardroom", ar: "3200×4000 · قاعة اجتماعات" },
  "Workstation 4P":       { en: "2800×1400 · 4-person cluster · Screens included", ar: "2800×1400 · 4 محطات · فواصل مشمولة" },
  "Side Console":         { en: "1000×500 · Under-desk side storage", ar: "1000×500 · وحدة تخزين جانبية" },
};

// ─── Leg tile config ──────────────────────────────────────────────────────────
const LEG_TILE_CONFIG: Record<string, { bg: string; textColor: string; isGradient?: boolean }> = {
  "Polished Chrome":    { bg: "linear-gradient(135deg,#E5E6E8,#B9BBBE)", textColor: "#2C2C2C", isGradient: true },
  "Black Powder Coat":  { bg: "#2B2B2B",   textColor: "#FFFFFF" },
  "White Powder Coat":  { bg: "#F4F4F4",   textColor: "#2C2C2C" },
  "Silver Powder Coat": { bg: "#9A9CA0",   textColor: "#FFFFFF" },
};

// ─── Accessory labels ─────────────────────────────────────────────────────────
const ACCESSORY_LABELS: Record<string, { en: string; ar: string; price: number }> = {
  modesty:      { en: "Modesty panel",     ar: "لوحة أمامية",      price: 260 },
  pedestal:     { en: "Pedestal drawer",   ar: "خزانة جانبية",     price: 900 },
  cable_tray:   { en: "Cable tray",        ar: "حامل الكابلات",    price: 120 },
  cable_spine:  { en: "Cable spine",       ar: "عمود الكابلات",    price: 220 },
  grommet:      { en: "Grommets ×2",       ar: "فتحات الكابلات",   price: 80  },
  powerbox:     { en: "Powerbox (2× SA, 2× USB-C)", ar: "صندوق الطاقة (2× SA, 2× USB-C)", price: 480 },
  screen_front: { en: "Front divider",     ar: "فاصل أمامي",       price: 0   },
  screen_side:  { en: "Side divider",      ar: "فاصل جانبي",       price: 0   },
};

// ─── SVG check icon (inline — no unicode) ─────────────────────────────────────
function CheckSvg() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// ─── Chevron down icon ────────────────────────────────────────────────────────
function ChevronSvg({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ─── Parse size string to mm dimensions ──────────────────────────────────────
function parseSizeMm(size: string): { w: number; d: number } | null {
  const m = size.match(/^(\d+)x(\d+)/);
  if (!m) return null;
  return { w: parseInt(m[1], 10) * 10, d: parseInt(m[2], 10) * 10 };
}

// ─── Format SAR with locale ───────────────────────────────────────────────────
function formatSAR(n: number, isAr: boolean) {
  return n.toLocaleString(isAr ? "ar-SA" : "en-US");
}

// ─── Viewpoint thumbnail SVGs ─────────────────────────────────────────────────
const VIEWPOINT_THUMBS = [
  {
    labelEn: "Three-quarter", labelAr: "ثلاثة أرباع",
    svg: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-[60%] h-[60%] opacity-55"><path d="M6 24l14-8 14 8-14 8Z"/><path d="M14 26v6M26 26v6"/></svg>,
  },
  {
    labelEn: "Front", labelAr: "أمامي",
    svg: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-[60%] h-[60%] opacity-55"><rect x="6" y="14" width="28" height="4"/><path d="M10 18v12M30 18v12"/></svg>,
  },
  {
    labelEn: "Top", labelAr: "علوي",
    svg: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-[60%] h-[60%] opacity-55"><rect x="6" y="14" width="28" height="12"/></svg>,
  },
  {
    labelEn: "Detail", labelAr: "تفصيل",
    svg: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-[60%] h-[60%] opacity-55"><circle cx="20" cy="20" r="8"/><path d="M20 14v12M14 20h12"/></svg>,
  },
  {
    labelEn: "In room", labelAr: "في الغرفة",
    svg: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-[60%] h-[60%] opacity-55"><path d="M6 32V10l14-4 14 4v22"/><path d="M6 32h28M16 32V20h8v12"/></svg>,
  },
];

// ─── Animated price hook (decision 8: count-up from old→new in 250ms) ────────
// Separate from pricePulse (color flash 450ms). Both run simultaneously.
// Respects prefers-reduced-motion: jumps straight to target when reduced.
function useAnimatedPrice(target: number, duration = 250): number {
  const [displayed, setDisplayed] = useState(target);
  const prevRef = useRef(target);
  const rafRef  = useRef<number | null>(null);

  useEffect(() => {
    const from = prevRef.current;
    if (from === target) return;
    prevRef.current = target;

    // Check reduced motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplayed(target);
      return;
    }

    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return displayed;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function FamilyConfigurator({ family, basePrice, locale }: FamilyConfiguratorProps) {
  const isAr = locale === "ar";
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ── Resolve initial state — prefer ?cfg= param, then defaults ────────────
  const initialState = (() => {
    const raw = searchParams.get("cfg");
    if (raw) {
      const saved = deserializeConfig(raw);
      if (saved && family.configs.includes(saved.config)) return saved;
    }
    return null;
  })();

  // ── Picker state ──────────────────────────────────────────────────────────
  const [config, setConfig]               = useState(initialState?.config ?? family.configs[0] ?? "Executive");
  const [size, setSize]                   = useState(initialState?.size ?? SIZE_OPTIONS_PER_CONFIG[initialState?.config ?? family.configs[0]]?.[0] ?? "160x80");
  const [finish, setFinish]               = useState<string>(initialState?.finish ?? DESK_TOP_FINISHES[0]);
  // Base finish (wood-on-wood axis, credenzas only). Defaults to a second decor
  // so the two-tone reads visibly on first load. Ignored by families without a
  // `base` role in their manifest.
  const [baseFinish, setBaseFinish]       = useState<string>(DESK_TOP_FINISHES[1] ?? DESK_TOP_FINISHES[0]);
  const [leg, setLeg]                     = useState<string>(initialState?.leg ?? "Polished Chrome");
  const [sideUnitOption, setSideUnitOpt]  = useState<string>(initialState?.sideUnit ?? "");
  const [pedestalOption, setPedestalOpt]  = useState<string>(initialState?.pedestal ?? "");
  const [dividerColor, setDividerColor]   = useState<string>(initialState?.dividerColor ?? DEFAULT_DIVIDER_COLOR);
  const [activeThumb, setActiveThumb]     = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [pricePulse, setPricePulse]       = useState(false);
  const prevPriceRef = useRef<number>(basePrice);

  // Config snap: when Config changes, snap to first valid size.
  const [prevConfig, setPrevConfig] = useState(config);
  if (prevConfig !== config) {
    setPrevConfig(config);
    const valid = SIZE_OPTIONS_PER_CONFIG[config];
    if (valid && !valid.includes(size)) {
      setSize(valid[0]);
    }
  }

  // ── Accessory state ───────────────────────────────────────────────────────
  const [accessories, setAccessories] = useState<Record<string, boolean>>(
    initialState?.accessories ?? {
      modesty:      true,
      pedestal:     true,
      cable_tray:   true,
      cable_spine:  true,
      grommet:      true,
      powerbox:     true,
      screen_front: true,
      screen_side:  true,
    }
  );

  // ── Save handler (decision 6: localStorage + ?cfg= URL param) ────────────
  function handleSave() {
    const cfg: SavedConfig = {
      config, size, finish, leg,
      sideUnit: sideUnitOption,
      pedestal: pedestalOption,
      dividerColor,
      accessories,
    };
    const encoded = serializeConfig(cfg);
    if (!encoded) return;
    // Write to localStorage under family-scoped key
    try {
      localStorage.setItem(`majestic-cfg-${family.slug}`, encoded);
    } catch {
      // localStorage unavailable (private browsing, storage full) — silent
    }
    // Update URL with ?cfg= param without triggering a navigation/scroll
    const params = new URLSearchParams(searchParams.toString());
    params.set("cfg", encoded);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  // ── Manifest fetch ────────────────────────────────────────────────────────
  const [manifest, setManifest] = useState<FamilyManifest | null>(null);
  useEffect(() => {
    const url = FAMILY_MANIFEST_URL[family.slug];
    if (!url) return;
    let cancelled = false;
    fetch(url)
      .then((r) => r.ok ? r.json() : null)
      .then((data: FamilyManifest | null) => { if (!cancelled) setManifest(data); })
      .catch((err) => console.warn("[cfg] manifest fetch failed", err));
    return () => { cancelled = true; };
  }, [family.slug]);

  const useAssemblyViewer = !!manifest && !!manifest.configs[config];

  const assemblyState: AssemblyState = {
    config, size,
    topFinishName: finish,
    legColorName: leg,
    dividerColorName: dividerColor,
    baseFinishName: baseFinish,
    accessories,
  };

  const configHasDividers = useMemo(() => {
    if (!manifest) return false;
    const cfg = manifest.configs[config];
    if (!cfg) return false;
    return Object.keys(cfg.parts).some((k) => k.startsWith("screen_front") || k.startsWith("screen_side"));
  }, [manifest, config]);

  // Credenzas (Beauty, etc.) have a `base` role that swaps wood independently
  // from the top. Used to show a Base Finish picker in place of the Frame
  // Colour picker.
  const hasBaseRole = useMemo(() => {
    if (!manifest) return false;
    const cfg = manifest.configs[config];
    if (!cfg) return false;
    return Object.keys(cfg.parts).some((k) => k === "base" || k.startsWith("base_"));
  }, [manifest, config]);

  const isCustomQuote = config === "Custom (Contact Us)" || size === "CUSTOM";

  // ── Price calculation ─────────────────────────────────────────────────────
  const configExtra = CONFIG_EXTRA_PRICES[config] || 0;
  const sizeExtra   = SIZE_EXTRA_PRICES[size] || 0;
  const sideExtra   = sideUnitOption === "match" ? 1400 : 0;
  const pedExtra    = pedestalOption === "match"  ? 900  : 0;
  const accTotal = useMemo(() => {
    if (!manifest) return 0;
    const axes = accessoryAxesForCurrentConfig(manifest, config);
    return axes.reduce((sum, axis) => {
      if (!accessories[axis]) return sum;
      return sum + (ACCESSORY_LABELS[axis]?.price ?? 0);
    }, 0);
  }, [manifest, config, accessories]);

  const total = basePrice + configExtra + sizeExtra + sideExtra + pedExtra + accTotal;

  // Pulse on price change — defer both setState calls to avoid sync-setState-in-effect lint error.
  useEffect(() => {
    if (total !== prevPriceRef.current) {
      prevPriceRef.current = total;
      const on  = setTimeout(() => setPricePulse(true),  0);
      const off = setTimeout(() => setPricePulse(false), 500);
      return () => { clearTimeout(on); clearTimeout(off); };
    }
  }, [total]);

  // ── Animated price (count-up 250ms, decision 8) ──────────────────────────
  const animatedTotal = useAnimatedPrice(total);

  // ── Exclusions ────────────────────────────────────────────────────────────
  const validSizes = SIZE_OPTIONS_PER_CONFIG[config] || [];
  const excludedLegs = useMemo(() => (
    LEG_COLORS.filter(l => !isValidCombo(family.sku, config, size, l).valid)
  ), [family.sku, config, size]);

  // ── Viewer background ─────────────────────────────────────────────────────
  const viewerBg = (finish === "Premium White" && leg === "White Powder Coat") ? "#E8E8E8" : "#F7F4EE";

  // ── Cart handler ──────────────────────────────────────────────────────────
  async function handleAddToCart() {
    if (isCustomQuote) {
      window.location.href = `/${locale}/quotation?family=${family.slug}&size=${size}&finish=${finish}&leg=${leg}`;
      return;
    }
    console.log("Add to cart:", { family: family.sku, config, size, finish, leg, sideUnitOption, pedestalOption });
  }

  // ── Dimensions from size ──────────────────────────────────────────────────
  const dims = parseSizeMm(size);

  // ── Summary lines ─────────────────────────────────────────────────────────
  const activeSideUnit = sideUnitOption === "match" ? (isAr ? "مطابق للسطح" : "Match desktop") : (sideUnitOption === "custom" ? (isAr ? "مخصص" : "Custom") : null);
  const activePedestal = pedestalOption === "match" ? (isAr ? "مطابق للسطح" : "Match desktop") : (pedestalOption === "custom" ? (isAr ? "مخصص" : "Custom") : null);
  const accessoryCount = manifest ? accessoryAxesForCurrentConfig(manifest, config).filter(a => accessories[a]).length : 0;

  // ── Breakdown rows ────────────────────────────────────────────────────────
  const breakdownRows: Array<[string, number]> = [];
  breakdownRows.push([isAr ? `${family.nameAr} — الأساسي` : `${family.nameEn} — base`, basePrice]);
  if (configExtra > 0) breakdownRows.push([isAr ? `النوع · ${config}` : `Type · ${config}`, configExtra]);
  if (sizeExtra   > 0) breakdownRows.push([isAr ? `المقاس · ${size}` : `Size · ${size}`, sizeExtra]);
  if (sideExtra   > 0) breakdownRows.push([isAr ? "وحدة جانبية" : "Side unit", sideExtra]);
  if (pedExtra    > 0) breakdownRows.push([isAr ? "خزانة أدراج" : "Pedestal", pedExtra]);
  if (accTotal    > 0) breakdownRows.push([isAr ? "ملحقات" : "Accessories", accTotal]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main id="main-content" className="flex-1 bg-white min-h-screen">

      {/* ═══════════════════════════════════════════════════════════════════
          TWO-COLUMN GRID — viewer LEFT, configurator RIGHT
          align-items:stretch so left col grows tall with right col.
          items-stretch is critical: the viewer sticks inside a tall column.
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_440px] max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-7 items-stretch"
        style={{ gap: "56px" }}
      >

        {/* ── LEFT: Viewer column ─────────────────────────────────────────
            Nothing in this column except sticky viewer + thumbnail row.
            The sticky wrapper lets the viewer stay in view while the
            right column (configurator) scrolls past it.
            ──────────────────────────────────────────────────────────────── */}
        <div className="flex flex-col min-w-0">
          <div className="lg:sticky lg:top-28 flex flex-col gap-3">

            {/* Viewer */}
            <div
              className="relative border border-[#E7E7E7] overflow-hidden transition-colors duration-[400ms]"
              style={{
                backgroundColor: viewerBg,
                height: "min(calc(100vh - 200px), 620px)",
              }}
              aria-label={isAr ? "معاينة ثلاثية الأبعاد" : "3D product preview"}
            >
              {/* Corner brackets — decorative architectural mark */}
              <span className="absolute top-4 left-4 w-[18px] h-[18px] border-t border-l border-[#2C2C2C] pointer-events-none" aria-hidden="true" />
              <span className="absolute bottom-4 right-4 w-[18px] h-[18px] border-b border-r border-[#2C2C2C] pointer-events-none" aria-hidden="true" />

              {/* Live preview chip */}
              <div
                className={[
                  "absolute top-4 left-1/2 -translate-x-1/2 flex gap-1 items-center",
                  "bg-white/95 px-3 py-1.5 border border-[#E7E7E7]",
                  "text-[10.5px] text-[#3A3A3A] uppercase z-10",
                  isAr ? "tracking-normal" : "tracking-[0.18em]",
                ].join(" ")}
              >
                <span className="w-[5px] h-[5px] rounded-full bg-[#2C2C2C]" aria-hidden="true" />
                {isAr ? "معاينة حية · اسحب للتدوير" : "Live preview · Drag to rotate"}
              </div>

              {/* Viewer content */}
              {useAssemblyViewer && manifest ? (
                <AssemblyViewer
                  manifest={manifest}
                  state={assemblyState}
                  name={isAr ? family.nameAr : family.nameEn}
                  backgroundColor={viewerBg}
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
                    backgroundColor={viewerBg}
                  />
                  {!getProduct3DModel(family.sku, config)?.label?.includes(config) && (
                    <div className="absolute top-3 left-3 bg-white/90 text-[#3A3A3A] text-[10px] uppercase px-3 py-1.5 border border-[#D4D4D4]"
                      style={{ letterSpacing: isAr ? "0" : "0.14em" }}>
                      {isAr ? `معاينة: ${config} قريباً` : `3D preview: ${config} coming soon`}
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[#3A3A3A] text-center">
                  <div>
                    <p className="overline">{isAr ? family.nameAr : family.nameEn}</p>
                    <p className="text-[12px] text-[#3A3A3A] mt-2">{isAr ? "قريباً" : "3D coming soon"}</p>
                  </div>
                </div>
              )}

              {/* Dims chip — bottom left */}
              {dims && (
                <div
                  className={[
                    "absolute bottom-4 left-4",
                    "bg-white/95 px-2.5 py-1.5 border border-[#E7E7E7]",
                    "text-[10.5px] text-[#3A3A3A] tabular-nums z-10",
                    isAr ? "tracking-normal" : "tracking-[0.16em]",
                  ].join(" ")}
                >
                  {isAr
                    ? `ع ${dims.w} × ع ${dims.d} × ع 740 مم`
                    : `W ${dims.w} × D ${dims.d} × H 740 MM`}
                </div>
              )}

              {/* Viewer controls — bottom center */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex border border-[#D4D4D4] bg-white z-10">
                {[
                  { titleEn: "Rotate", titleAr: "تدوير", svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg> },
                  { titleEn: "Zoom",   titleAr: "تكبير", svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6M11 8v6"/></svg> },
                  { titleEn: "Reset",  titleAr: "إعادة", svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/></svg> },
                ].map((btn, i) => (
                  <button
                    key={btn.titleEn}
                    title={isAr ? btn.titleAr : btn.titleEn}
                    className={[
                      "w-9 h-9 flex items-center justify-center text-[#2C2C2C]",
                      "hover:bg-[#F5F5F5] transition-colors",
                      i < 2 ? "border-r border-[#D4D4D4]" : "",
                    ].join(" ")}
                    aria-label={isAr ? btn.titleAr : btn.titleEn}
                  >
                    {btn.svg}
                  </button>
                ))}
              </div>

              {/* View in AR — bottom right */}
              <button
                className={[
                  "absolute bottom-4 right-4",
                  "flex items-center gap-2",
                  "bg-white border border-[#D4D4D4] px-3.5 py-2.5",
                  "text-[11px] text-[#2C2C2C] uppercase z-10",
                  "hover:bg-[#F5F5F5] transition-colors",
                  isAr ? "tracking-normal" : "tracking-[0.14em]",
                ].join(" ")}
                aria-label={isAr ? "عرض في الواقع المعزز" : "View in AR"}
                onClick={() => { /* stub — wire to model-viewer AR entry */ }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M12 2 3 7v10l9 5 9-5V7Z"/><path d="m3 7 9 5 9-5M12 12v10"/>
                </svg>
                {isAr ? "عرض AR" : "View in AR"}
              </button>
            </div>

            {/* 5 viewpoint thumbnails */}
            <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(5, 1fr)" }} role="group" aria-label={isAr ? "زوايا العرض" : "Camera viewpoints"}>
              {VIEWPOINT_THUMBS.map((thumb, i) => (
                <button
                  key={thumb.labelEn}
                  type="button"
                  title={isAr ? thumb.labelAr : thumb.labelEn}
                  aria-label={isAr ? thumb.labelAr : thumb.labelEn}
                  aria-pressed={activeThumb === i}
                  onClick={() => setActiveThumb(i)}
                  className={[
                    "aspect-square flex items-center justify-center",
                    "bg-[#FAFAF8] border border-[#E7E7E7]",
                    "text-[#3A3A3A] cursor-pointer transition-colors",
                    activeThumb === i
                      ? "border-[#2C2C2C] outline outline-1 outline-[#2C2C2C] outline-offset-[-2px]"
                      : "hover:border-[#3A3A3A]",
                  ].join(" ")}
                >
                  {thumb.svg}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* /LEFT col — viewer only, nothing else */}

        {/* ── RIGHT: Configurator column ──────────────────────────────────── */}
        <div className="flex flex-col min-w-0">

          {/* Lead time note */}
          <div className={[
            "inline-flex items-center gap-2 self-start",
            "bg-[#FAFAF8] border border-[#E7E7E7] px-2.5 py-1.5 mb-4",
            "text-[10.5px] text-[#3A3A3A] uppercase",
            isAr ? "tracking-normal" : "tracking-[0.16em]",
          ].join(" ")}>
            <span className="w-1 h-1 rounded-full bg-[#2C2C2C]" aria-hidden="true" />
            {isAr ? "صُنع بالطلب · 3–5 أسابيع وقت توصيل" : "Built to order · 3–5 weeks lead time"}
          </div>

          {/* Category eyebrow */}
          <p className={[
            "text-[11px] text-[#3A3A3A] uppercase mb-3.5",
            isAr ? "tracking-normal" : "tracking-[0.18em]",
          ].join(" ")}>
            {isAr ? "تشكيلة المكاتب" : "Desk Collection"}
          </p>

          {/* Product H1 */}
          <h1 className={[
            "text-[40px] md:text-[44px] font-bold text-[#2C2C2C] leading-[1.08] mb-2.5",
            isAr ? "tracking-normal" : "tracking-[-0.015em]",
          ].join(" ")}>
            {isAr ? family.nameAr : family.nameEn}
          </h1>

          {/* Brand line */}
          <p className={[
            "text-[14px] text-[#3A3A3A] mb-2",
            isAr ? "tracking-normal" : "",
          ].join(" ")}>
            {isAr ? "ماجستيك · صُنع للمشاريع" : "Majestic · Built for contract"}
          </p>

          {family.tagline && (
            <p className={[
              "text-[15px] text-[#3A3A3A] leading-[1.55] max-w-[42ch]",
              "pb-7 border-b border-[#D4D4D4]",
              isAr ? "tracking-normal" : "",
            ].join(" ")}>
              {isAr ? family.tagline.ar : family.tagline.en}
            </p>
          )}

          {/* ═══ GROUP 01 — Configuration ═══════════════════════════════════ */}
          <section className="py-7 border-b border-[#D4D4D4]">
            <div className="flex items-baseline justify-between mb-4">
              <span className={[
                "flex items-baseline gap-2.5",
                "text-[11px] uppercase font-semibold text-[#2C2C2C]",
                isAr ? "tracking-normal" : "tracking-[0.2em]",
              ].join(" ")}>
                <span className={[
                  "font-medium text-[#6B6B6B]",
                  isAr ? "tracking-normal" : "tracking-[0.1em]",
                ].join(" ")}>01</span>
                {isAr ? "الإعداد" : "Configuration"}
              </span>
              <span className={[
                "text-[11.5px] text-[#6B6B6B]",
                isAr ? "tracking-normal" : "tracking-[0.02em]",
              ].join(" ")}>
                {isAr ? "الهيكل والأبعاد" : "Frame & dimensions"}
              </span>
            </div>

            {/* Type axis — rowlist */}
            <div className="mb-5">
              <div className="flex items-baseline justify-between mb-2.5">
                <span className={[
                  "text-[13px] font-medium text-[#2C2C2C]",
                  isAr ? "tracking-normal" : "",
                ].join(" ")}>
                  {isAr ? "النوع" : "Type"}
                </span>
                <span className={[
                  "text-[12.5px] text-[#3A3A3A] tabular-nums",
                  isAr ? "tracking-normal" : "",
                ].join(" ")}>
                  <em className="not-italic font-medium text-[#2C2C2C]">{config}</em>
                </span>
              </div>
              <div className="flex flex-col border border-[#D4D4D4]" role="radiogroup" aria-label={isAr ? "النوع" : "Type"}>
                {family.configs.map((c) => {
                  const isSelected = config === c;
                  const isCustom = c === "Custom (Contact Us)";
                  const extra = CONFIG_EXTRA_PRICES[c] || 0;
                  const meta = CONFIG_META[c];
                  const deltaLabel = isCustom
                    ? (isAr ? "عرض سعر" : "Quote")
                    : extra === 0
                      ? (isAr ? "أساسي" : "Base")
                      : `+${extra.toLocaleString()}`;

                  return (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setConfig(c)}
                      className={[
                        "grid items-center gap-3.5 px-4 py-3 text-left",
                        "border-b border-[#D4D4D4] last:border-b-0",
                        "transition-colors",
                        isCustom ? "border-t border-dashed border-[#D4D4D4]" : "",
                        isSelected
                          ? "bg-[#2C2C2C] text-white"
                          : "hover:bg-[#F5F5F5] text-[#2C2C2C]",
                      ].join(" ")}
                      style={{ gridTemplateColumns: "20px 1fr auto" }}
                    >
                      {/* Radio dot */}
                      <span className={[
                        "w-3.5 h-3.5 rounded-full border flex-shrink-0",
                        "flex items-center justify-center",
                        isSelected ? "border-white" : "border-[#3A3A3A]",
                      ].join(" ")} aria-hidden="true">
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      {/* Label + meta */}
                      <span>
                        <span className={[
                          "block text-[13.5px] font-medium",
                          isCustom ? "italic" : "",
                          isAr ? "tracking-normal" : "tracking-[0.005em]",
                        ].join(" ")}>
                          {isAr
                            ? (c === "Custom (Contact Us)" ? "مخصص — تواصل معنا" : c)
                            : c}
                        </span>
                        {meta && (
                          <span className={[
                            "block text-[11px] mt-0.5",
                            isSelected ? "text-white/70" : "text-[#6B6B6B]",
                            isAr ? "tracking-normal" : "tracking-[0.01em]",
                          ].join(" ")}>
                            {isAr ? meta.ar : meta.en}
                          </span>
                        )}
                      </span>
                      {/* Delta */}
                      <span className={[
                        "text-[12.5px] font-medium tabular-nums whitespace-nowrap",
                        isSelected ? "text-white/70" : "text-[#3A3A3A]",
                        isAr ? "tracking-normal" : "",
                      ].join(" ")}>
                        {deltaLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size axis — pill row */}
            <div>
              <div className="flex items-baseline justify-between mb-2.5">
                <span className={[
                  "text-[13px] font-medium text-[#2C2C2C]",
                  isAr ? "tracking-normal" : "",
                ].join(" ")}>
                  {isAr ? "المقاس" : "Size"}
                  <span className={[
                    "text-[#6B6B6B] font-normal ms-1",
                    isAr ? "tracking-normal" : "",
                  ].join(" ")}>{isAr ? "· سم" : "· cm"}</span>
                </span>
                <span className={[
                  "text-[12.5px] text-[#3A3A3A] tabular-nums",
                  isAr ? "tracking-normal" : "",
                ].join(" ")}>
                  <em className="not-italic font-medium text-[#2C2C2C]">{size.replace("x", " × ")}</em>
                </span>
              </div>
              <div className="flex flex-wrap gap-0 border border-[#D4D4D4]" role="radiogroup" aria-label={isAr ? "المقاس" : "Size"}>
                {validSizes.map((s, idx) => {
                  const isSelected = size === s;
                  const isLast = idx === validSizes.length - 1;
                  const isCustomSize = s === "CUSTOM";
                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSize(s)}
                      className={[
                        "flex-1 min-w-[80px] px-3.5 py-3 text-[13px] font-medium",
                        "tabular-nums transition-colors",
                        !isLast ? "border-r border-[#D4D4D4]" : "",
                        isCustomSize ? "border-dashed italic text-[#3A3A3A]" : "",
                        isSelected
                          ? "bg-[#2C2C2C] text-white"
                          : "hover:bg-[#F5F5F5] text-[#2C2C2C]",
                        isAr ? "tracking-normal" : "tracking-[0.01em]",
                      ].join(" ")}
                    >
                      {isCustomSize
                        ? (isAr ? "مخصص" : "Custom")
                        : s.replace(/x/g, " × ")}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ═══ GROUP 02 — Finish ══════════════════════════════════════════ */}
          <section className="py-7 border-b border-[#D4D4D4]">
            <div className="flex items-baseline justify-between mb-4">
              <span className={[
                "flex items-baseline gap-2.5",
                "text-[11px] uppercase font-semibold text-[#2C2C2C]",
                isAr ? "tracking-normal" : "tracking-[0.2em]",
              ].join(" ")}>
                <span className={[
                  "font-medium text-[#6B6B6B]",
                  isAr ? "tracking-normal" : "tracking-[0.1em]",
                ].join(" ")}>02</span>
                {isAr ? "التشطيب" : "Finish"}
              </span>
              <span className={[
                "text-[11.5px] text-[#6B6B6B]",
                isAr ? "tracking-normal" : "tracking-[0.02em]",
              ].join(" ")}>
                {isAr ? "السطح والهيكل" : "Top & frame"}
              </span>
            </div>

            {/* Desktop finish — tabbed library */}
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-2.5">
                <span className={[
                  "text-[13px] font-medium text-[#2C2C2C]",
                  isAr ? "tracking-normal" : "",
                ].join(" ")}>
                  {isAr ? "تشطيب السطح" : "Desktop finish"}
                </span>
                <span className={[
                  "text-[12.5px] text-[#3A3A3A]",
                  isAr ? "tracking-normal" : "",
                ].join(" ")}>
                  <em className="not-italic font-medium text-[#2C2C2C]">32</em>
                  {" "}{isAr ? "تشطيبات" : "finishes"}
                </span>
              </div>
              <FinishLibrary value={finish} onChange={setFinish} locale={locale} />
            </div>

            {/* Leg / frame colour — 4-tile row (hidden on credenzas) */}
            {!hasBaseRole && (
              <div>
                <div className="flex items-baseline justify-between mb-2.5">
                  <span className={[
                    "text-[13px] font-medium text-[#2C2C2C]",
                    isAr ? "tracking-normal" : "",
                  ].join(" ")}>
                    {isAr ? "لون الهيكل" : "Frame colour"}
                  </span>
                  <span className={[
                    "text-[12.5px] text-[#3A3A3A]",
                    isAr ? "tracking-normal" : "",
                  ].join(" ")}>
                    <em className="not-italic font-medium text-[#2C2C2C]">{leg}</em>
                  </span>
                </div>
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
                  role="radiogroup"
                  aria-label={isAr ? "لون الهيكل" : "Frame colour"}
                >
                  {LEG_COLORS.map((l) => {
                    if (excludedLegs.includes(l)) return null;
                    const isSelected = leg === l;
                    const tile = LEG_TILE_CONFIG[l];
                    if (!tile) return null;
                    return (
                      <button
                        key={l}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={l}
                        onClick={() => setLeg(l)}
                        className={[
                          "relative aspect-square border border-black/10",
                          "flex flex-col justify-end p-2",
                          "transition-transform duration-200 hover:-translate-y-0.5",
                          isSelected ? "outline outline-1 outline-[#2C2C2C] outline-offset-[3px]" : "",
                        ].join(" ")}
                        style={{
                          background: tile.bg,
                        }}
                      >
                        <span
                          className={[
                            "text-[10.5px] uppercase leading-[1.2]",
                            isAr ? "tracking-normal" : "tracking-[0.08em]",
                          ].join(" ")}
                          style={{ color: tile.textColor }}
                        >
                          {l.replace(" Coat", "").replace(" Powder", "\nPowder")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Base finish — wood-on-wood two-tone (credenzas only) */}
            {hasBaseRole && (
              <div>
                <div className="flex items-baseline justify-between mb-2.5">
                  <span className={[
                    "text-[13px] font-medium text-[#2C2C2C]",
                    isAr ? "tracking-normal" : "",
                  ].join(" ")}>
                    {isAr ? "تشطيب القاعدة" : "Base finish"}
                  </span>
                  <span className={[
                    "text-[12.5px] text-[#3A3A3A]",
                    isAr ? "tracking-normal" : "",
                  ].join(" ")}>
                    <em className="not-italic font-medium text-[#2C2C2C]">32</em>
                    {" "}{isAr ? "تشطيبات" : "finishes"}
                  </span>
                </div>
                <FinishLibrary value={baseFinish} onChange={setBaseFinish} locale={locale} />
              </div>
            )}
          </section>

          {/* ═══ GROUP 03 — Add-ons ════════════════════════════════════════ */}
          <section className="py-7">
            <div className="flex items-baseline justify-between mb-4">
              <span className={[
                "flex items-baseline gap-2.5",
                "text-[11px] uppercase font-semibold text-[#2C2C2C]",
                isAr ? "tracking-normal" : "tracking-[0.2em]",
              ].join(" ")}>
                <span className={[
                  "font-medium text-[#6B6B6B]",
                  isAr ? "tracking-normal" : "tracking-[0.1em]",
                ].join(" ")}>03</span>
                {isAr ? "الإضافات" : "Add-ons"}
              </span>
              <span className={[
                "text-[11.5px] text-[#6B6B6B]",
                isAr ? "tracking-normal" : "tracking-[0.02em]",
              ].join(" ")}>
                {isAr ? "كل اختياري" : "All optional"}
              </span>
            </div>

            {/* Side unit */}
            <DisclosureAxis
              name={{ en: "Side unit", ar: "الوحدة الجانبية" }}
              description={{
                en: "A low credenza attached to the desk's non-working side. Matches the desktop by default; specify separately below.",
                ar: "خزانة منخفضة متصلة بالجانب غير العملي للمكتب. تطابق سطح المكتب افتراضياً؛ حدد منفصلاً أدناه.",
              }}
              value={sideUnitOption}
              onChange={setSideUnitOpt}
              options={[
                { value: "",       labelEn: "None",             labelAr: "بدون",          extraPrice: 0     },
                { value: "match",  labelEn: "Match desktop",    labelAr: "مطابق للسطح",   extraPrice: 1400  },
                { value: "custom", labelEn: "Choose separately", labelAr: "اختر منفصلاً", isCustom: true    },
              ]}
              locale={locale}
            />

            {/* Pedestal */}
            <DisclosureAxis
              name={{ en: "Pedestal drawer", ar: "خزانة الأدراج" }}
              description={{
                en: "Three-drawer pedestal on soft-close runners. Mounted under-desk left or right. Lock optional.",
                ar: "خزانة ثلاثة أدراج على قضبان إغلاق ناعم. تُركَّب تحت المكتب يساراً أو يميناً. القفل اختياري.",
              }}
              value={pedestalOption}
              onChange={setPedestalOpt}
              options={[
                { value: "",       labelEn: "None",             labelAr: "بدون",          extraPrice: 0    },
                { value: "match",  labelEn: "Match desktop",    labelAr: "مطابق للسطح",   extraPrice: 900  },
                { value: "custom", labelEn: "Choose separately", labelAr: "اختر منفصلاً", isCustom: true   },
              ]}
              locale={locale}
            />

            {/* Cable & power — open by default, shows accessory chips */}
            {useAssemblyViewer && manifest && (() => {
              const axes = accessoryAxesForCurrentConfig(manifest, config);
              if (axes.length === 0) return null;
              // Cable/power axes: everything except screen_front/screen_side
              const cableAxes = axes.filter(a => !a.startsWith("screen_"));
              const activeCount = cableAxes.filter(a => accessories[a]).length;
              return (
                <CableDisclosure
                  axes={cableAxes}
                  accessories={accessories}
                  setAccessories={setAccessories}
                  activeCount={activeCount}
                  isAr={isAr}
                />
              );
            })()}

            {/* Acoustic dividers — only when config has divider parts */}
            {configHasDividers && manifest && (() => {
              const axes = accessoryAxesForCurrentConfig(manifest, config);
              const dividerAxes = axes.filter(a => a.startsWith("screen_"));
              if (dividerAxes.length === 0) return null;
              return (
                <DividerDisclosure
                  dividerAxes={dividerAxes}
                  accessories={accessories}
                  setAccessories={setAccessories}
                  dividerColor={dividerColor}
                  setDividerColor={setDividerColor}
                  isAr={isAr}
                />
              );
            })()}
          </section>

          {/* ═══ Sticky Summary + CTA ═════════════════════════════════════
              position:sticky; bottom:16px inside the right column.
              Releases when this column ends — never floats over editorial strip.
              border:1px solid var(--fg) — NO shadow.
              ═══════════════════════════════════════════════════════════ */}
          <div
            className="sticky mt-7 bg-white border border-[#2C2C2C] px-6 py-5 z-10"
            style={{ bottom: "16px" }}
          >
            {/* Config summary lines */}
            <div className={[
              "flex flex-wrap gap-x-3.5 gap-y-2 mb-2.5",
              "text-[11.5px] text-[#3A3A3A]",
              isAr ? "tracking-normal" : "tracking-[0.02em]",
            ].join(" ")} aria-live="polite" aria-label={isAr ? "ملخص التكوين" : "Configuration summary"}>
              {[
                { label: isAr ? "النوع" : "Type",  value: config },
                { label: isAr ? "المقاس" : "Size", value: size.replace(/x/g, " × ") },
                { label: isAr ? "السطح" : "Top",   value: finish },
                { label: isAr ? "الهيكل" : "Frame", value: leg },
                ...(activeSideUnit ? [{ label: isAr ? "جانبية" : "Side unit", value: activeSideUnit }] : []),
                ...(activePedestal ? [{ label: isAr ? "أدراج" : "Pedestal",  value: activePedestal }] : []),
                ...(accessoryCount > 0 ? [{ label: isAr ? "ملحقات" : "Accessories", value: `${accessoryCount}` }] : []),
              ].map((line, i, arr) => (
                <span key={line.label} className="inline-flex gap-1.5 items-baseline whitespace-nowrap">
                  <span>{line.label}</span>
                  <strong className="font-medium text-[#2C2C2C]">{line.value}</strong>
                  {i < arr.length - 1 && <span className="text-[#D4D4D4] ms-2">·</span>}
                </span>
              ))}
            </div>

            <div className="grid gap-6 items-end" style={{ gridTemplateColumns: "minmax(0,1fr) auto" }}>
              <div>
                {/* Price */}
                <div className="flex items-baseline gap-2.5 mb-1">
                  <span className={[
                    "text-[11px] uppercase text-[#6B6B6B]",
                    isAr ? "tracking-normal" : "tracking-[0.2em]",
                  ].join(" ")}>
                    {isAr ? "الإجمالي" : "Total"}
                  </span>
                </div>
                {isCustomQuote ? (
                  <div>
                    <div className={[
                      "text-[32px] font-bold text-[#2C2C2C] leading-none",
                      isAr ? "tracking-normal" : "tracking-[-0.02em]",
                    ].join(" ")}>
                      {isAr ? "عرض سعر" : "Quote"}
                    </div>
                    <p className={[
                      "text-[11px] text-[#6B6B6B] mt-1",
                      isAr ? "tracking-normal" : "tracking-[0.02em]",
                    ].join(" ")}>
                      {isAr ? "سيرد فريق المبيعات خلال يوم عمل" : "Sales team responds within 1 business day"}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div
                      className={[
                        "text-[40px] font-bold text-[#2C2C2C] leading-none tabular-nums",
                        isAr ? "tracking-normal" : "tracking-[-0.02em]",
                        pricePulse ? "animate-[pricePulse_0.45s_ease-out]" : "",
                      ].join(" ")}
                      aria-live="polite"
                      aria-atomic="true"
                      aria-label={`${formatSAR(total, isAr)} ${isAr ? "ريال" : "SAR"}`}
                    >
                      {/* Count-up animates from old total to new total (250ms).
                          pricePulse color-flash runs simultaneously (450ms).
                          aria-label stays on exact total for screen readers. */}
                      {formatSAR(animatedTotal, isAr)}
                      <span className={[
                        "text-[16px] font-medium text-[#3A3A3A] ms-1",
                        isAr ? "tracking-normal" : "tracking-[0]",
                      ].join(" ")}>
                        {isAr ? "ريال" : "SAR"}
                      </span>
                    </div>
                    <p className={[
                      "text-[11px] text-[#6B6B6B] mt-1",
                      isAr ? "tracking-normal" : "tracking-[0.02em]",
                    ].join(" ")}>
                      {isAr ? "+ ضريبة القيمة المضافة 15% عند الدفع" : "+ 15% VAT at checkout"}
                    </p>
                  </div>
                )}

                {/* Breakdown toggle */}
                {!isCustomQuote && (
                  <div className="relative mt-1">
                    <button
                      type="button"
                      onClick={() => setShowBreakdown(v => !v)}
                      className={[
                        "inline-flex items-center gap-1.5",
                        "text-[11.5px] text-[#3A3A3A] hover:text-[#2C2C2C]",
                        "transition-colors mt-1",
                        isAr ? "tracking-normal" : "",
                      ].join(" ")}
                    >
                      {isAr ? "تفصيل السعر" : "Breakdown"}
                      <ChevronSvg className={showBreakdown ? "rotate-180 transition-transform" : "transition-transform"} />
                    </button>
                    {/* Breakdown popover — no shadow, border only */}
                    {showBreakdown && (
                      <div
                        className="absolute left-0 bottom-[calc(100%+8px)] w-80 bg-white border border-[#2C2C2C] p-5 z-20"
                        role="status"
                        aria-label={isAr ? "تفصيل السعر" : "Price breakdown"}
                      >
                        {breakdownRows.map(([label, amount]) => (
                          <div key={label} className="flex justify-between items-baseline py-1.5 border-b border-dashed border-[#D4D4D4] last:border-b-0">
                            <span className={[
                              "text-[12.5px] text-[#3A3A3A]",
                              isAr ? "tracking-normal" : "",
                            ].join(" ")}>{label}</span>
                            <span className={[
                              "text-[12.5px] font-medium text-[#2C2C2C] tabular-nums",
                              isAr ? "tracking-normal" : "",
                            ].join(" ")}>{formatSAR(amount, isAr)}</span>
                          </div>
                        ))}
                        <div className={[
                          "flex justify-between pt-2.5 mt-1.5 border-t border-[#2C2C2C]",
                          "text-[13.5px] font-semibold text-[#2C2C2C]",
                          isAr ? "tracking-normal" : "",
                        ].join(" ")}>
                          <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                          <span className="tabular-nums">{formatSAR(total, isAr)} {isAr ? "ريال" : "SAR"}</span>
                        </div>
                        <p className={[
                          "text-[11px] text-[#6B6B6B] mt-1.5",
                          isAr ? "tracking-normal" : "",
                        ].join(" ")}>
                          {isAr ? "+ ضريبة القيمة المضافة 15%" : "+ 15% VAT at checkout"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="flex gap-2.5 items-center">
                {/* Save — writes config to localStorage + ?cfg= URL param */}
                <button
                  type="button"
                  className={[
                    "h-13 px-4 flex items-center gap-2.5",
                    "text-[12.5px] font-semibold uppercase",
                    "bg-white text-[#2C2C2C] border border-[#2C2C2C]",
                    "hover:bg-[#F5F5F5] active:scale-[0.98] transition-all",
                    isAr ? "tracking-normal" : "tracking-[0.08em]",
                  ].join(" ")}
                  style={{ height: "52px" }}
                  onClick={handleSave}
                  aria-label={isAr ? "حفظ التكوين ومشاركته" : "Save and share configuration"}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>
                  </svg>
                  {isAr ? "حفظ" : "Save"}
                </button>
                {/* Add to Cart / Request Quote */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={[
                    "h-13 px-5 flex items-center gap-2.5",
                    "text-[12.5px] font-semibold uppercase",
                    "bg-[#2C2C2C] text-white border border-[#2C2C2C]",
                    "hover:bg-[#1E1E1E] active:scale-[0.98] transition-all",
                    "whitespace-nowrap",
                    isAr ? "tracking-normal" : "tracking-[0.08em]",
                  ].join(" ")}
                  style={{ height: "52px" }}
                >
                  {isCustomQuote
                    ? (isAr ? "طلب عرض سعر" : "Request a Quote")
                    : (isAr ? "أضف إلى السلة" : "Add to Cart")}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"
                    style={{ transform: isAr ? "scaleX(-1)" : undefined }}>
                    <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* /sticky summary */}

        </div>
        {/* /RIGHT col */}

      </div>
      {/* /TWO-COLUMN GRID */}

      {/* ═══════════════════════════════════════════════════════════════════════
          EDITORIAL STRIP — full-width, OUTSIDE the grid.
          Only starts after the configurator column ends.
          Uses reading state from the configurator above.
          ═══════════════════════════════════════════════════════════════════════ */}
      <EditorialStrip
        family={family}
        config={config}
        size={size}
        finish={finish}
        leg={leg}
        isAr={isAr}
        locale={locale}
      />

    </main>
  );
}

// ─── Cable & power disclosure ────────────────────────────────────────────────
function CableDisclosure({
  axes, accessories, setAccessories, activeCount, isAr,
}: {
  axes: string[];
  accessories: Record<string, boolean>;
  setAccessories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  activeCount: number;
  isAr: boolean;
}) {
  const [open, setOpen] = useState(true);
  const stateLabel = activeCount === 0
    ? (isAr ? "لا شيء" : "None")
    : `${activeCount} ${isAr ? "محدد" : "selected"}`;

  return (
    <div className="border border-[#D4D4D4] mb-2.5">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="w-full grid items-center gap-4 px-4 py-3.5 text-left hover:bg-[#F5F5F5] transition-colors"
        style={{ gridTemplateColumns: "1fr auto auto" }}
      >
        <span className={["text-[13.5px] font-medium text-[#2C2C2C]", isAr ? "tracking-normal" : ""].join(" ")}>
          {isAr ? "الكابلات والطاقة" : "Cable & power"}
        </span>
        <span className={[
          "text-[12px] tabular-nums",
          activeCount > 0 ? "font-medium text-[#2C2C2C]" : "text-[#3A3A3A]",
          isAr ? "tracking-normal" : "",
        ].join(" ")}>
          {stateLabel}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          className={["text-[#6B6B6B] transition-transform duration-[250ms]", open ? "rotate-180" : ""].join(" ")}
          aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        className={["overflow-hidden transition-all duration-[350ms]", open ? "max-h-[600px] border-t border-[#D4D4D4]" : "max-h-0"].join(" ")}
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="p-4">
          <p className={["text-[12.5px] text-[#3A3A3A] mb-3 leading-[1.55]", isAr ? "tracking-normal" : ""].join(" ")}>
            {isAr ? "اجعل المكتب نظيفاً منذ يوم التركيب." : "Keep the desk clean on installation day."}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {axes.map((axis) => {
              const label = ACCESSORY_LABELS[axis];
              if (!label) return null;
              const on = !!accessories[axis];
              return (
                <label
                  key={axis}
                  className={[
                    "inline-flex items-center gap-2 px-3 py-2 cursor-pointer select-none",
                    "text-[12.5px] font-medium border transition-colors",
                    on
                      ? "bg-[#2C2C2C] border-[#2C2C2C] text-white"
                      : "border-[#D4D4D4] text-[#2C2C2C] hover:border-[#3A3A3A]",
                    isAr ? "tracking-normal" : "",
                  ].join(" ")}
                >
                  {/* SVG chip mark — no unicode */}
                  <span className={[
                    "w-3 h-3 flex-shrink-0 flex items-center justify-center border",
                    on ? "border-white bg-white text-[#2C2C2C]" : "border-[#3A3A3A]",
                  ].join(" ")} aria-hidden="true">
                    {on && <CheckSvg />}
                  </span>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={(e) =>
                      setAccessories((prev) => ({ ...prev, [axis]: e.target.checked }))
                    }
                    className="sr-only"
                  />
                  <span className="whitespace-nowrap">
                    {isAr ? label.ar : label.en}
                  </span>
                  {label.price > 0 && (
                    <span className={["text-[11px]", on ? "text-white/70" : "text-[#6B6B6B]"].join(" ")}>
                      +{label.price}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Divider disclosure ───────────────────────────────────────────────────────
function DividerDisclosure({
  dividerAxes, accessories, setAccessories, dividerColor, setDividerColor, isAr,
}: {
  dividerAxes: string[];
  accessories: Record<string, boolean>;
  setAccessories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  dividerColor: string;
  setDividerColor: (c: string) => void;
  isAr: boolean;
}) {
  const [open, setOpen] = useState(false);
  const activeCount = dividerAxes.filter(a => accessories[a]).length;

  return (
    <div className="border border-[#D4D4D4] mb-2.5">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="w-full grid items-center gap-4 px-4 py-3.5 text-left hover:bg-[#F5F5F5] transition-colors"
        style={{ gridTemplateColumns: "1fr auto auto" }}
      >
        <span className={["text-[13.5px] font-medium text-[#2C2C2C]", isAr ? "tracking-normal" : ""].join(" ")}>
          {isAr ? "الفواصل الصوتية" : "Acoustic dividers"}
        </span>
        <span className={[
          "text-[12px] tabular-nums",
          activeCount > 0 ? "font-medium text-[#2C2C2C]" : "text-[#3A3A3A]",
          isAr ? "tracking-normal" : "",
        ].join(" ")}>
          {activeCount > 0 ? `${activeCount} ${isAr ? "محدد" : "selected"}` : (isAr ? "لم يُضف" : "Not added")}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          className={["text-[#6B6B6B] transition-transform duration-[250ms]", open ? "rotate-180" : ""].join(" ")}
          aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        className={["overflow-hidden transition-all duration-[350ms]", open ? "max-h-[600px] border-t border-[#D4D4D4]" : "max-h-0"].join(" ")}
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="p-4">
          <p className={["text-[12.5px] text-[#3A3A3A] mb-3 leading-[1.55]", isAr ? "tracking-normal" : ""].join(" ")}>
            {isAr ? "فواصل صوتية مثبتة على المكتب — للمحطات 6 أشخاص." : "Desk-mounted acoustic privacy partitions — for 6-person Workstation configs."}
          </p>
          {/* Screen toggles */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {dividerAxes.map(axis => {
              const label = ACCESSORY_LABELS[axis];
              if (!label) return null;
              const on = !!accessories[axis];
              return (
                <label key={axis} className={[
                  "inline-flex items-center gap-2 px-3 py-2 cursor-pointer select-none",
                  "text-[12.5px] font-medium border transition-colors",
                  on ? "bg-[#2C2C2C] border-[#2C2C2C] text-white" : "border-[#D4D4D4] text-[#2C2C2C] hover:border-[#3A3A3A]",
                  isAr ? "tracking-normal" : "",
                ].join(" ")}>
                  <span className={["w-3 h-3 flex-shrink-0 flex items-center justify-center border", on ? "border-white bg-white text-[#2C2C2C]" : "border-[#3A3A3A]"].join(" ")} aria-hidden="true">
                    {on && <CheckSvg />}
                  </span>
                  <input type="checkbox" checked={on}
                    onChange={e => setAccessories(prev => ({ ...prev, [axis]: e.target.checked }))}
                    className="sr-only" />
                  <span className="whitespace-nowrap">{isAr ? label.ar : label.en}</span>
                </label>
              );
            })}
          </div>
          {/* Divider color swatches */}
          <p className={["text-[12px] font-medium text-[#2C2C2C] mb-2", isAr ? "tracking-normal" : "tracking-[0.05em]"].join(" ")}>
            {isAr ? "لون القماش" : "Fabric colour"}
          </p>
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
            {Object.entries(DIVIDER_COLOR_MATERIAL).map(([key, entry]) => {
              const isSelected = dividerColor === key;
              return (
                <button key={key} type="button" aria-label={entry.label} title={entry.label}
                  onClick={() => setDividerColor(key)}
                  className={["aspect-square border border-black/10 transition-transform hover:-translate-y-0.5",
                    isSelected ? "outline outline-1 outline-[#2C2C2C] outline-offset-[3px]" : ""].join(" ")}
                  style={{ backgroundColor: entry.hex }}>
                  {isSelected && <span className="absolute inset-0 border border-white/50 pointer-events-none" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Editorial strip ─────────────────────────────────────────────────────────
function EditorialStrip({
  family, config, size, finish, leg, isAr, locale,
}: {
  family: DeskFamily;
  config: string;
  size: string;
  finish: string;
  leg: string;
  isAr: boolean;
  locale: "en" | "ar";
}) {
  const dims = parseSizeMm(size);
  const finishMeta = FINISH_META[finish];
  const finishHex = DESK_TOP_FINISH_HEX[finish] ?? "#E7E7E7";

  return (
    <div className="mt-[72px]">
      {/* Section break divider */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 flex items-center gap-5">
        <div className="h-px flex-1 bg-[#D4D4D4]" />
        <p className={[
          "text-[11px] uppercase font-semibold text-[#3A3A3A]",
          isAr ? "tracking-normal" : "tracking-[0.24em]",
        ].join(" ")}>
          {isAr ? `${family.nameAr} · بالتفصيل` : `${family.nameEn} · In depth`}
        </p>
        <div className="h-px flex-1 bg-[#D4D4D4]" />
      </div>

      <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 mt-0">

        {/* Your configuration banner */}
        <div className="py-11">
          <p className={["text-[11px] uppercase text-[#3A3A3A] mb-3.5", isAr ? "tracking-normal" : "tracking-[0.2em]"].join(" ")}>
            {isAr ? "تكوينك" : "Your configuration"}
          </p>
          <h2 className={[
            "text-[32px] font-bold text-[#2C2C2C] leading-[1.2] max-w-[54ch] mb-4",
            isAr ? "tracking-normal" : "tracking-[-0.005em]",
          ].join(" ")} aria-live="polite">
            {isAr
              ? `${family.nameAr} · ${config} · ${size.replace(/x/g, " × ")}`
              : `${family.nameEn} · ${config} · ${size.replace(/x/g, " × ")}`}
          </h2>
          <p className={[
            "text-[15px] text-[#3A3A3A] leading-[1.65] max-w-[70ch]",
            isAr ? "tracking-normal" : "",
          ].join(" ")} aria-live="polite">
            {isAr
              ? `مكتب ${config.toLowerCase()} في تشطيب ${finish} على هيكل ${leg}.`
              : `A ${config.toLowerCase()} desk in ${finish} over a ${leg} frame.`}
          </p>
        </div>

        {/* Row A: Selected finish + Material library */}
        <BelowGrid>
          <BelowCell>
            <p className={["below-eyebrow text-[11px] uppercase text-[#3A3A3A] mb-3.5", isAr ? "tracking-normal" : "tracking-[0.2em]"].join(" ")}>
              {isAr ? "التشطيب المحدد" : "Selected finish"}
            </p>
            <div className="grid gap-4 items-center bg-[#FAFAF8] p-3.5 border border-[#E7E7E7]" style={{ gridTemplateColumns: "64px 1fr" }}>
              <div className="w-16 h-16 border border-black/[0.08]" style={{ backgroundColor: finishHex }} aria-hidden="true" />
              <div>
                <div className={["text-[15px] font-semibold text-[#2C2C2C]", isAr ? "tracking-normal" : "tracking-[-0.005em]"].join(" ")}>
                  {finish}
                </div>
                <div className={["text-[12px] text-[#3A3A3A] mt-0.5", isAr ? "tracking-normal" : ""].join(" ")}>
                  {finishMeta?.meta ?? "Laminate · Matte"}
                </div>
              </div>
            </div>
            <p className={["text-[14px] text-[#3A3A3A] leading-[1.7] mt-4 max-w-[52ch]", isAr ? "tracking-normal" : ""].join(" ")}>
              {isAr
                ? "لب صفيحي مستقر أبعاد مع حافة ABS بعرض 2 مم. مقاوم للخدش، يُنظَّف بقطعة قماش مبللة، مستقر للاستخدام الداخلي. يطابق الخزائن والأدراج بنفس الكود."
                : "A dimensionally stable laminate core with a 2 mm ABS edge band. Resists scuffing, cleans with a damp cloth, UV-stable for interior use. Matches credenzas and pedestals in the same code."}
            </p>
          </BelowCell>
          <BelowCell>
            <p className={["text-[11px] uppercase text-[#3A3A3A] mb-3.5", isAr ? "tracking-normal" : "tracking-[0.2em]"].join(" ")}>
              {isAr ? "مكتبة المواد" : "Material library"}
            </p>
            <h3 className={["text-[22px] font-bold text-[#2C2C2C] leading-[1.3] max-w-[32ch] mb-4", isAr ? "tracking-normal" : "tracking-[-0.005em]"].join(" ")}>
              {isAr ? "أفضل ما يصنعه العالم." : "The best the world makes."}
            </h3>
            <p className={["text-[14px] text-[#3A3A3A] leading-[1.7] max-w-[52ch]", isAr ? "tracking-normal" : ""].join(" ")}>
              {isAr
                ? "أسطحنا إما خشب صلب مستدام محلياً أو لب صفيحي 25 مم مع حافة ABS مطابقة. الهياكل ملحومة من صلب معاد تدويره، مشطبة داخلياً. أجهزة مخفية قابلة للصيانة، مصنوعة لتدوم عقداً."
                : "Our tops are either responsibly harvested hardwood or a 25 mm laminate core with matching ABS edge. Frames are welded from recycled-content steel, finished in-house. Concealed hardware, serviceable, built to last a decade."}
            </p>
            <ul className="mt-4.5 border-t border-[#E7E7E7]">
              {[
                { en: "FSC-certified hardwood",    ar: "خشب صلب شهادة FSC",       tag: isAr ? "الأسطح" : "Tops"     },
                { en: "Recycled-content steel",    ar: "صلب معاد تدويره",          tag: isAr ? "الهيكل" : "Frame"    },
                { en: "Soft-close, concealed",     ar: "إغلاق ناعم، مخفي",        tag: isAr ? "الأجهزة" : "Hardware" },
                { en: "10-year warranty",          ar: "ضمان 10 سنوات",            tag: isAr ? "التغطية" : "Coverage" },
              ].map(item => (
                <li key={item.en} className={[
                  "flex justify-between gap-4 py-2.5 border-b border-[#E7E7E7]",
                  "text-[12.5px]",
                ].join(" ")}>
                  <span className="text-[#2C2C2C]">{isAr ? item.ar : item.en}</span>
                  <span className={["text-[#6B6B6B] uppercase", isAr ? "tracking-normal" : "tracking-[0.12em]"].join(" ")}>{item.tag}</span>
                </li>
              ))}
            </ul>
          </BelowCell>
        </BelowGrid>

        {/* Row B: Dimensions + Certifications */}
        <BelowGrid>
          <BelowCell>
            <p className={["text-[11px] uppercase text-[#3A3A3A] mb-3.5", isAr ? "tracking-normal" : "tracking-[0.2em]"].join(" ")}>
              {isAr ? "الأبعاد" : "Dimensions"}
            </p>
            {/* SVG top-view plan */}
            <div className="bg-white border border-[#E7E7E7] p-4 my-2">
              <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <g fill="none" stroke="#D4D4D4" strokeWidth="1">
                  <line x1="20" y1="40" x2="20" y2="160"/>
                  <line x1="15" y1="40" x2="25" y2="40"/>
                  <line x1="15" y1="160" x2="25" y2="160"/>
                  <line x1="60" y1="180" x2="340" y2="180"/>
                  <line x1="60" y1="175" x2="60" y2="185"/>
                  <line x1="340" y1="175" x2="340" y2="185"/>
                </g>
                <rect x="60" y="40" width="280" height="120" fill="#FAFAF8" stroke="#2C2C2C" strokeWidth="1"/>
                <rect x="66" y="46" width="268" height="108" fill="none" stroke="#D4D4D4" strokeWidth="0.7" strokeDasharray="2 3"/>
                <circle cx="100" cy="58" r="4" fill="none" stroke="#2C2C2C" strokeWidth="0.8"/>
                <circle cx="300" cy="58" r="4" fill="none" stroke="#2C2C2C" strokeWidth="0.8"/>
                <text x="200" y="195" textAnchor="middle" fontSize="10" fill="#3A3A3A" fontFamily="Alyamama,sans-serif" letterSpacing="0.14em">
                  {dims ? `W ${dims.w} MM` : "W — MM"}
                </text>
                <text x="10" y="104" textAnchor="middle" fontSize="10" fill="#3A3A3A" fontFamily="Alyamama,sans-serif" letterSpacing="0.14em" transform="rotate(-90,10,104)">
                  {dims ? `D ${dims.d} MM` : "D — MM"}
                </text>
                <text x="200" y="30" textAnchor="middle" fontSize="9" fill="#6B6B6B" fontFamily="Alyamama,sans-serif" letterSpacing="0.16em">TOP VIEW · 1:25</text>
                <text x="100" y="76" textAnchor="middle" fontSize="8" fill="#6B6B6B" fontFamily="Alyamama,sans-serif">grommet</text>
                <text x="300" y="76" textAnchor="middle" fontSize="8" fill="#6B6B6B" fontFamily="Alyamama,sans-serif">grommet</text>
              </svg>
            </div>
            <dl className="grid gap-x-6 mt-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {[
                { labelEn: "Width",     labelAr: "العرض",    val: dims ? `${dims.w} mm` : "—" },
                { labelEn: "Depth",     labelAr: "العمق",    val: dims ? `${dims.d} mm` : "—" },
                { labelEn: "Height",    labelAr: "الارتفاع", val: "740 mm" },
                { labelEn: "Clearance", labelAr: "التخليص",  val: "680 mm" },
              ].map(spec => (
                <div key={spec.labelEn}>
                  <dt className={["text-[11px] uppercase text-[#6B6B6B] pt-2.5 pb-1 border-t border-[#E7E7E7]", isAr ? "tracking-normal" : "tracking-[0.14em]"].join(" ")}>
                    {isAr ? spec.labelAr : spec.labelEn}
                  </dt>
                  <dd className="text-[13px] text-[#2C2C2C] pb-3 tabular-nums">{spec.val}</dd>
                </div>
              ))}
            </dl>
          </BelowCell>
          <BelowCell>
            <p className={["text-[11px] uppercase text-[#3A3A3A] mb-3.5", isAr ? "tracking-normal" : "tracking-[0.2em]"].join(" ")}>
              {isAr ? "الشهادات" : "Certifications"}
            </p>
            <h3 className={["text-[22px] font-bold text-[#2C2C2C] leading-[1.3] max-w-[32ch] mb-4", isAr ? "tracking-normal" : "tracking-[-0.005em]"].join(" ")}>
              {isAr ? "مُختبر، قابل للتتبع، ومتوافق." : "Tested, traceable, compliant."}
            </h3>
            <p className={["text-[14px] text-[#3A3A3A] leading-[1.7] max-w-[52ch] mb-4.5", isAr ? "tracking-normal" : ""].join(" ")}>
              {isAr
                ? "كل مكون من مكونات Cratos مُصدَّر ومُختبر وفق المعايير الدولية المعترف بها."
                : "Every Cratos component is sourced and tested against recognised international standards."}
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { badge: "FSC",   nameEn: "Forest Stewardship Council", nameAr: "مجلس إدارة الغابات", metaEn: "Chain-of-custody certified hardwood", metaAr: "خشب معتمد بسلسلة الحراسة" },
                { badge: "BIFMA", nameEn: "BIFMA X5.5",                 nameAr: "BIFMA X5.5",          metaEn: "Desk product tested and compliant",   metaAr: "منتج مكتب مختبر ومتوافق" },
                { badge: "ISO",   nameEn: "ISO 14001",                   nameAr: "ISO 14001",           metaEn: "Environmental management system",     metaAr: "نظام الإدارة البيئية" },
                { badge: "CARB",  nameEn: "CARB Phase 2",                nameAr: "CARB المرحلة 2",      metaEn: "Low-emission composite panels",       metaAr: "ألواح مركبة منخفضة الانبعاثات" },
              ].map(cert => (
                <li key={cert.badge} className="grid gap-3.5 items-center p-3 border border-[#E7E7E7]" style={{ gridTemplateColumns: "64px 1fr" }}>
                  <span className="w-16 h-11 flex items-center justify-center border border-[#2C2C2C] text-[11px] font-bold text-[#2C2C2C]" style={{ letterSpacing: "0.1em" }}>
                    {cert.badge}
                  </span>
                  <div>
                    <div className={["text-[13px] font-semibold text-[#2C2C2C]", isAr ? "tracking-normal" : ""].join(" ")}>
                      {isAr ? cert.nameAr : cert.nameEn}
                    </div>
                    <div className={["text-[11.5px] text-[#3A3A3A] mt-0.5", isAr ? "tracking-normal" : ""].join(" ")}>
                      {isAr ? cert.metaAr : cert.metaEn}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </BelowCell>
        </BelowGrid>

        {/* Row C: Delivery + Need help */}
        <BelowGrid>
          <BelowCell>
            <p className={["text-[11px] uppercase text-[#3A3A3A] mb-3.5", isAr ? "tracking-normal" : "tracking-[0.2em]"].join(" ")}>
              {isAr ? "التسليم" : "Delivery"}
            </p>
            <h3 className={["text-[22px] font-bold text-[#2C2C2C] leading-[1.3] max-w-[32ch] mb-4", isAr ? "tracking-normal" : "tracking-[-0.005em]"].join(" ")}>
              {isAr ? "من الرياض إلى طابقك، مُجمَّع مرة واحدة." : "Riyadh to your floor, assembled once."}
            </h3>
            <p className={["text-[14px] text-[#3A3A3A] leading-[1.7] max-w-[52ch]", isAr ? "tracking-normal" : ""].join(" ")}>
              {isAr
                ? "توصيل متكامل عبر المملكة ومنطقة الخليج. يفك مثبِّتونا الصناديق ويجمعون ويديرون الكابلات ويزيلون التغليف في نفس الزيارة."
                : "White-glove delivery across the Kingdom and GCC. Our installers uncrate, assemble, cable-manage, and remove packaging on the same visit."}
            </p>
            <dl className="grid gap-x-6 mt-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {[
                { labelEn: "Lead time",    labelAr: "وقت التسليم",  val: isAr ? "3–5 أسابيع" : "3–5 weeks" },
                { labelEn: "Ships from",   labelAr: "يشحن من",       val: isAr ? "الرياض" : "Riyadh" },
                { labelEn: "Installation", labelAr: "التركيب",       val: isAr ? "مشمول" : "Included" },
                { labelEn: "Coverage",     labelAr: "التغطية",       val: isAr ? "المملكة والخليج" : "KSA & GCC" },
              ].map(spec => (
                <div key={spec.labelEn}>
                  <dt className={["text-[11px] uppercase text-[#6B6B6B] pt-2.5 pb-1 border-t border-[#E7E7E7]", isAr ? "tracking-normal" : "tracking-[0.14em]"].join(" ")}>
                    {isAr ? spec.labelAr : spec.labelEn}
                  </dt>
                  <dd className="text-[13px] text-[#2C2C2C] pb-3">{spec.val}</dd>
                </div>
              ))}
            </dl>
          </BelowCell>
          <BelowCell>
            <p className={["text-[11px] uppercase text-[#3A3A3A] mb-3.5", isAr ? "tracking-normal" : "tracking-[0.2em]"].join(" ")}>
              {isAr ? "تحتاج مساعدة في التحديد؟" : "Need help specifying?"}
            </p>
            <h3 className={["text-[22px] font-bold text-[#2C2C2C] leading-[1.3] max-w-[32ch] mb-4", isAr ? "tracking-normal" : "tracking-[-0.005em]"].join(" ")}>
              {isAr ? "فريق العقود لدينا يمكنه صياغة هذا لك." : "Our contract team can draft this for you."}
            </h3>
            <p className={["text-[14px] text-[#3A3A3A] leading-[1.7] max-w-[52ch]", isAr ? "tracking-normal" : ""].join(" ")}>
              {isAr
                ? "شارك مخطط الطابق وسنقترح تركيبات، ونعرض عينات التشطيب شخصياً، ونصدر عرض أسعار رسمياً خلال يومي عمل."
                : "Share a floorplan and we'll propose combinations, sample finishes in person, and issue a formal quotation within two business days."}
            </p>
            <a
              href={`/${locale}/quotation`}
              className={[
                "inline-flex items-center gap-2 mt-4.5",
                "text-[12.5px] font-semibold uppercase text-[#2C2C2C]",
                "border-b border-[#2C2C2C] pb-1",
                "hover:opacity-65 transition-opacity",
                isAr ? "tracking-normal" : "tracking-[0.08em]",
              ].join(" ")}
            >
              {isAr ? "تحدث إلى متخصص" : "Talk to a specifier"}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"
                style={{ transform: isAr ? "scaleX(-1)" : undefined }}>
                <path d="M5 12h14m-6-6 6 6-6 6"/>
              </svg>
            </a>
          </BelowCell>
        </BelowGrid>

        {/* Row D: Made to specify + Quick reference */}
        <BelowGrid isLast>
          <BelowCell>
            <p className={["text-[11px] uppercase text-[#3A3A3A] mb-3.5", isAr ? "tracking-normal" : "tracking-[0.2em]"].join(" ")}>
              {isAr ? "مصنوع للتحديد" : "Made to specify"}
            </p>
            <h2 className={["text-[22px] font-bold text-[#2C2C2C] leading-[1.3] max-w-[32ch] mb-4", isAr ? "tracking-normal" : "tracking-[-0.005em]"].join(" ")}>
              {isAr
                ? "أسطح خشب صلب، هيكل معاد تدويره، قابل للصيانة لعقد."
                : "Bookmatched hardwood tops, recycled-content frame, serviceable for a decade."}
            </h2>
            <p className={["text-[14px] text-[#3A3A3A] leading-[1.7] max-w-[52ch]", isAr ? "tracking-normal" : ""].join(" ")}>
              {isAr
                ? `سطح ${family.nameAr} مطحون من خشب صلب مستدام أو لب صفيحي 25 مم — وفق مواصفاتك. الهيكل ملحوم من صلب معاد تدويره ومشطَّب داخلياً بأحد أربعة ألوان. إدارة الكابلات المخفية تمتد على طول الطاولة. التجميع مشمول؛ الصيانة صادقة وغير مُعقَّدة.`
                : `The ${family.nameEn} desktop is milled from responsibly harvested hardwood or a 25 mm laminate core — your specification. The frame is welded from recycled-content steel, finished in-house to one of four colours. Concealed cable management runs the full length. Assembly is included; servicing is honest and unfussy.`}
            </p>
          </BelowCell>
          <BelowCell>
            <p className={["text-[11px] uppercase text-[#3A3A3A] mb-3.5", isAr ? "tracking-normal" : "tracking-[0.2em]"].join(" ")}>
              {isAr ? "المواصفات" : "Specification"}
            </p>
            <h2 className={["text-[22px] font-bold text-[#2C2C2C] leading-[1.3] max-w-[32ch] mb-4", isAr ? "tracking-normal" : "tracking-[-0.005em]"].join(" ")}>
              {isAr ? `${family.nameAr} — مرجع سريع.` : `${family.nameEn} — quick reference.`}
            </h2>
            <dl className="grid gap-x-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {[
                { labelEn: "Warranty",      labelAr: "الضمان",         val: isAr ? "10 سنوات" : "10 years" },
                { labelEn: "Lead time",     labelAr: "وقت التسليم",   val: isAr ? "3–5 أسابيع" : "3–5 weeks" },
                { labelEn: "Ships from",    labelAr: "يشحن من",        val: isAr ? "الرياض" : "Riyadh" },
                { labelEn: "SKU family",    labelAr: "رمز المنتج",     val: family.sku },
                { labelEn: "Core material", labelAr: "مادة اللب",      val: isAr ? "خشب صلب أو صفيحي 25 مم" : "Hardwood or 25 mm laminate" },
                { labelEn: "Frame",         labelAr: "الهيكل",         val: isAr ? "صلب معاد تدويره، تشطيب داخلي" : "Recycled steel, in-house finish" },
                { labelEn: "Hardware",      labelAr: "الأجهزة",        val: isAr ? "إغلاق ناعم، مخفي" : "Soft-close, concealed, serviceable" },
                { labelEn: "Certifications",labelAr: "الشهادات",       val: "FSC · BIFMA · ISO 14001" },
              ].map(spec => (
                <div key={spec.labelEn}>
                  <dt className={["text-[11px] uppercase text-[#6B6B6B] pt-2.5 pb-1 border-t border-[#E7E7E7]", isAr ? "tracking-normal" : "tracking-[0.14em]"].join(" ")}>
                    {isAr ? spec.labelAr : spec.labelEn}
                  </dt>
                  <dd className="text-[13px] text-[#2C2C2C] pb-3">{spec.val}</dd>
                </div>
              ))}
            </dl>
          </BelowCell>
        </BelowGrid>
      </section>
    </div>
  );
}

// ─── Below-grid layout helpers ───────────────────────────────────────────────
function BelowGrid({ children, isLast }: { children: React.ReactNode; isLast?: boolean }) {
  return (
    <div
      className={[
        "grid border-t border-[#D4D4D4]",
        isLast ? "" : "",
      ].join(" ")}
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))" }}
    >
      {children}
    </div>
  );
}

function BelowCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-11 pe-0 lg:pe-12 border-r-0 lg:border-r border-[#D4D4D4] last:pe-0 last:ps-0 lg:last:ps-12 lg:last:border-r-0">
      {children}
    </div>
  );
}
