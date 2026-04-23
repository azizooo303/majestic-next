/**
 * Scene composer — takes a family manifest + user's picker state and returns
 * a three.js Group containing all active parts, positioned, sized, materialed.
 *
 * Called on picker change. Reuses cached GLBs (zero network cost after first
 * visit). Only mutates transforms + visibility + materials — doesn't reload
 * meshes.
 */
import * as THREE from "three";
import type {
  AssemblyState,
  ConfigEntry,
  FamilyManifest,
  PartEntry,
  RoleKind,
} from "./types";
import { ACCESSORY_AXIS, ACCESSORY_ROLES, baseRole, parseSize } from "./types";
import { cloneGLTFScene, loadPart } from "./cache";
import { applyMaterialForRole } from "./materials";

export interface ComposedPart {
  role: string;
  node: THREE.Object3D;
  entry: PartEntry;
}

/**
 * Compose a scene for the given state. Returns a Promise<THREE.Group> that
 * resolves when all active parts are loaded + placed + materialed.
 */
export async function composeScene(
  manifest: FamilyManifest,
  state: AssemblyState,
): Promise<THREE.Group> {
  const group = new THREE.Group();
  group.name = `assembly-${manifest.family}-${state.config}`;

  const configEntry = manifest.configs[state.config];
  if (!configEntry) return group;

  const activeParts = resolveActiveParts(configEntry, state);
  const base = parseSize(configEntry.baseSize);
  const picked = parseSize(state.size);
  const stretch = base && picked
    ? { x: picked.w / base.w, z: picked.d / base.d }
    : { x: 1, z: 1 };

  const composed = await Promise.all(
    activeParts.map(async ({ role, entry }) => {
      const gltf = await loadPart(entry.glb);
      const node = cloneGLTFScene(gltf);
      node.name = role;
      placePart(node, role as RoleKind, entry, stretch);
      await applyMaterialForRole(
        node,
        role as RoleKind,
        state.topFinishName,
        state.legColorName,
        state.dividerColorName,
        state.baseFinishName,
      );
      return { role, node, entry };
    }),
  );

  for (const { node } of composed) group.add(node);
  return group;
}

/** Filter the parts map to only the roles that should be visible for this state. */
function resolveActiveParts(
  configEntry: ConfigEntry,
  state: AssemblyState,
): Array<{ role: string; entry: PartEntry }> {
  const out: Array<{ role: string; entry: PartEntry }> = [];
  for (const [role, entry] of Object.entries(configEntry.parts)) {
    // Role keys in the manifest are suffixed (screen_front_0, screen_front_1, …).
    // ACCESSORY_AXIS is keyed by the BASE role, so normalize before lookup.
    const axis = ACCESSORY_AXIS[baseRole(role)];
    if (axis) {
      if (!state.accessories[axis]) continue;
    }
    out.push({ role, entry });
  }
  return out;
}

/**
 * Place a part at its anchor.
 *
 * Note: with the current extraction pipeline (2026-04-20), each part GLB has
 * its world-space position baked into the mesh itself (see blender-extract-parts.py
 * bake_transform_and_recenter). Manifest anchors are therefore (0,0,0) and
 * placement is a no-op — we leave the node at origin and the mesh self-places.
 *
 * Stretch is disabled in this pass because stretching a world-positioned mesh
 * would scale around the GLB origin (which is outside the mesh), producing
 * wrong visuals. When we need size variants, we'll re-extract with mesh-local
 * centering per-role and re-enable this path.
 */
function placePart(
  node: THREE.Object3D,
  role: RoleKind,
  entry: PartEntry,
  _stretch: { x: number; z: number },
): void {
  void role;
  const [ax, ay, az] = entry.anchor;
  node.position.set(ax, ay, az);
}

function _placePart_legacy_stretch(
  node: THREE.Object3D,
  role: RoleKind,
  entry: PartEntry,
  stretch: { x: number; z: number },
): void {
  const [ax, ay, az] = entry.anchor;

  // Legs move outward with stretch but keep their authored scale.
  if (role === "leg_l" || role === "leg_r") {
    node.position.set(ax * stretch.x, ay, az);
    return;
  }

  // Tops and similar flexible parts scale.
  if (role === "top") {
    node.position.set(ax, ay, az);
    node.scale.set(stretch.x, 1, stretch.z);
    return;
  }

  if (role === "frame_beam" || role === "modesty") {
    node.position.set(ax, ay, az);
    node.scale.set(stretch.x, 1, 1);
    return;
  }

  // Default — place at authored anchor, no stretch.
  node.position.set(ax, ay, az);
}

/**
 * List of accessory axes present in a config — drives which pickers to render.
 * Deduplicated, stable order.
 */
export function accessoryAxesInConfig(configEntry: ConfigEntry): string[] {
  const seen = new Set<string>();
  const order: string[] = [];
  for (const role of Object.keys(configEntry.parts)) {
    // Same numeric-suffix normalization as resolveActiveParts — otherwise
    // "screen_front_0" doesn't match the "screen_front" ACCESSORY_AXIS key
    // and the whole accessory section stays empty in the UI.
    const axis = ACCESSORY_AXIS[baseRole(role)];
    if (!axis || seen.has(axis)) continue;
    seen.add(axis);
    order.push(axis);
  }
  return order;
}
