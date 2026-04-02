"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";

interface StaggerGridProps {
  children: React.ReactNode[];
  className?: string;
  stagger?: number;
  isRTL?: boolean;
}

export function StaggerGrid({ children, className, stagger = 0.04 }: StaggerGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 0.2"],
  });

  const orderedChildren = children;

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
  const inStart = Math.min(offset, 0.8);
  const inEnd = Math.min(inStart + 0.4, 1);

  const opacity = useTransform(scrollYProgress, [inStart, inEnd], [0, 1]);
  const y = useTransform(scrollYProgress, [inStart, inEnd], [24, 0]);

  if (reducedMotion) return <>{children}</>;

  return (
    <motion.div style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}
