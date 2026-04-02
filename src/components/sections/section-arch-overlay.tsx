"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ease, duration } from "@/lib/motion";

type Variant = "grid" | "dimension" | "crosshair";

interface SectionArchOverlayProps {
  variant: Variant;
  opacity?: number;
  color?: string;
  className?: string;
}

const pathTransition = (delay: number) => ({
  duration: duration.draw,
  ease: ease.out,
  delay,
});

export function SectionArchOverlay({
  variant,
  opacity = 0.06,
  color = "#0c0c0c",
  className,
}: SectionArchOverlayProps) {
  const reduced = useReducedMotion();

  const motionPath = (d: string, delay: number, sw = 0.4) => (
    <motion.path
      key={d}
      d={d}
      stroke={color}
      strokeWidth={sw}
      fill="none"
      strokeLinecap="square"
      initial={reduced ? { opacity } : { pathLength: 0, opacity: 0 }}
      whileInView={reduced ? {} : { pathLength: 1, opacity }}
      viewport={{ once: true, amount: 0.1 }}
      transition={pathTransition(delay)}
    />
  );

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden hidden md:block${className ? ` ${className}` : ""}`}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        {variant === "grid" && (
          <>
            {/* Horizontal lines top-to-bottom */}
            {motionPath("M 0,20 L 100,20", 0.00)}
            {motionPath("M 0,40 L 100,40", 0.12)}
            {motionPath("M 0,60 L 100,60", 0.24)}
            {motionPath("M 0,80 L 100,80", 0.36)}
            {/* Vertical lines — after horizontals */}
            {motionPath("M 20,0 L 20,100", 0.48)}
            {motionPath("M 40,0 L 40,100", 0.60)}
            {motionPath("M 60,0 L 60,100", 0.72)}
            {motionPath("M 80,0 L 80,100", 0.84)}
          </>
        )}

        {variant === "dimension" && (
          <>
            {/* Horizontal span bar near bottom */}
            {motionPath("M 2,94 L 98,94", 0.0)}
            {/* Left end tick */}
            {motionPath("M 2,91 L 2,97", 0.2, 0.3)}
            {/* Right end tick */}
            {motionPath("M 98,91 L 98,97", 0.3, 0.3)}
            {/* Mid tick */}
            {motionPath("M 50,92 L 50,96", 0.4, 0.25)}
            {/* Quarter ticks */}
            {motionPath("M 25,93 L 25,95", 0.5, 0.2)}
            {motionPath("M 75,93 L 75,95", 0.5, 0.2)}
            {/* Label box outline (center) */}
            {motionPath("M 44,88 L 56,88 L 56,92 L 44,92 Z", 0.6, 0.2)}
          </>
        )}

        {variant === "crosshair" && (
          <>
            {/* Vertical arm */}
            {motionPath("M 50,35 L 50,65", 0.0)}
            {/* Horizontal arm */}
            {motionPath("M 35,50 L 65,50", 0.15)}
            {/* Circle ring approximated as 4 arcs via path */}
            <motion.circle
              cx={50}
              cy={50}
              r={12}
              stroke={color}
              strokeWidth={0.35}
              fill="none"
              initial={reduced ? { opacity } : { pathLength: 0, opacity: 0 }}
              whileInView={reduced ? {} : { pathLength: 1, opacity }}
              viewport={{ once: true, amount: 0.1 }}
              transition={pathTransition(0.3)}
            />
            {/* Corner tick marks */}
            {motionPath("M 10,10 L 16,10 L 16,16", 0.45, 0.25)}
            {motionPath("M 90,10 L 84,10 L 84,16", 0.55, 0.25)}
            {motionPath("M 10,90 L 16,90 L 16,84", 0.65, 0.25)}
            {motionPath("M 90,90 L 84,90 L 84,84", 0.75, 0.25)}
          </>
        )}
      </svg>
    </div>
  );
}
