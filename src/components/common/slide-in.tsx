"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ease, duration } from "@/lib/motion";

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  xOffset?: number;  // default -20 (from left). Pass +20 for RTL.
  delay?: number;    // seconds
}

export function SlideIn({
  children,
  className,
  xOffset = -20,
  delay = 0,
}: SlideInProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: xOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: duration.medium, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
