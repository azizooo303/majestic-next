/**
 * Shared types for the scene composer — mirrors the manifest.json shape
 * emitted by scripts/blender-extract-parts.py.
 */

export type Vec3 = [number, number, number];

/** One atomic part extracted from a master.blend. */
export interface PartEntry {
  /** Absolute URL path under /public (e.g. "/3d-parts/cratos/top/executive.glb"). */
  glb: string;
  /** World-space origin of the object in its source .blend. Used as anchor in the composed scene. */
  anchor: Vec3;
  /** World-space bbox extents (width, depth, height) in meters. */
  bbox: Vec3;
  /** Raw file size in bytes (debug + audit). */
  bytes: number;
  /** Content hash of the mesh vertex data — used for accessory dedup across configs/families. */
  hash: string;
}

/** Configuration entry — the set of parts + defaults for one Config (e.g. "Executive"). */
export interface ConfigEntry {
  /** role name -> PartEntry. Role names are canonical (top, leg_l, leg_r, modesty, pedestal, ...). */
  parts: Record<string, PartEntry>;
  /** Native authored size of the top in "WxD" cm format (e.g. "180x90"). Drives runtime stretch ratios. */
  baseSize: string | null;
  /** Objects the Blender classifier couldn't classify — handled manually on next extraction run. */
  unknowns: Array<{ name: string; materials: string[]; bbox: Vec3; location: Vec3 }>;
}

export interface FamilyManifest {
  family: string;
  generated_at: string;
  configs: Record<string, ConfigEntry>;
}

/**
 * Role classification — drives how the composer applies materials and accessories.
 *
 * - "top" + "pedestal_top" → carry DESK_TOP_FINISH textures (wood grain)
 * - "leg_l", "leg_r", "frame_beam" → carry LEG_COLOR_MATERIAL (metal)
 * - "body" → fixed painted white/off-white casework from original Max sources
 * - "modesty", "pedestal", "pedestal_handle", "cable_tray", "cable_spine", "screen_front", "screen_side" → accessory toggles
 * - "grommet", "feet" → always visible (structural trim)
 * - "handle" → wood-finish OR painted depending on family
 * - "unknown" → not composed; flagged for classifier improvement
 */
export type RoleKind =
  | "top"
  | "pedestal_top"
  | "leg_l"
  | "leg_r"
  | "frame_beam"
  | "modesty"
  | "pedestal"
  | "pedestal_handle"
  | "cable_tray"
  | "cable_spine"
  | "screen_front"
  | "screen_side"
  | "bracket"
  | "grommet"
  | "feet"
  | "handle"
  | "base"
  | "body"
  | "unknown";

// NOTE: roles are compared AFTER stripping any "_N" numeric suffix (top_0 → top).
// See baseRole() below. This keeps the set small while handling multi-piece parts.

export const WOOD_FINISH_ROLES = new Set<string>([
  "top",
  "pedestal_top",
]);

/**
 * Roles that render as wood but are driven by the BASE-finish picker, not the
 * top-finish picker. Used by credenzas (Beauty, etc.) to support wood-on-wood
 * two-tone: user picks top wood and base wood independently.
 */
export const BASE_FINISH_ROLES = new Set<string>([
  "base",
]);

export const METAL_FINISH_ROLES = new Set<string>([
  "leg_l",
  "leg_r",
  "leg",            // generic (before disambiguate)
  "frame_beam",
  "feet",           // leveling feet are metal
  "modesty",        // painted panel matches legs
  "grommet",        // cable cover, metal
  "cable_tray",
  "cable_spine",
  "handle",         // drawer handles, metal
  "pedestal",       // pedestal body painted like frame
  "pedestal_handle",
]);

/**
 * Roles that render as static brushed/white metal — NOT driven by the leg-color
 * picker. Divider brackets stay stainless-steel regardless of what color legs
 * the user picks (matches real-world hardware: brackets don't match paint jobs).
 */
export const STATIC_METAL_ROLES = new Set<string>([
  "bracket",
]);

/** Fixed painted casework/body panels, used when source materials are missing. */
export const STATIC_BODY_ROLES = new Set<string>([
  "body",
]);

export const BODY_COLOR = {
  hex: "#F3F1EA",
  metalness: 0.0,
  roughness: 0.58,
};

export const BRACKET_COLOR = {
  hex: "#D9D9DA",
  metalness: 0.85,
  roughness: 0.35,
};

/** Roles that render as fabric-covered panels (Majestic acoustic dividers). */
export const FABRIC_FINISH_ROLES = new Set<string>([
  "screen_front",
  "screen_side",
]);

/**
 * Fabric colors for the divider_color picker — matches workspace.sa catalog
 * codes so we can offer the same options on majestic-next.vercel.app.
 */
export const DIVIDER_COLOR_MATERIAL: Record<string, { hex: string; label: string }> = {
  "9009-26-gray":     { hex: "#8B8E90", label: "Gray" },
  "9009-09-beige":    { hex: "#C7B8A0", label: "Beige" },
  "9009-28-charcoal": { hex: "#3C3E40", label: "Charcoal" },
  "9009-01-taupe":    { hex: "#9A8573", label: "Taupe" },
  "9009-15-green":    { hex: "#6E8570", label: "Green" },
  "9009-07-pink":     { hex: "#D3A9A6", label: "Pink" },
  "9009-16-blue":     { hex: "#6E8398", label: "Blue" },
};
export const DEFAULT_DIVIDER_COLOR = "9009-26-gray";

/**
 * When a role appears in this map, the composer loads THIS GLB instead of
 * the one in the config's manifest entry. Kept empty now that every config
 * has its own extracted divider parts — the IKEA-Eilif-style pleated panels
 * are per-config, not a single shared override.
 */
export const ROLE_GLB_OVERRIDE: Record<string, string> = {};

/** Strip trailing "_0", "_12" etc. so "top_0" matches "top" in the role sets. */
export function baseRole(role: string): string {
  return role.replace(/_\d+$/, "");
}

export const ACCESSORY_ROLES = new Set<string>([
  "modesty",
  "pedestal",
  "pedestal_handle",
  "pedestal_top",
  "cable_tray",
  "cable_spine",
  "screen_front",
  "screen_side",
  "grommet",
  "powerbox",
  "handle",
]);

/**
 * Map each accessory role -> the picker "axis" that controls its visibility.
 * Each axis is its own toggle in the UI so Aziz can see front vs side dividers
 * separately, and cable tray vs spine separately, rather than lumped together.
 */
export const ACCESSORY_AXIS: Record<string, string> = {
  modesty: "modesty",
  pedestal: "pedestal",
  pedestal_handle: "pedestal",
  pedestal_top: "pedestal",
  cable_tray: "cable_tray",
  cable_spine: "cable_spine",
  screen_front: "screen_front",
  screen_side: "screen_side",
  grommet: "grommet",
  powerbox: "powerbox",
  // handle intentionally NOT an accessory axis — handles are bundled with pedestal visually
};

/** Runtime state passed to the composer — picker selections + global config. */
export interface AssemblyState {
  config: string;
  size: string;
  topFinishName: string;
  legColorName: string;
  /** Key in DIVIDER_COLOR_MATERIAL — drives fabric color on screen_* roles. */
  dividerColorName?: string;
  /**
   * Wood decor for the `base` role (credenza body panels). Independent from
   * topFinishName so users can pick wood-on-wood two-tone. If omitted, base
   * roles fall back to topFinishName (monotone).
   */
  baseFinishName?: string;
  /** per-axis accessory state. Axes without entries default to false unless a part's default is true. */
  accessories: Record<string, boolean>;
}

/** Parsed size like "180x90" → { w: 1.8, d: 0.9 } in meters. */
export function parseSize(size: string | null | undefined): { w: number; d: number } | null {
  if (!size) return null;
  const m = size.match(/^(\d+)x(\d+)/);
  if (!m) return null;
  return { w: parseInt(m[1], 10) / 100, d: parseInt(m[2], 10) / 100 };
}
