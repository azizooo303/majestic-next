/**
 * AssemblyViewer — three.js-based 3D product viewer that composes scenes
 * from a parts manifest (instead of loading a single baked GLB).
 *
 * Replaces <ProductViewer3D> on Cratos. Other families keep model-viewer
 * until each lands a manifest.
 */
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { AssemblyState, FamilyManifest } from "@/lib/scene-composer";
import { composeScene } from "@/lib/scene-composer";

interface AssemblyViewerProps {
  manifest: FamilyManifest;
  state: AssemblyState;
  name: string;
  viewpoint?: number;
  command?: ViewerCommand | null;
  /** CSS color string for the viewer backdrop. Defaults to transparent so the
   *  parent container's backgroundColor shows through. The parent
   *  (family-configurator) controls the warm off-white / grey flip logic. */
  backgroundColor?: string;
}

export type ViewerCommand = {
  type: "rotate" | "zoom" | "reset" | "ar";
  token: number;
};

const CAMERA_VIEWS = [
  { direction: [1.65, 0.72, 1.9], distance: 1.28 },
  { direction: [0.05, 0.5, 2.1], distance: 1.18 },
  { direction: [0.05, 2.25, 0.08], distance: 1.55 },
  { direction: [1.1, 0.48, 1.05], distance: 0.72 },
  { direction: [-1.8, 0.9, 2.25], distance: 1.55 },
] as const;

export function AssemblyViewer({ manifest, state, name, viewpoint = 0, command, backgroundColor }: AssemblyViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentAssemblyRef = useRef<THREE.Group | null>(null);
  const rafRef = useRef<number | null>(null);
  const pausedUntilRef = useRef(0);
  const currentViewRef = useRef(viewpoint);

  // --- one-time setup: renderer + scene + camera + controls + env + resize -------
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Resolve the scene clear color from the backgroundColor prop.
    // We read it once here (at mount time) — the reactive effect below keeps
    // it in sync whenever the prop changes.
    const bgColor = new THREE.Color(backgroundColor ?? "#F7F4EE");

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      // alpha: false — we own the background color; no CSS bleed needed.
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setClearColor(bgColor, 1);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    // Solid warm off-white infinity backdrop — matches the CSS outer container.
    // The reactive effect below keeps this in sync when backgroundColor prop changes.
    scene.background = bgColor;
    sceneRef.current = scene;

    // Neutral studio environment (model-viewer's "neutral" look).
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // Ground shadow — ShadowMaterial only darkens where a real light
    // casts a shadow; everywhere else stays fully transparent so the warm
    // off-white scene.background shows through cleanly. Previously this was
    // a MeshBasicMaterial at 0.12 opacity which dimmed the *entire* floor
    // disc to grey and read as a visible grey floor (Aziz bug 2026-04-21).
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.ShadowMaterial({ opacity: 0.22 }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.001;
    shadow.receiveShadow = true;
    shadow.name = "contact-shadow";
    scene.add(shadow);
    // ShadowMaterial needs a directional light that casts shadows + the
    // renderer with shadowMap enabled. Without them the floor is invisible
    // (which is fine — desk sits on the off-white backdrop cleanly).
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(2.5, 4, 2);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -3; sun.shadow.camera.right = 3;
    sun.shadow.camera.top = 3; sun.shadow.camera.bottom = -3;
    sun.shadow.bias = -0.0001;
    scene.add(sun);

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.05, 50);
    camera.position.set(1.8, 1.35, 2.4);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    // Full 360° horizontal + near-full vertical — users need to rotate
    // freely to inspect any angle, including looking UP at the underside
    // of the desk (Aziz: "I CANT SE BELOW VERY GOOD"). Only clamp at the
    // absolute poles so orbit math doesn't gimbal-lock.
    controls.minPolarAngle = 0.05;
    controls.maxPolarAngle = Math.PI - 0.05;
    controls.minDistance = 0.9;
    controls.maxDistance = 6.0;
    controls.rotateSpeed = 0.9;
    controls.zoomSpeed = 1.0;
    controls.target.set(0, 0.45, 0);
    controls.update();
    controlsRef.current = controls;

    // Auto-rotate when idle (matches the model-viewer feel).
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    const markInteraction = () => {
      pausedUntilRef.current = Date.now() + 3000;
    };
    renderer.domElement.addEventListener("pointerdown", markInteraction);
    renderer.domElement.addEventListener("wheel", markInteraction);

    const animate = () => {
      controls.autoRotate = Date.now() > pausedUntilRef.current;
      controls.update();
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", markInteraction);
      renderer.domElement.removeEventListener("wheel", markInteraction);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      controls.dispose();
      pmrem.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  // --- reactive: sync backgroundColor prop → scene.background + clearColor ------
  useEffect(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    if (!renderer || !scene) return;
    const color = new THREE.Color(backgroundColor ?? "#F7F4EE");
    scene.background = color;
    renderer.setClearColor(color, 1);
  }, [backgroundColor]);

  // --- reactive: recompose scene when state changes ------------------------------
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    let cancelled = false;

    (async () => {
      try {
        const group = await composeScene(manifest, state);
        if (cancelled) return;

        // Remove prior assembly group
        if (currentAssemblyRef.current) {
          scene.remove(currentAssemblyRef.current);
          disposeSubtree(currentAssemblyRef.current);
        }
        scene.add(group);
        currentAssemblyRef.current = group;

        // Reframe camera to the new bounding box (smooth — don't jump).
        reframeCamera(group);
      } catch (err) {
        console.warn("[assembly-viewer] compose failed", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [manifest, state]);

  function reframeCamera(assembly: THREE.Group) {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const box = new THREE.Box3().setFromObject(assembly);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    controls.minDistance = Math.max(maxDim * 0.7, 1.0);
    controls.maxDistance = Math.max(maxDim * 3.5, 5.0);
    applyCameraView(currentViewRef.current, { pause: false });
  }

  useEffect(() => {
    currentViewRef.current = viewpoint;
    applyCameraView(viewpoint);
  }, [viewpoint]);

  useEffect(() => {
    if (!command) return;
    if (command.type === "reset") {
      currentViewRef.current = 0;
      applyCameraView(0);
    } else if (command.type === "zoom") {
      zoomCamera(0.78);
    } else if (command.type === "rotate") {
      rotateCamera(Math.PI / 4);
    } else if (command.type === "ar") {
      // AR is handled by the model-viewer path; the composed three.js viewer has no AR entry.
      return;
    }
  }, [command]);

  function applyCameraView(viewIndex: number, options: { pause?: boolean } = {}) {
    const assembly = currentAssemblyRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!assembly || !camera || !controls) return;

    const view = CAMERA_VIEWS[((viewIndex % CAMERA_VIEWS.length) + CAMERA_VIEWS.length) % CAMERA_VIEWS.length];
    const box = new THREE.Box3().setFromObject(assembly);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 1);
    const target = new THREE.Vector3(center.x, Math.max(center.y, 0.44), center.z);
    const fitDistance = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    const distance = Math.max(fitDistance * view.distance, maxDim * 0.95, 1.35);
    const direction = new THREE.Vector3(...view.direction).normalize();

    controls.target.copy(target);
    camera.position.copy(target).add(direction.multiplyScalar(distance));
    camera.near = Math.max(distance / 120, 0.02);
    camera.far = Math.max(distance * 8, 50);
    camera.updateProjectionMatrix();
    controls.update();
    if (options.pause !== false) pausedUntilRef.current = Date.now() + 2500;
  }

  function zoomCamera(factor: number) {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor);
    camera.position.copy(controls.target).add(offset);
    controls.update();
    pausedUntilRef.current = Date.now() + 2500;
  }

  function rotateCamera(radians: number) {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const offset = camera.position.clone().sub(controls.target);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), radians);
    camera.position.copy(controls.target).add(offset);
    controls.update();
    pausedUntilRef.current = Date.now() + 2500;
  }

  return (
    <div
      ref={mountRef}
      aria-label={`3D view of ${name}`}
      className="w-full h-full"
      style={{
        // Matches the scene.background so there is no flash of a different color
        // before the first WebGL frame paints. The canvas (alpha:false) covers
        // this fully once rendered.
        backgroundColor: backgroundColor ?? "#F7F4EE",
      }}
    />
  );
}

// --- helpers ---------------------------------------------------------------
function disposeSubtree(obj: THREE.Object3D) {
  obj.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.geometry?.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[];
      if (Array.isArray(mat)) {
        for (const m of mat) m.dispose();
      } else if (mat) {
        mat.dispose();
      }
    }
  });
}
