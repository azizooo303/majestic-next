/**
 * Role-based material application for the scene composer.
 *
 * Reuses the same texture/hex swap logic the old <ProductViewer3D> used,
 * but applied at the three.js scene level per-role instead of via the
 * model-viewer material API.
 */
import * as THREE from "three";
import {
  DESK_TOP_FINISH_HEX,
  DESK_TOP_FINISH_TEXTURE,
  LEG_COLOR_MATERIAL,
} from "@/data/families";
import {
  type RoleKind,
  WOOD_FINISH_ROLES,
  BASE_FINISH_ROLES,
  METAL_FINISH_ROLES,
  FABRIC_FINISH_ROLES,
  STATIC_METAL_ROLES,
  BRACKET_COLOR,
  DIVIDER_COLOR_MATERIAL,
  DEFAULT_DIVIDER_COLOR,
  baseRole,
} from "./types";

// Shared TextureLoader — caches decoded textures by URL.
const _texLoader = new THREE.TextureLoader();
const _texCache = new Map<string, THREE.Texture>();

function loadTextureCached(url: string): Promise<THREE.Texture> {
  const cached = _texCache.get(url);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve, reject) => {
    _texLoader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        _texCache.set(url, tex);
        resolve(tex);
      },
      undefined,
      (err) => reject(err),
    );
  });
}

/**
 * Apply wood finish (texture + fallback hex) to every mesh in the given subtree.
 * Clones material first so other parts of the same scene aren't affected.
 */
export async function applyWoodFinish(
  subtree: THREE.Object3D,
  finishName: string,
): Promise<void> {
  const texUrl = DESK_TOP_FINISH_TEXTURE[finishName];
  const hex = DESK_TOP_FINISH_HEX[finishName];
  const tex = texUrl ? await loadTextureCached(texUrl).catch(() => null) : null;

  subtree.traverse((obj) => {
    if (!(obj as THREE.Mesh).isMesh) return;
    const mesh = obj as THREE.Mesh;
    const mat = ensureStandardMaterial(mesh);
    if (tex) {
      mat.map = tex;
      mat.color.set(0xffffff); // let the texture drive color
    } else if (hex) {
      mat.map = null;
      mat.color.set(hex);
    }
    mat.roughness = 0.55;
    mat.metalness = 0.0;
    mat.needsUpdate = true;
  });
}

const FABRIC_WEAVE_URL = "/materials/fabric/acoustic-weave.jpg";

/**
 * Apply fabric finish — acoustic-weave texture tinted by the picked divider color.
 *
 * `hex` drives `material.color` so the weave texture reads as that color (texture
 * luminance multiplies the tint — works well with greyscale weave maps). Used for
 * every `screen_front_*` / `screen_side_*` role. If the hex is omitted, defaults
 * to the catalog Gray 9009-26.
 */
export async function applyFabricFinish(
  subtree: THREE.Object3D,
  hex: string = DIVIDER_COLOR_MATERIAL[DEFAULT_DIVIDER_COLOR].hex,
): Promise<void> {
  const tex = await loadTextureCached(FABRIC_WEAVE_URL).catch(() => null);
  subtree.traverse((obj) => {
    if (!(obj as THREE.Mesh).isMesh) return;
    const mesh = obj as THREE.Mesh;
    const mat = ensureStandardMaterial(mesh);
    if (tex) {
      // Clone the texture so per-mesh repeat settings don't leak across dividers.
      const mtex = tex.clone();
      mtex.wrapS = THREE.RepeatWrapping;
      mtex.wrapT = THREE.RepeatWrapping;
      mtex.repeat.set(6, 3); // visual density for a ~60cm x 40cm panel
      mtex.needsUpdate = true;
      mat.map = mtex;
      // Tint the weave with the picked fabric color. Texture greyscale × tint.
      mat.color.set(hex);
    } else {
      mat.map = null;
      mat.color.set(hex);
    }
    mat.metalness = 0.0;
    mat.roughness = 0.92;
    mat.needsUpdate = true;
  });
}

/**
 * Apply the static bracket finish — always brushed stainless, not driven by any picker.
 * Brackets are real hardware; they don't paint-match the legs or the fabric.
 */
export function applyBracketFinish(subtree: THREE.Object3D): void {
  subtree.traverse((obj) => {
    if (!(obj as THREE.Mesh).isMesh) return;
    const mesh = obj as THREE.Mesh;
    const mat = ensureStandardMaterial(mesh);
    mat.map = null;
    mat.color.set(BRACKET_COLOR.hex);
    mat.metalness = BRACKET_COLOR.metalness;
    mat.roughness = BRACKET_COLOR.roughness;
    mat.needsUpdate = true;
  });
}

/**
 * Apply leg/metal finish (hex + metalness + roughness) to every mesh in the subtree.
 */
export function applyMetalFinish(
  subtree: THREE.Object3D,
  legColorName: string,
): void {
  const entry = LEG_COLOR_MATERIAL[legColorName];
  if (!entry) return;
  subtree.traverse((obj) => {
    if (!(obj as THREE.Mesh).isMesh) return;
    const mesh = obj as THREE.Mesh;
    const mat = ensureStandardMaterial(mesh);
    mat.map = null;
    mat.color.set(entry.hex);
    mat.metalness = entry.metalness;
    mat.roughness = entry.roughness;
    mat.needsUpdate = true;
  });
}

/**
 * Route a (role, state) to the correct material application.
 *
 * Normalizes the role by stripping any `_N` numeric suffix first — so
 * "top_0", "top_1", "frame_beam_12", "leg_r_0" all resolve to their base role.
 * This was the "some configs render fully white" bug — Manager, L-Shape, and
 * the meeting configs have numbered roles that didn't match the finish sets.
 */
export async function applyMaterialForRole(
  subtree: THREE.Object3D,
  role: RoleKind | string,
  topFinishName: string,
  legColorName: string,
  dividerColorName: string = DEFAULT_DIVIDER_COLOR,
  baseFinishName?: string,
): Promise<void> {
  const base = baseRole(role as string);
  if (BASE_FINISH_ROLES.has(base)) {
    // Wood-on-wood two-tone (credenzas): base roles take baseFinishName.
    // Falls back to topFinishName if no base-finish picker is wired (monotone).
    await applyWoodFinish(subtree, baseFinishName ?? topFinishName);
  } else if (WOOD_FINISH_ROLES.has(base)) {
    await applyWoodFinish(subtree, topFinishName);
  } else if (FABRIC_FINISH_ROLES.has(base)) {
    const entry = DIVIDER_COLOR_MATERIAL[dividerColorName] ?? DIVIDER_COLOR_MATERIAL[DEFAULT_DIVIDER_COLOR];
    await applyFabricFinish(subtree, entry.hex);
  } else if (STATIC_METAL_ROLES.has(base)) {
    applyBracketFinish(subtree);
  } else if (METAL_FINISH_ROLES.has(base)) {
    applyMetalFinish(subtree, legColorName);
  }
  // unknown / anything else — leave baked materials intact
}

/**
 * Ensure every mesh has a unique MeshStandardMaterial (not a clone-shared one).
 * Three.js's GLB loader sometimes returns MeshPhysicalMaterial or shared
 * references; we normalize to MeshStandardMaterial so PBR props are predictable.
 */
function ensureStandardMaterial(mesh: THREE.Mesh): THREE.MeshStandardMaterial {
  const current = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  if (current instanceof THREE.MeshStandardMaterial && current.userData.__clonedForComposer) {
    return current;
  }
  // Clone to a fresh MeshStandardMaterial so our writes are per-instance.
  const std = new THREE.MeshStandardMaterial();
  if (current) {
    if ("color" in current && (current as THREE.MeshStandardMaterial).color) {
      std.color.copy((current as THREE.MeshStandardMaterial).color);
    }
    if ("map" in current) std.map = (current as THREE.MeshStandardMaterial).map;
    if ("roughness" in current) std.roughness = (current as THREE.MeshStandardMaterial).roughness ?? 0.5;
    if ("metalness" in current) std.metalness = (current as THREE.MeshStandardMaterial).metalness ?? 0.0;
  }
  std.userData.__clonedForComposer = true;
  mesh.material = std;
  return std;
}
