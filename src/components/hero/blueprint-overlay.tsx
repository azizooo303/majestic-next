"use client";

interface Props {
  slideKey: number;
}

// Architectural blueprint grid overlay for hero banner slides.
// Renders a subtle animated SVG grid pattern tied to the active slide.
export function BlueprintOverlay({ slideKey: _slideKey }: Props) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-10 pointer-events-none select-none opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  );
}
