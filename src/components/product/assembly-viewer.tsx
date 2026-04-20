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
  /** CSS color string for the viewer backdrop. Defaults to transparent so the
   *  parent container's backgroundColor shows through. The parent
   *  (family-configurator) controls the warm off-white / grey flip logic. */
  backgroundColor?: string;
}

export function AssemblyViewer({ manifest, state, name, backgroundColor }: AssemblyViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentAssemblyRef = useRef<THREE.Group | null>(null);
  const rafRef = useRef<number | null>(null);

  // --- one-time setup: renderer + scene + camera + controls + env + resize -------
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = null; // transparent — CSS backdrop behind
    sceneRef.current = scene;

    // Neutral studio environment (model-viewer's "neutral" look).
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // Soft ground shadow — a single contact shadow plane. Keeps things fast.
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.001;
    shadow.name = "contact-shadow";
    scene.add(shadow);

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.05, 50);
    camera.position.set(1.8, 1.35, 2.4);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minPolarAngle = Math.PI / 4;    // no going below horizon
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // no going above
    controls.minDistance = 1.2;
    controls.maxDistance = 5.0;
    controls.target.set(0, 0.45, 0);
    controls.update();
    controlsRef.current = controls;

    // Auto-rotate when idle (matches the model-viewer feel).
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    let interactionUntil = 0;
    const markInteraction = () => {
      interactionUntil = Date.now() + 3000;
    };
    renderer.domElement.addEventListener("pointerdown", markInteraction);
    renderer.domElement.addEventListener("wheel", markInteraction);

    const animate = () => {
      controls.autoRotate = Date.now() > interactionUntil;
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
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    // Don't move the camera, just retarget; user controls persist.
    controls.target.set(center.x, Math.max(center.y, 0.4), center.z);
    controls.minDistance = Math.max(maxDim * 0.7, 1.0);
    controls.maxDistance = Math.max(maxDim * 3.5, 5.0);
  }

  return (
    <div
      ref={mountRef}
      aria-label={`3D view of ${name}`}
      className="w-full h-full"
      style={{
        // backgroundColor comes from parent (family-configurator viewerBg logic).
        // Fallback to transparent so the parent container color shows through.
        // The old hardcoded grey gradient is intentionally removed — it was
        // overriding the parent's warm off-white (#F7F4EE) background.
        backgroundColor: backgroundColor ?? "transparent",
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
