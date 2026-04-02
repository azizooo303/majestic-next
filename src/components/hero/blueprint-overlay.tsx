"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ease, duration } from "@/lib/motion";

interface BlueprintOverlayProps {
  slideKey: number;  // changes on each slide transition to re-trigger fade
}

export function BlueprintOverlay({ slideKey }: BlueprintOverlayProps) {
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <motion.div
      key={slideKey}
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        backgroundImage: "url('/images/blueprint-pattern.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "400px 400px",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.06 }}
      transition={{ duration: duration.blueprint, ease: ease.out }}
      aria-hidden="true"
    />
  );
}
