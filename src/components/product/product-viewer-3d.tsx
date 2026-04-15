"use client";

import Script from "next/script";
import type { Model3D } from "@/lib/products-3d";

interface ProductViewer3DProps {
  model: Model3D;
  name: string;
}

const STUDIO_BACKDROP =
  "radial-gradient(ellipse 70% 55% at 50% 45%, #b8b8b8 0%, #cfcfcf 22%, #e6e6e6 45%, #f5f5f5 68%, #ffffff 88%)";

export function ProductViewer3D({ model, name }: ProductViewer3DProps) {
  return (
    <>
      <Script
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        strategy="afterInteractive"
        type="module"
      />

      <div
        className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[420px] overflow-hidden border border-[#D4D4D4]"
        style={{ background: STUDIO_BACKDROP }}
      >
        <model-viewer
          src={model.glb}
          ios-src={model.usdz}
          alt={`360° view of ${name}`}
          camera-controls
          touch-action="pan-y"
          interaction-prompt="none"
          auto-rotate
          auto-rotate-delay="1500"
          rotation-per-second="18deg"
          camera-orbit="35deg 72deg 4.2m"
          min-camera-orbit="auto 45deg 2.4m"
          max-camera-orbit="auto 90deg 7m"
          field-of-view="30deg"
          min-field-of-view="22deg"
          max-field-of-view="45deg"
          environment-image="neutral"
          exposure="1.25"
          tone-mapping="commerce"
          shadow-intensity="1.6"
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
