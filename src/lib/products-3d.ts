/**
 * 3D Model Manifest
 *
 * Maps WooCommerce product SKU → 3D model paths.
 *
 * IMPORTANT FOR AZIZ: The key "DESK-CRATOS-EXEC" below is a placeholder.
 * Check the actual SKU in WooCommerce admin → Products → Cratos Executive Desk → SKU field.
 * Update the key below to match the exact WooCommerce SKU if it differs.
 */

export interface Model3D {
  /** Path to web-ready GLB (Draco compressed) — served from /public */
  glb: string;
  /** Path to USDZ for iOS AR Quick Look — optional */
  usdz?: string;
  /** Human-readable label shown in the 360° thumbnail */
  label?: string;
}

/** SKU → model paths map. Add new entries here as more products get 3D models. */
const PRODUCTS_3D_MANIFEST: Record<string, Model3D> = {
  "DESK-CRATOS": {
    glb: "/3d/cratos-executive/model.glb",
    usdz: "/3d/cratos-executive/model.usdz",
    label: "Cratos Desk",
  },
};

/**
 * Look up 3D model data for a given product SKU.
 * Returns undefined if no 3D model exists for that SKU — the gallery
 * will then show the standard image-only layout.
 */
export function getProduct3DModel(sku?: string): Model3D | undefined {
  if (!sku) return undefined;
  return PRODUCTS_3D_MANIFEST[sku] ?? undefined;
}
