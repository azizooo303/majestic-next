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
  // Cratos — Executive is the only config with a verified-clean baked GLB.
  // MGR/CONF/L exports from 2026-04-20 included a large backdrop floor plane
  // that broke the viewer's auto-framing (desk appeared as tiny floating
  // rectangle). Reverted until the part-GLB composition pipeline replaces
  // the baked-per-config approach entirely — see
  // C:/Users/Admin/.claude/plans/so-you-know-we-rippling-meteor.md
  "DESK-CRATOS": {
    glb: "/3d/cratos-executive/model.glb",
    usdz: "/3d/cratos-executive/model.usdz",
    label: "Cratos Desk",
  },
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
