/**
 * Type declarations for <model-viewer> custom element.
 * Loaded via CDN (Google model-viewer) — no npm package required.
 * https://modelviewer.dev/docs/
 *
 * React 19 uses React.JSX.IntrinsicElements, not the global JSX namespace.
 */

import type { CSSProperties, HTMLAttributes } from "react";

interface ModelViewerAttributes extends HTMLAttributes<HTMLElement> {
  /** URL to the glTF/GLB model */
  src?: string;
  /** URL to the USDZ model for iOS AR Quick Look */
  "ios-src"?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Enable camera orbit controls (drag to rotate) */
  "camera-controls"?: boolean | string;
  /** Auto-rotate the model */
  "auto-rotate"?: boolean | string;
  /** Delay before auto-rotate starts (ms) */
  "auto-rotate-delay"?: string;
  /** Rotation speed */
  "rotation-per-second"?: string;
  /** Shadow intensity (0–1) */
  "shadow-intensity"?: string;
  /** Shadow softness (0–1) */
  "shadow-softness"?: string;
  /** HDR environment image */
  "environment-image"?: string;
  /** Scene exposure */
  exposure?: string;
  /** Initial camera orbit: azimuthal elevation radius */
  "camera-orbit"?: string;
  /** Enable WebXR / AR mode */
  ar?: boolean | string;
  /** Comma-separated AR modes */
  "ar-modes"?: string;
  /** AR placement: "floor" | "wall" */
  "ar-placement"?: string;
  /** Loading strategy */
  loading?: "auto" | "lazy" | "eager";
  /** Poster image shown while loading */
  poster?: string;
  /** Reveal strategy */
  reveal?: "auto" | "interaction";
  /** Interaction prompt */
  "interaction-prompt"?: "auto" | "none";
  style?: CSSProperties;
}

// Augment React's JSX namespace for React 19 + react-jsx transform.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttributes;
    }
  }
}
