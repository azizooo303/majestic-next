"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ease, duration as motionDurationScale, VIEWPORT_THRESHOLD } from "@/lib/motion";

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;    // seconds between children, default 0.08
  yOffset?: number;         // default 24
  motionDuration?: number;  // per-child duration, default duration.slow
}

const containerVariants = (staggerDelay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

const childVariants = (yOffset: number, dur: number) => ({
  hidden: { opacity: 0, y: yOffset },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur, ease: ease.smooth },
  },
});

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.08,
  yOffset = 24,
  motionDuration = motionDurationScale.slow,
}: StaggerChildrenProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const childVar = childVariants(yOffset, motionDuration);

  return (
    <motion.div
      className={className}
      variants={containerVariants(staggerDelay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: VIEWPORT_THRESHOLD }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={childVar}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
