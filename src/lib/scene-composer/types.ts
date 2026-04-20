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
  | "grommet"
  | "feet"
  | "handle"
  | "unknown";

// NOTE: roles are compared AFTER stripping any "_N" numeric suffix (top_0 → top).
// See baseRole() below. This keeps the set small while handling multi-piece parts.

export const WOOD_FINISH_ROLES = new Set<string>([
  "top",
  "pedestal_top",
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
  "screen_front",   // divider/bracket
  "screen_side",
  "handle",         // drawer handles, metal
  "pedestal",       // pedestal body painted like frame
  "pedestal_handle",
]);

/** Strip trailing "_0", "_12" etc. so "top_0" matches "top" in the role sets. */
export function baseRole(role: string): string {
  return role.replace(/_\d+$/, "");
}

export const ACCESSORY_ROLES = new Set<RoleKind>([
  "modesty",
  "pedestal",
  "pedestal_handle",
  "cable_tray",
  "cable_spine",
  "screen_front",
  "screen_side",
]);

/** Map each accessory role -> the picker "axis" that controls its visibility. */
export const ACCESSORY_AXIS: Record<string, string> = {
  modesty: "modesty",
  pedestal: "pedestal",
  pedestal_handle: "pedestal",
  pedestal_top: "pedestal", // visible only if user enables pedestal
  cable_tray: "cable_mgmt",
  cable_spine: "cable_mgmt",
  screen_front: "screen",
  screen_side: "screen",
};

/** Runtime state passed to the composer — picker selections + global config. */
export interface AssemblyState {
  config: string;
  size: string;
  topFinishName: string;
  legColorName: string;
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
