"use client";
import { motion, useReducedMotion } from "framer-motion";

type Direction = "left" | "right" | "up" | "fade-scale";

interface SectionRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  distance?: number;   // px offset to start from, default 60
  duration?: number;   // seconds, default 0.7
  delay?: number;
  className?: string;
}

const variants = (direction: Direction, distance: number) => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -distance : direction === "right" ? distance : 0,
    y: direction === "up" ? distance * 0.6 : 0,
    scale: direction === "fade-scale" ? 0.97 : 1,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  },
});

export function SectionReveal({
  children,
  direction = "up",
  distance = 60,
  duration = 0.7,
  delay = 0,
  className,
}: SectionRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={variants(direction, distance)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
