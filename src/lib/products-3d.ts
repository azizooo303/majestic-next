/**
 * 3D Model Manifest
 *
 * Maps (SKU, Config) → 3D model paths.
 * Each desk family can have multiple GLBs, one per Config (Executive, Manager,
 * Conference, L-Shape, etc.). When a config has no dedicated GLB, the lookup
 * falls back to the family default.
 */

export interface Model3D {
  /** Path to web-ready GLB (Draco compressed) — served from /public */
  glb: string;
  /** Path to USDZ for iOS AR Quick Look — optional */
  usdz?: string;
  /** Human-readable label shown in the 360° thumbnail */
  label?: string;
}

/**
 * (SKU, Config) → model paths. Keys are `${sku}:${config}`. A bare `${sku}`
 * entry is the fallback when a specific config isn't mapped.
 */
const PRODUCTS_3D_MANIFEST: Record<string, Model3D> = {
  // Cratos — the part-composition pipeline (AssemblyViewer) is the primary
  // 3D path for all Cratos configs. These single-GLB entries are kept as a
  // last-resort fallback for configs NOT in the manifest (e.g. if the
  // manifest fetch fails or a config has no parts yet).
  //
  // NOTE: "Executive" was renamed to "Operator" in families.ts (2026-04-20).
  // The manifest key is "Operator". The old "Executive" GLB still serves as
  // the fallback baked model when AssemblyViewer cannot load.
  "DESK-CRATOS": {
    glb: "/3d/cratos-executive/model.glb",
    usdz: "/3d/cratos-executive/model.usdz",
    label: "Cratos Desk",
  },
  // "Operator" is the renamed "Executive" — maps to the same baked GLB as
  // fallback. The AssemblyViewer will render first when manifest is present.
  "DESK-CRATOS:Operator": {
    glb: "/3d/cratos-executive/model.glb",
    usdz: "/3d/cratos-executive/model.usdz",
    label: "Cratos Operator",
  },
  // Kept for backward-compat in case any bookmark/bot still loads
  // /shop/cratos?config=Executive — won't match manifest so falls to GLB.
  "DESK-CRATOS:Executive": {
    glb: "/3d/cratos-executive/model.glb",
    usdz: "/3d/cratos-executive/model.usdz",
    label: "Cratos Executive",
  },
};

/**
 * Look up 3D model data for a product SKU (and optional Config).
 * Tries `${sku}:${config}` first, falls back to `${sku}`, then undefined.
 */
export function getProduct3DModel(sku?: string, config?: string): Model3D | undefined {
  if (!sku) return undefined;
  if (config) {
    const keyed = PRODUCTS_3D_MANIFEST[`${sku}:${config}`];
    if (keyed) return keyed;
  }
  return PRODUCTS_3D_MANIFEST[sku] ?? undefined;
}
