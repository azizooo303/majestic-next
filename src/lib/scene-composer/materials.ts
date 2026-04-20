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
  METAL_FINISH_ROLES,
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
 * Route a (role, state) to the correct material application. No-op for roles
 * that carry their own baked material (grommet, feet).
 */
export async function applyMaterialForRole(
  subtree: THREE.Object3D,
  role: RoleKind,
  topFinishName: string,
  legColorName: string,
): Promise<void> {
  if (WOOD_FINISH_ROLES.has(role)) {
    await applyWoodFinish(subtree, topFinishName);
  } else if (METAL_FINISH_ROLES.has(role)) {
    applyMetalFinish(subtree, legColorName);
  }
  // grommet / feet / unknown — leave baked materials intact
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
