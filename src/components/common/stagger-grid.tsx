"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";

interface StaggerGridProps {
  children: React.ReactNode[];
  className?: string;
  stagger?: number;
  isRTL?: boolean;
}

export function StaggerGrid({ children, className, stagger = 0.04, isRTL = false }: StaggerGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const orderedChildren = isRTL ? [...children].reverse() : children;

  return (
    <div ref={containerRef} className={className} style={{ position: "relative" }}>
      {orderedChildren.map((child, i) => (
        <ScrollLinkedItem
          key={i}
          scrollYProgress={scrollYProgress}
          index={i}
          stagger={stagger}
          reducedMotion={!!reducedMotion}
        >
          {child}
        </ScrollLinkedItem>
      ))}
    </div>
  );
}

function ScrollLinkedItem({
  children,
  scrollYProgress,
  index,
  stagger,
  reducedMotion,
}: {
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  index: number;
  stagger: number;
  reducedMotion: boolean;
}) {
  const offset = index * stagger;
  const inStart = 0 + offset;
  const inEnd = 0.2 + offset;
  // Guard: outStart must always be > inEnd
  const safeOutStart = Math.max(inEnd + 0.05, 0.75);
  const safeOutEnd = Math.max(safeOutStart + 0.2, 0.95);

  const opacity = useTransform(
    scrollYProgress,
    [inStart, inEnd, safeOutStart, safeOutEnd],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [inStart, inEnd, safeOutStart, safeOutEnd],
    [24, 0, 0, -12]
  );

  if (reducedMotion) return <>{children}</>;

  return (
    <motion.div style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}
