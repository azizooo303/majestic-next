"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * ParallaxSketches — furniture wireframe objects that travel WITH the user as they scroll.
 * Objects are positioned at the page edges and each moves at a different parallax depth.
 * Replaces the fixed-layer approach (which was always hidden by opaque section backgrounds).
 */
export function ArchitecturalBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Window-level scroll — drives all parallax
  const { scrollY } = useScroll();

  // Each layer moves at a different speed — creates depth
  // Positive = moves DOWN with scroll but slower (floats behind you)
  // Negative = moves UP (counter-scroll, feels distant)
  const y0 = useTransform(scrollY, [0, 4000], [0, 320]);   // slowest — deep background
  const y1 = useTransform(scrollY, [0, 4000], [0, 180]);   // slow
  const y2 = useTransform(scrollY, [0, 4000], [0, 100]);   // medium
  const y3 = useTransform(scrollY, [0, 4000], [0, 60]);    // fast — close to scroll speed
  const y4 = useTransform(scrollY, [0, 4000], [0, -80]);   // counter — drifts up

  if (reduced) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {/* ─────────────────────────────────────────
          OBJECT 1: Office Chair — right edge, near top
          Travels slowly downward (deeper layer)
      ───────────────────────────────────────── */}
      <motion.div
        className="absolute hidden lg:block"
        style={{
          top: "8vh",
          right: "-20px",
          width: 220,
          y: y0,
        }}
      >
        <svg viewBox="0 0 200 280" width="220" height="308" fill="none" aria-hidden="true">
          <g stroke="#0c0c0c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.08">
            {/* Backrest */}
            <rect x="55" y="20" width="90" height="100" rx="4" />
            <line x1="75" y1="40" x2="125" y2="40" />
            <line x1="75" y1="60" x2="125" y2="60" />
            <line x1="75" y1="80" x2="125" y2="80" />
            {/* Seat */}
            <rect x="40" y="130" width="120" height="30" rx="3" />
            {/* Armrests */}
            <line x1="40" y1="145" x2="10" y2="145" />
            <rect x="2" y="125" width="10" height="25" rx="2" />
            <line x1="160" y1="145" x2="190" y2="145" />
            <rect x="188" y="125" width="10" height="25" rx="2" />
            {/* Stem */}
            <line x1="100" y1="160" x2="100" y2="210" />
            {/* Wheel base star */}
            <line x1="100" y1="210" x2="60" y2="240" />
            <line x1="100" y1="210" x2="140" y2="240" />
            <line x1="100" y1="210" x2="75" y2="255" />
            <line x1="100" y1="210" x2="125" y2="255" />
            <line x1="100" y1="210" x2="100" y2="260" />
            {/* Wheels */}
            <circle cx="60" cy="242" r="5" />
            <circle cx="140" cy="242" r="5" />
            <circle cx="75" cy="257" r="5" />
            <circle cx="125" cy="257" r="5" />
            <circle cx="100" cy="262" r="5" />
            {/* Height cylinder */}
            <rect x="90" y="158" width="20" height="20" rx="2" />
            {/* Dimension marks */}
            <line x1="165" y1="20" x2="175" y2="20" />
            <line x1="165" y1="130" x2="175" y2="130" />
            <line x1="170" y1="20" x2="170" y2="130" strokeDasharray="4 3" />
          </g>
        </svg>
      </motion.div>

      {/* ─────────────────────────────────────────
          OBJECT 2: Executive Desk — left edge
          Medium parallax depth
      ───────────────────────────────────────── */}
      <motion.div
        className="absolute hidden lg:block"
        style={{
          top: "55vh",
          left: "-30px",
          width: 280,
          y: y1,
        }}
      >
        <svg viewBox="0 0 260 160" width="280" height="172" fill="none" aria-hidden="true">
          <g stroke="#0c0c0c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.07">
            {/* Desk top surface — isometric-ish */}
            <rect x="30" y="30" width="200" height="55" rx="2" />
            {/* Desk top edge detail */}
            <rect x="30" y="30" width="200" height="8" rx="2" />
            {/* Left leg */}
            <rect x="35" y="85" width="16" height="65" rx="1" />
            {/* Right leg */}
            <rect x="209" y="85" width="16" height="65" rx="1" />
            {/* Cross beam */}
            <line x1="51" y1="118" x2="209" y2="118" />
            {/* Monitor outline */}
            <rect x="95" y="10" width="70" height="45" rx="3" />
            <line x1="130" y1="55" x2="130" y2="65" />
            <line x1="115" y1="65" x2="145" y2="65" />
            {/* Cable */}
            <path d="M 130 55 Q 140 60 145 65" strokeDasharray="2 2" />
            {/* Drawer pulls */}
            <rect x="50" y="50" width="30" height="18" rx="1" />
            <line x1="60" y1="59" x2="70" y2="59" />
            {/* Dimension marks */}
            <line x1="30" y1="155" x2="230" y2="155" />
            <line x1="30" y1="151" x2="30" y2="159" />
            <line x1="230" y1="151" x2="230" y2="159" />
            <line x1="128" y1="153" x2="132" y2="157" />
          </g>
        </svg>
      </motion.div>

      {/* ─────────────────────────────────────────
          OBJECT 3: Floor Lamp — right edge, mid page
          Faster layer — feels closer
      ───────────────────────────────────────── */}
      <motion.div
        className="absolute hidden xl:block"
        style={{
          top: "130vh",
          right: "10px",
          width: 120,
          y: y2,
        }}
      >
        <svg viewBox="0 0 100 320" width="120" height="384" fill="none" aria-hidden="true">
          <g stroke="#0c0c0c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.09">
            {/* Lamp shade */}
            <path d="M 30,60 L 15,15 L 75,15 L 60,60 Z" />
            {/* Inner shade line */}
            <line x1="22" y1="45" x2="68" y2="45" />
            {/* Bulb */}
            <circle cx="45" cy="30" r="7" strokeDasharray="3 2" />
            {/* Arm */}
            <path d="M 45,60 L 45,100 Q 50,130 55,160 L 55,280" />
            {/* Counterweight arm */}
            <path d="M 45,100 L 15,80" />
            <circle cx="12" cy="79" r="5" />
            {/* Adjustment joint */}
            <circle cx="45" cy="100" r="5" />
            <circle cx="55" cy="160" r="4" />
            {/* Base */}
            <ellipse cx="55" cy="290" rx="28" ry="8" />
            <line x1="27" y1="290" x2="20" y2="295" />
            <line x1="83" y1="290" x2="90" y2="295" />
            <line x1="55" y1="298" x2="55" y2="303" />
            <ellipse cx="55" cy="303" rx="18" ry="5" />
            {/* Height dimension */}
            <line x1="80" y1="15" x2="90" y2="15" />
            <line x1="80" y1="280" x2="90" y2="280" />
            <line x1="85" y1="15" x2="85" y2="280" strokeDasharray="5 3" />
          </g>
        </svg>
      </motion.div>

      {/* ─────────────────────────────────────────
          OBJECT 4: Drafting Compass — left edge, lower
          Counter-moves upward as you scroll
      ───────────────────────────────────────── */}
      <motion.div
        className="absolute hidden xl:block"
        style={{
          top: "200vh",
          left: "20px",
          width: 160,
          y: y4,
        }}
      >
        <svg viewBox="0 0 140 200" width="160" height="229" fill="none" aria-hidden="true">
          <g stroke="#0c0c0c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.08">
            {/* Left leg */}
            <line x1="70" y1="20" x2="30" y2="170" />
            {/* Right leg */}
            <line x1="70" y1="20" x2="110" y2="170" />
            {/* Hinge */}
            <circle cx="70" cy="20" r="6" />
            {/* Left needle foot */}
            <line x1="30" y1="170" x2="25" y2="190" />
            <circle cx="24" cy="192" r="3" />
            {/* Right pencil foot */}
            <line x1="110" y1="170" x2="115" y2="185" />
            <rect x="111" y="183" width="7" height="12" rx="1" />
            <line x1="113" y1="194" x2="116" y2="197" />
            {/* Adjustment screw */}
            <rect x="55" y="78" width="30" height="10" rx="2" />
            <line x1="60" y1="83" x2="80" y2="83" />
            {/* Arc sweep */}
            <path d="M 30 170 Q 70 130 110 170" strokeDasharray="4 3" />
            {/* Radius notation */}
            <text fontSize="9" fill="#0c0c0c" opacity="0.4" x="60" y="158" fontFamily="monospace">R</text>
          </g>
        </svg>
      </motion.div>

      {/* ─────────────────────────────────────────
          OBJECT 5: Architectural Ruler — left, deep lower
          Slow — feels like background texture
      ───────────────────────────────────────── */}
      <motion.div
        className="absolute hidden lg:block"
        style={{
          top: "280vh",
          left: "-10px",
          width: 200,
          y: y0,
        }}
      >
        <svg viewBox="0 0 180 60" width="200" height="67" fill="none" aria-hidden="true">
          <g stroke="#0c0c0c" strokeWidth="1.2" strokeLinecap="round" opacity="0.07">
            {/* Ruler body */}
            <rect x="5" y="15" width="170" height="30" rx="2" />
            {/* Major ticks */}
            {[20, 40, 60, 80, 100, 120, 140, 160].map((x) => (
              <line key={x} x1={x} y1="15" x2={x} y2="30" />
            ))}
            {/* Minor ticks */}
            {[30, 50, 70, 90, 110, 130, 150].map((x) => (
              <line key={x} x1={x} y1="15" x2={x} y2="22" strokeWidth="0.8" />
            ))}
            {/* Bevel edge detail */}
            <line x1="5" y1="45" x2="175" y2="45" strokeWidth="0.6" />
            {/* Angle cut left */}
            <line x1="5" y1="15" x2="0" y2="30" />
          </g>
        </svg>
      </motion.div>

      {/* ─────────────────────────────────────────
          OBJECT 6: Storage/Cabinet outline — right, lower
          Medium-slow layer
      ───────────────────────────────────────── */}
      <motion.div
        className="absolute hidden lg:block"
        style={{
          top: "340vh",
          right: "-15px",
          width: 180,
          y: y1,
        }}
      >
        <svg viewBox="0 0 150 220" width="180" height="264" fill="none" aria-hidden="true">
          <g stroke="#0c0c0c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.07">
            {/* Cabinet body */}
            <rect x="15" y="10" width="120" height="200" rx="2" />
            {/* Horizontal shelf dividers */}
            <line x1="15" y1="75" x2="135" y2="75" />
            <line x1="15" y1="140" x2="135" y2="140" />
            {/* Door gap line (left side unit) */}
            <line x1="75" y1="10" x2="75" y2="75" />
            <line x1="75" y1="75" x2="75" y2="140" />
            {/* Pull handles */}
            <line x1="62" y1="42" x2="62" y2="50" />
            <line x1="88" y1="42" x2="88" y2="50" />
            <line x1="62" y1="107" x2="62" y2="115" />
            <line x1="88" y1="107" x2="88" y2="115" />
            {/* Lower open shelf */}
            <line x1="30" y1="165" x2="120" y2="165" />
            <line x1="30" y1="185" x2="120" y2="185" />
            {/* Legs */}
            <line x1="25" y1="210" x2="25" y2="225" />
            <line x1="125" y1="210" x2="125" y2="225" />
            {/* Dimension */}
            <line x1="140" y1="10" x2="148" y2="10" />
            <line x1="140" y1="210" x2="148" y2="210" />
            <line x1="144" y1="10" x2="144" y2="210" strokeDasharray="5 3" />
          </g>
        </svg>
      </motion.div>

      {/* ─────────────────────────────────────────
          OBJECT 7: Small corner marks + dimension crosses
          Scattered, ultra-subtle at edges
      ───────────────────────────────────────── */}
      <motion.div
        className="absolute hidden md:block"
        style={{ top: "20vh", left: "12px", y: y3 }}
      >
        <svg viewBox="0 0 40 40" width="40" height="40" fill="none" aria-hidden="true">
          <g stroke="#0c0c0c" strokeWidth="1" opacity="0.12" strokeLinecap="square">
            <path d="M 0,14 L 0,0 L 14,0" />
          </g>
        </svg>
      </motion.div>

      <motion.div
        className="absolute hidden md:block"
        style={{ top: "20vh", right: "12px", y: y3 }}
      >
        <svg viewBox="0 0 40 40" width="40" height="40" fill="none" aria-hidden="true">
          <g stroke="#0c0c0c" strokeWidth="1" opacity="0.12" strokeLinecap="square">
            <path d="M 40,14 L 40,0 L 26,0" />
          </g>
        </svg>
      </motion.div>

      {/* Crosshair marks scattered through the page */}
      {[
        { top: "45vh", left: "5%", y: y2 },
        { top: "95vh", right: "4%", y: y1 },
        { top: "165vh", left: "3%", y: y3 },
        { top: "240vh", right: "6%", y: y0 },
        { top: "310vh", left: "7%", y: y2 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:block"
          style={{ ...pos, width: 24, height: 24 }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
            <g stroke="#0c0c0c" strokeWidth="0.8" opacity="0.1" strokeLinecap="round">
              <line x1="12" y1="0" x2="12" y2="10" />
              <line x1="12" y1="14" x2="12" y2="24" />
              <line x1="0" y1="12" x2="10" y2="12" />
              <line x1="14" y1="12" x2="24" y2="12" />
              <circle cx="12" cy="12" r="3" />
            </g>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
