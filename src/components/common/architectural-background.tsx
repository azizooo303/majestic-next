"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ease, duration } from "@/lib/motion";

interface ArchitecturalBackgroundProps {
  opacity?: number;
  hideOnMobile?: boolean;
}

export function ArchitecturalBackground({
  hideOnMobile = true,
}: ArchitecturalBackgroundProps) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const hLen = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const vLen = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const bracketTransition = (delay: number) => ({
    duration: duration.blueprint,
    ease: ease.out,
    delay,
  });

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none overflow-hidden${hideOnMobile ? " hidden md:block" : ""}`}
      style={{ zIndex: 0, willChange: "transform" }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* ── Group 1: Static grid — very low opacity ── */}
        <g opacity={0.05} stroke="#0c0c0c" strokeWidth={0.08} fill="none">
          {/* Horizontal lines */}
          <line x1={0} y1={10} x2={100} y2={10} />
          <line x1={0} y1={25} x2={100} y2={25} />
          <line x1={0} y1={50} x2={100} y2={50} />
          <line x1={0} y1={75} x2={100} y2={75} />
          <line x1={0} y1={90} x2={100} y2={90} />
          {/* Vertical lines */}
          <line x1={8}  y1={0} x2={8}  y2={100} />
          <line x1={25} y1={0} x2={25} y2={100} />
          <line x1={50} y1={0} x2={50} y2={100} />
          <line x1={75} y1={0} x2={75} y2={100} />
          <line x1={92} y1={0} x2={92} y2={100} />
        </g>

        {/* ── Group 2: Corner brackets — animated on mount ── */}
        <g opacity={0.12} stroke="#0c0c0c" strokeWidth={0.4} fill="none" strokeLinecap="square">
          {/* Top-left */}
          <motion.path
            d="M 3,8 L 3,3 L 8,3"
            initial={reduced ? {} : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={bracketTransition(0.0)}
          />
          {/* Top-right */}
          <motion.path
            d="M 92,3 L 97,3 L 97,8"
            initial={reduced ? {} : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={bracketTransition(0.1)}
          />
          {/* Bottom-left */}
          <motion.path
            d="M 3,92 L 3,97 L 8,97"
            initial={reduced ? {} : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={bracketTransition(0.2)}
          />
          {/* Bottom-right */}
          <motion.path
            d="M 92,97 L 97,97 L 97,92"
            initial={reduced ? {} : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={bracketTransition(0.3)}
          />
        </g>

        {/* ── Group 3: Static diagonals — very subtle ── */}
        <g opacity={0.04} stroke="#0c0c0c" strokeWidth={0.06} fill="none">
          <line x1={3} y1={3} x2={97} y2={97} />
          <line x1={97} y1={3} x2={3} y2={97} />
        </g>

        {/* ── Group 4: Scroll-driven dimension lines ── */}
        <g opacity={0.08} stroke="#0c0c0c" strokeWidth={0.3} fill="none" strokeLinecap="square">
          {/* Horizontal span bottom */}
          <motion.path
            d="M 5,97 L 95,97"
            style={reduced ? {} : { pathLength: hLen }}
          />
          {/* Arrow left */}
          <motion.path d="M 6,96 L 5,97 L 6,98" style={reduced ? {} : { pathLength: hLen }} />
          {/* Arrow right */}
          <motion.path d="M 94,96 L 95,97 L 94,98" style={reduced ? {} : { pathLength: hLen }} />
          {/* Ticks at x=25,50,75 */}
          <motion.path d="M 25,96 L 25,98" style={reduced ? {} : { pathLength: hLen }} />
          <motion.path d="M 50,95.5 L 50,98.5" style={reduced ? {} : { pathLength: hLen }} />
          <motion.path d="M 75,96 L 75,98" style={reduced ? {} : { pathLength: hLen }} />

          {/* Vertical span left */}
          <motion.path
            d="M 3,5 L 3,95"
            style={reduced ? {} : { pathLength: vLen }}
          />
          {/* Arrow top */}
          <motion.path d="M 2,6 L 3,5 L 4,6" style={reduced ? {} : { pathLength: vLen }} />
          {/* Arrow bottom */}
          <motion.path d="M 2,94 L 3,95 L 4,94" style={reduced ? {} : { pathLength: vLen }} />
          {/* Ticks at y=25,50,75 */}
          <motion.path d="M 2,25 L 4,25" style={reduced ? {} : { pathLength: vLen }} />
          <motion.path d="M 1.5,50 L 4.5,50" style={reduced ? {} : { pathLength: vLen }} />
          <motion.path d="M 2,75 L 4,75" style={reduced ? {} : { pathLength: vLen }} />
        </g>

        {/* ── Group 5: Static dashed centerlines ── */}
        <g opacity={0.06} stroke="#0c0c0c" strokeWidth={0.1} fill="none">
          <line x1={0} y1={50} x2={100} y2={50} strokeDasharray="0.3 1.2" />
          <line x1={50} y1={0} x2={50} y2={100} strokeDasharray="0.3 1.2" />
        </g>
      </svg>
    </div>
  );
}
