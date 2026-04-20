/**
 * Part GLB cache + loader — one-time fetch per URL, shared across all viewers
 * on the page. Uses three.js's GLTFLoader with Draco decoder wired for the
 * CDN-hosted WASM (keeps bundle small).
 */
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// Draco WASM decoder — served by Google's CDN. Matches the encoder version
// used by Blender's glTF exporter at the time of part extraction.
const DRACO_DECODER_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";

let _loader: GLTFLoader | null = null;
function getLoader(): GLTFLoader {
  if (_loader) return _loader;
  const draco = new DRACOLoader();
  draco.setDecoderPath(DRACO_DECODER_PATH);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  _loader = loader;
  return loader;
}

// URL → Promise<GLTF>. A Promise (not a resolved GLTF) so concurrent calls
// to loadPart for the same url share a single in-flight fetch.
const _cache = new Map<string, Promise<GLTF>>();

export function loadPart(url: string): Promise<GLTF> {
  const cached = _cache.get(url);
  if (cached) return cached;
  const p = new Promise<GLTF>((resolve, reject) => {
    getLoader().load(
      url,
      (gltf) => resolve(gltf),
      undefined,
      (err) => reject(err),
    );
  });
  _cache.set(url, p);
  return p;
}

/**
 * Clone a GLTF scene for independent transform + material state.
 * Three.js's SkinnedMesh needs special handling, but for our static desk parts
 * a plain deep clone via Object3D.clone(true) works.
 * Materials are shared by reference; the composer makes them unique per-role
 * via Material.clone() before applying per-variant overrides.
 */
export function cloneGLTFScene(gltf: GLTF): THREE.Object3D {
  return gltf.scene.clone(true);
}

/**
 * Cache stats — exposed for debug / telemetry.
 */
export function cacheSize(): number {
  return _cache.size;
}

export function clearCache(): void {
  _cache.clear();
}
