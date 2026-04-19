"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import type { Model3D } from "@/lib/products-3d";
import {
  FAMILY_MESH_MAP,
  DESK_TOP_FINISH_HEX,
  DESK_TOP_FINISH_TEXTURE,
  LEG_COLOR_MATERIAL,
} from "@/data/families";

// Minimal shape of the material object exposed by <model-viewer> 4.x runtime API.
// Docs: https://modelviewer.dev/docs/index.html#entrydocs-materials
interface MVImage {
  setURI?: (uri: string) => Promise<void> | void;
}
interface MVTexture {
  source?: MVImage | null;
}
interface MVTextureInfo {
  texture?: MVTexture | null;
  setTexture: (tex: MVTexture | null) => void;
}
interface MVMaterial {
  name: string;
  pbrMetallicRoughness: {
    baseColorTexture?: MVTextureInfo;
    setBaseColorFactor: (rgba: [number, number, number, number]) => void;
    setRoughnessFactor?: (v: number) => void;
    setMetallicFactor?: (v: number) => void;
  };
}
interface MVModel {
  materials: MVMaterial[];
}
interface MVElement extends HTMLElement {
  model?: MVModel;
  // createTexture is a method on the ModelViewerElement itself (not on .model).
  createTexture?: (uri: string) => Promise<MVTexture>;
}

interface ProductViewer3DProps {
  model: Model3D;
  name: string;
  /** SKU used to look up FAMILY_MESH_MAP (e.g. "DESK-CRATOS"). Optional — omit for static viewer. */
  familySku?: string;
  /** Config name (Executive, Manager, Conference, L-Shape). Used to pick a per-config
   *  mesh map entry `${FAMILY}:${config}`. Falls back to `${FAMILY}` if no entry found. */
  config?: string;
  /** Finish name from DESK_TOP_FINISHES picker (e.g. "Italian Walnut"). Optional. */
  topFinishName?: string;
  /** Leg color name — future: will swap legs material when GLB has separate material slots. */
  legColorName?: string;
}

const STUDIO_BACKDROP =
  "radial-gradient(ellipse 70% 55% at 50% 45%, #b8b8b8 0%, #cfcfcf 22%, #e6e6e6 45%, #f5f5f5 68%, #ffffff 88%)";

/** Parse #RRGGBB → [r, g, b] floats in 0..1 range. */
function hexToFloat(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return [r, g, b];
}

export function ProductViewer3D({
  model,
  name,
  familySku,
  config,
  topFinishName,
  legColorName,
}: ProductViewer3DProps) {
  const mvRef = useRef<MVElement | null>(null);

  // Material swap effect — fires on finish/leg change after GLB is loaded.
  useEffect(() => {
    const el = mvRef.current;
    if (!el || !familySku) return;

    const family = familySku.replace(/^DESK-/, "");
    // Prefer config-specific mesh map if present, fall back to family default.
    const meshMap =
      (config && FAMILY_MESH_MAP[`${family}:${config}`]) ||
      FAMILY_MESH_MAP[family];
    if (!meshMap) return; // family not mapped yet — static viewer fallback

    // Reset baseColorFactor to white (1,1,1,1) so the loaded texture shows at full color
    // instead of being tinted by the prior hex swap.
    const WHITE: [number, number, number, number] = [1, 1, 1, 1];

    const applySwap = async () => {
      const modelObj = el.model;
      if (!modelObj || !modelObj.materials || modelObj.materials.length === 0) return;

      // --- Top: prefer real texture via existing source.setURI, then createTexture,
      // and finally fall back to flat hex if neither works.
      if (topFinishName) {
        const topMat = modelObj.materials.find((m) => m.name === meshMap.topMaterial);
        if (topMat) {
          const textureUrl = DESK_TOP_FINISH_TEXTURE[topFinishName];
          const absoluteUrl = textureUrl
            ? new URL(textureUrl, window.location.origin).toString()
            : null;
          const textureInfo = topMat.pbrMetallicRoughness.baseColorTexture;
          let applied: "setURI" | "createTexture" | "hex" | "skip" = "skip";

          // Path A — mutate the source URI of the texture that's already bound to the material.
          // Most reliable across model-viewer v2→v4.
          if (absoluteUrl && textureInfo?.texture?.source?.setURI) {
            try {
              await textureInfo.texture.source.setURI(absoluteUrl);
              topMat.pbrMetallicRoughness.setBaseColorFactor(WHITE);
              topMat.pbrMetallicRoughness.setRoughnessFactor?.(0.55);
              topMat.pbrMetallicRoughness.setMetallicFactor?.(0.0);
              applied = "setURI";
            } catch (e) {
              console.warn("[viewer] source.setURI failed", e);
            }
          }

          // Path B — create a new texture via the element-level createTexture
          // (NOT on .model — that was the bug in the previous attempt) and bind it.
          if (applied === "skip" && absoluteUrl && typeof el.createTexture === "function") {
            try {
              const tex = await el.createTexture(absoluteUrl);
              textureInfo?.setTexture(tex);
              topMat.pbrMetallicRoughness.setBaseColorFactor(WHITE);
              topMat.pbrMetallicRoughness.setRoughnessFactor?.(0.55);
              topMat.pbrMetallicRoughness.setMetallicFactor?.(0.0);
              applied = "createTexture";
            } catch (e) {
              console.warn("[viewer] createTexture failed", e);
            }
          }

          // Path C — flat hex (no texture available or all texture paths failed).
          if (applied === "skip" && DESK_TOP_FINISH_HEX[topFinishName]) {
            const [r, g, b] = hexToFloat(DESK_TOP_FINISH_HEX[topFinishName]);
            textureInfo?.setTexture(null);
            topMat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
            applied = "hex";
          }

          console.log(`[viewer] top finish "${topFinishName}" → ${applied}`, {
            url: absoluteUrl,
            hasTextureInfo: !!textureInfo,
            hasSource: !!textureInfo?.texture?.source,
            hasSetURI: typeof textureInfo?.texture?.source?.setURI,
          });
        }
      }

      // --- Legs/body: flat hex + metalness + roughness (powder coat vs chrome).
      if (legColorName && LEG_COLOR_MATERIAL[legColorName]) {
        const legsMat = modelObj.materials.find((m) => m.name === meshMap.legsMaterial);
        if (legsMat) {
          const { hex, metalness, roughness } = LEG_COLOR_MATERIAL[legColorName];
          const [r, g, b] = hexToFloat(hex);
          try {
            legsMat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
            legsMat.pbrMetallicRoughness.setMetallicFactor?.(metalness);
            legsMat.pbrMetallicRoughness.setRoughnessFactor?.(roughness);
          } catch (e) {
            console.warn("[viewer] legs material swap failed", e);
          }
        }
      }
    };

    // model-viewer emits 'load' once the GLB is ready. If already loaded (cached),
    // el.model is already populated so we call immediately; otherwise we wait.
    if (el.model) {
      applySwap();
    } else {
      const onLoad = () => applySwap();
      el.addEventListener("load", onLoad, { once: true });
      return () => el.removeEventListener("load", onLoad);
    }
  }, [familySku, config, topFinishName, legColorName]);

  return (
    <>
      <Script
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        strategy="afterInteractive"
        type="module"
      />

      <div
        className="relative w-full aspect-[4/3] md:aspect-[16/9] min-h-[520px] md:min-h-[600px] overflow-hidden border border-[#D4D4D4]"
        style={{ background: STUDIO_BACKDROP }}
      >
        <model-viewer
          // @ts-expect-error — ref to web component element
          ref={mvRef}
          src={model.glb}
          ios-src={model.usdz}
          alt={`360° view of ${name}`}
          camera-controls
          touch-action="pan-y"
          interaction-prompt="none"
          auto-rotate
          auto-rotate-delay="1500"
          rotation-per-second="18deg"
          camera-orbit="35deg 72deg auto"
          min-camera-orbit="auto 45deg auto"
          max-camera-orbit="auto 90deg auto"
          environment-image="neutral"
          exposure="1.0"
          tone-mapping="neutral"
          shadow-intensity="1.4"
          shadow-softness="0.85"
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-placement="floor"
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
          }}
        >
          <button
            slot="ar-button"
            style={{
              backgroundColor: "#2C2C2C",
              color: "#FFFFFF",
              border: "none",
              padding: "11px 18px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              cursor: "pointer",
              position: "absolute",
              bottom: "18px",
              right: "18px",
              borderRadius: 0,
              textTransform: "uppercase",
            }}
          >
            View in AR
          </button>
        </model-viewer>
      </div>
    </>
  );
}
