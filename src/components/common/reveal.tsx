"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  yIn?: number;
  yOut?: number;
}

export function Reveal({ children, className, yIn = 30, yOut = -15 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [yIn, 0, 0, yOut]);

  if (reducedMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, y, position: "relative" }}
    >
      {children}
    </motion.div>
  );
}
