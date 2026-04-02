"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ease, duration as motionDurationScale, VIEWPORT_THRESHOLD } from "@/lib/motion";

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;       // px, default 24
  delay?: number;         // seconds, default 0
  motionDuration?: number; // seconds, default duration.slow (0.5)
}

export function FadeUp({
  children,
  className,
  yOffset = 24,
  delay = 0,
  motionDuration = motionDurationScale.slow,
}: FadeUpProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: VIEWPORT_THRESHOLD }}
      transition={{ duration: motionDuration, ease: ease.smooth, delay }}
    >
      {children}
    </motion.div>
  );
}
