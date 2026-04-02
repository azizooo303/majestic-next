"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ease, duration as motionDurationScale } from "@/lib/motion";

interface DrawInProps {
  d: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  delay?: number;
  drawDuration?: number;
  viewBox?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  /** If true, renders only <motion.path> without a wrapping <svg> — for embedding in a parent SVG */
  asPath?: boolean;
}

export function DrawIn({
  d,
  stroke = "currentColor",
  strokeWidth = 0.5,
  opacity = 0.18,
  delay = 0,
  drawDuration = motionDurationScale.draw,
  viewBox = "0 0 100 100",
  width = "100%",
  height = "100%",
  className,
  asPath = false,
}: DrawInProps) {
  const reduced = useReducedMotion();

  const pathEl = (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="square"
      initial={reduced ? { opacity } : { pathLength: 0, opacity: 0 }}
      whileInView={reduced ? {} : { pathLength: 1, opacity }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: drawDuration, ease: ease.out, delay }}
    />
  );

  if (asPath) return pathEl;

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      {pathEl}
    </svg>
  );
}
