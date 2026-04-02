"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);

// Horizontal rule lines — blueprint measurement lines across full page width
// Each has a different parallax rate so they drift past each other as you scroll
const RULES = [
  { top: "6vh",   yTravel: 500, opacity: 0.13, dashed: false, label: "A1" },
  { top: "18vh",  yTravel: 310, opacity: 0.07, dashed: true },
  { top: "32vh",  yTravel: 420, opacity: 0.11, dashed: false, label: "A2" },
  { top: "50vh",  yTravel: 190, opacity: 0.06, dashed: true },
  { top: "68vh",  yTravel: 550, opacity: 0.12, dashed: false, label: "B1" },
  { top: "88vh",  yTravel: 270, opacity: 0.08, dashed: true },
  { top: "112vh", yTravel: 460, opacity: 0.10, dashed: false, label: "B2" },
  { top: "138vh", yTravel: 360, opacity: 0.06, dashed: true },
  { top: "168vh", yTravel: 480, opacity: 0.11, dashed: false, label: "C1" },
  { top: "200vh", yTravel: 220, opacity: 0.07, dashed: true },
  { top: "240vh", yTravel: 520, opacity: 0.10, dashed: false, label: "C2" },
  { top: "285vh", yTravel: 160, opacity: 0.06, dashed: true },
];

export function ArchitecturalBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const obj0 = useRef<HTMLDivElement>(null);
  const obj1 = useRef<HTMLDivElement>(null);
  const obj2 = useRef<HTMLDivElement>(null);
  const obj3 = useRef<HTMLDivElement>(null);
  const obj4 = useRef<HTMLDivElement>(null);
  const obj5 = useRef<HTMLDivElement>(null);
  const cornerTL = useRef<HTMLDivElement>(null);
  const cornerTR = useRef<HTMLDivElement>(null);
  const crosshairs = useRef<(HTMLDivElement | null)[]>([]);
  const rulesRef = useRef<(HTMLDivElement | null)[]>([]);
  const compassDot = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      const scrollConfig = {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      };

      // Sketch objects — y + subtle x drift for depth
      if (obj0.current) gsap.to(obj0.current, { y: 340, x: 18,  ease: "none", scrollTrigger: scrollConfig });
      if (obj1.current) gsap.to(obj1.current, { y: 200, x: -14, ease: "none", scrollTrigger: scrollConfig });
      if (obj2.current) gsap.to(obj2.current, { y: 120, x: 10,  ease: "none", scrollTrigger: scrollConfig });
      if (obj3.current) gsap.to(obj3.current, { y: -90, x: -12, ease: "none", scrollTrigger: scrollConfig });
      if (obj4.current) gsap.to(obj4.current, { y: 340, x: 8,   ease: "none", scrollTrigger: scrollConfig });
      if (obj5.current) gsap.to(obj5.current, { y: 200, x: -10, ease: "none", scrollTrigger: scrollConfig });
      if (cornerTL.current) gsap.to(cornerTL.current, { y: 70,  ease: "none", scrollTrigger: scrollConfig });
      if (cornerTR.current) gsap.to(cornerTR.current, { y: 70,  ease: "none", scrollTrigger: scrollConfig });
      crosshairs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, { y: [110, 70, 160, 220, 90][i] ?? 90, ease: "none", scrollTrigger: scrollConfig });
      });

      // Horizontal rule lines — each at its own parallax rate creating depth layers
      rulesRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, { y: RULES[i]?.yTravel ?? 200, ease: "none", scrollTrigger: scrollConfig });
      });

      // DrawSVG — stroke draw-in as each sketch object enters viewport
      const drawObj = (container: HTMLDivElement | null, start = "top 88%") => {
        if (!container) return;
        const paths = container.querySelectorAll<SVGGeometryElement>("path, line, rect, circle, ellipse");
        gsap.set(paths, { drawSVG: "0%" });
        gsap.to(paths, {
          drawSVG: "100%",
          duration: 1.8,
          ease: "power2.out",
          stagger: 0.045,
          scrollTrigger: {
            trigger: container,
            start,
            toggleActions: "play none none reset",
          },
        });
      };

      drawObj(obj0.current, "top 92%");
      drawObj(obj1.current, "top 88%");
      drawObj(obj2.current, "top 85%");
      drawObj(obj3.current, "top 85%");
      drawObj(obj4.current, "top 88%");
      drawObj(obj5.current, "top 88%");

      // Corner brackets draw in on page load
      if (cornerTL.current && cornerTR.current) {
        const tlPath = cornerTL.current.querySelector("path");
        const trPath = cornerTR.current.querySelector("path");
        if (tlPath) { gsap.set(tlPath, { drawSVG: "0%" }); gsap.to(tlPath, { drawSVG: "100%", duration: 1.0, ease: "power2.out", delay: 0.8 }); }
        if (trPath) { gsap.set(trPath, { drawSVG: "0%" }); gsap.to(trPath, { drawSVG: "100%", duration: 1.0, ease: "power2.out", delay: 1.0 }); }
      }

      // MotionPath — compass dot travels the arc on scroll
      if (compassDot.current && obj3.current) {
        gsap.to(compassDot.current, {
          motionPath: {
            path: "#compass-arc",
            align: "#compass-arc",
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
          },
          ease: "none",
          scrollTrigger: {
            trigger: obj3.current,
            start: "top 80%",
            end: "top 10%",
            scrub: 2,
          },
        });
      }
    });

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 5,
        mixBlendMode: "difference",
        // Sketch paper grid — fine 40×40 graph paper at very low opacity
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23ffffff' stroke-width='0.35' opacity='0.18'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "40px 40px",
      }}
    >
      {/* ── Moving horizontal rule lines — blueprint paper effect ── */}
      {RULES.map((rule, i) => (
        <div
          key={i}
          ref={(el) => { rulesRef.current[i] = el; }}
          className="absolute left-0 right-0 hidden md:block"
          style={{ top: rule.top }}
        >
          <div
            style={{
              position: "relative",
              height: "1px",
              width: "100%",
              background: rule.dashed
                ? "none"
                : `rgba(255,255,255,${rule.opacity})`,
              borderTop: rule.dashed
                ? `1px dashed rgba(255,255,255,${rule.opacity})`
                : "none",
            }}
          >
            {/* Label on left edge for solid lines */}
            {rule.label && (
              <span
                style={{
                  position: "absolute",
                  left: 8,
                  top: -9,
                  fontSize: 9,
                  fontFamily: "monospace",
                  color: `rgba(255,255,255,${rule.opacity * 1.4})`,
                  letterSpacing: "0.12em",
                  userSelect: "none",
                }}
              >
                {rule.label}
              </span>
            )}
            {/* Tick marks every 80px via repeating linear-gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,${rule.opacity * 0.9}) 0px, rgba(255,255,255,${rule.opacity * 0.9}) 1px, transparent 1px, transparent 80px)`,
                backgroundSize: "80px 6px",
                backgroundRepeat: "repeat-x",
                backgroundPosition: "0 -2px",
                height: 6,
                top: -2,
              }}
            />
          </div>
        </div>
      ))}

      {/* ── SKETCH OBJECT 1: Office Chair — right edge, top ── */}
      <div ref={obj0} className="absolute hidden lg:block" style={{ top: "8vh", right: "-20px", width: 220 }}>
        <svg viewBox="0 0 200 280" width="220" height="308" fill="none">
          <g stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
            <rect x="55" y="20" width="90" height="100" rx="4" />
            <line x1="75" y1="40" x2="125" y2="40" />
            <line x1="75" y1="60" x2="125" y2="60" />
            <line x1="75" y1="80" x2="125" y2="80" />
            <rect x="40" y="130" width="120" height="30" rx="3" />
            <line x1="40" y1="145" x2="10" y2="145" />
            <rect x="2" y="125" width="10" height="25" rx="2" />
            <line x1="160" y1="145" x2="190" y2="145" />
            <rect x="188" y="125" width="10" height="25" rx="2" />
            <line x1="100" y1="160" x2="100" y2="210" />
            <line x1="100" y1="210" x2="60" y2="240" />
            <line x1="100" y1="210" x2="140" y2="240" />
            <line x1="100" y1="210" x2="75" y2="255" />
            <line x1="100" y1="210" x2="125" y2="255" />
            <line x1="100" y1="210" x2="100" y2="260" />
            <circle cx="60" cy="242" r="5" />
            <circle cx="140" cy="242" r="5" />
            <circle cx="75" cy="257" r="5" />
            <circle cx="125" cy="257" r="5" />
            <circle cx="100" cy="262" r="5" />
            <rect x="90" y="158" width="20" height="20" rx="2" />
            <line x1="165" y1="20" x2="175" y2="20" />
            <line x1="165" y1="130" x2="175" y2="130" />
            <line x1="170" y1="20" x2="170" y2="130" strokeDasharray="4 3" />
          </g>
        </svg>
      </div>

      {/* ── SKETCH OBJECT 2: Executive Desk — left edge ── */}
      <div ref={obj1} className="absolute hidden lg:block" style={{ top: "55vh", left: "-30px", width: 280 }}>
        <svg viewBox="0 0 260 160" width="280" height="172" fill="none">
          <g stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
            <rect x="30" y="30" width="200" height="55" rx="2" />
            <rect x="30" y="30" width="200" height="8" rx="2" />
            <rect x="35" y="85" width="16" height="65" rx="1" />
            <rect x="209" y="85" width="16" height="65" rx="1" />
            <line x1="51" y1="118" x2="209" y2="118" />
            <rect x="95" y="10" width="70" height="45" rx="3" />
            <line x1="130" y1="55" x2="130" y2="65" />
            <line x1="115" y1="65" x2="145" y2="65" />
            <path d="M 130 55 Q 140 60 145 65" strokeDasharray="2 2" />
            <rect x="50" y="50" width="30" height="18" rx="1" />
            <line x1="60" y1="59" x2="70" y2="59" />
            <line x1="30" y1="155" x2="230" y2="155" />
            <line x1="30" y1="151" x2="30" y2="159" />
            <line x1="230" y1="151" x2="230" y2="159" />
          </g>
        </svg>
      </div>

      {/* ── SKETCH OBJECT 3: Floor Lamp — right edge, mid ── */}
      <div ref={obj2} className="absolute hidden xl:block" style={{ top: "130vh", right: "10px", width: 120 }}>
        <svg viewBox="0 0 100 320" width="120" height="384" fill="none">
          <g stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.52">
            <path d="M 30,60 L 15,15 L 75,15 L 60,60 Z" />
            <line x1="22" y1="45" x2="68" y2="45" />
            <circle cx="45" cy="30" r="7" strokeDasharray="3 2" />
            <path d="M 45,60 L 45,100 Q 50,130 55,160 L 55,280" />
            <path d="M 45,100 L 15,80" />
            <circle cx="12" cy="79" r="5" />
            <circle cx="45" cy="100" r="5" />
            <circle cx="55" cy="160" r="4" />
            <ellipse cx="55" cy="290" rx="28" ry="8" />
            <line x1="55" y1="298" x2="55" y2="303" />
            <ellipse cx="55" cy="303" rx="18" ry="5" />
            <line x1="80" y1="15" x2="90" y2="15" />
            <line x1="80" y1="280" x2="90" y2="280" />
            <line x1="85" y1="15" x2="85" y2="280" strokeDasharray="5 3" />
          </g>
        </svg>
      </div>

      {/* ── SKETCH OBJECT 4: Drafting Compass — left, counter-drifts up ── */}
      <div ref={obj3} className="absolute hidden xl:block" style={{ top: "200vh", left: "20px", width: 160 }}>
        <svg viewBox="0 0 140 200" width="160" height="229" fill="none">
          <g stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
            <line x1="70" y1="20" x2="30" y2="170" />
            <line x1="70" y1="20" x2="110" y2="170" />
            <circle cx="70" cy="20" r="6" />
            <line x1="30" y1="170" x2="25" y2="190" />
            <circle cx="24" cy="192" r="3" />
            <line x1="110" y1="170" x2="115" y2="185" />
            <rect x="111" y="183" width="7" height="12" rx="1" />
            <rect x="55" y="78" width="30" height="10" rx="2" />
            <line x1="60" y1="83" x2="80" y2="83" />
            <path id="compass-arc" d="M 30 170 Q 70 130 110 170" strokeDasharray="4 3" />
          </g>
          <circle ref={compassDot} r="3" fill="#ffffff" opacity="0.6" cx="30" cy="170" />
        </svg>
      </div>

      {/* ── SKETCH OBJECT 5: Ruler — left, deep ── */}
      <div ref={obj4} className="absolute hidden lg:block" style={{ top: "280vh", left: "-10px", width: 200 }}>
        <svg viewBox="0 0 180 60" width="200" height="67" fill="none">
          <g stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.5">
            <rect x="5" y="15" width="170" height="30" rx="2" />
            {[20, 40, 60, 80, 100, 120, 140, 160].map((x) => (
              <line key={x} x1={x} y1="15" x2={x} y2="30" />
            ))}
            {[30, 50, 70, 90, 110, 130, 150].map((x) => (
              <line key={x} x1={x} y1="15" x2={x} y2="22" strokeWidth="0.8" />
            ))}
            <line x1="5" y1="45" x2="175" y2="45" strokeWidth="0.6" />
            <line x1="5" y1="15" x2="0" y2="30" />
          </g>
        </svg>
      </div>

      {/* ── SKETCH OBJECT 6: Storage Cabinet — right, lower ── */}
      <div ref={obj5} className="absolute hidden lg:block" style={{ top: "340vh", right: "-15px", width: 180 }}>
        <svg viewBox="0 0 150 220" width="180" height="264" fill="none">
          <g stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
            <rect x="15" y="10" width="120" height="200" rx="2" />
            <line x1="15" y1="75" x2="135" y2="75" />
            <line x1="15" y1="140" x2="135" y2="140" />
            <line x1="75" y1="10" x2="75" y2="75" />
            <line x1="75" y1="75" x2="75" y2="140" />
            <line x1="62" y1="42" x2="62" y2="50" />
            <line x1="88" y1="42" x2="88" y2="50" />
            <line x1="62" y1="107" x2="62" y2="115" />
            <line x1="88" y1="107" x2="88" y2="115" />
            <line x1="30" y1="165" x2="120" y2="165" />
            <line x1="30" y1="185" x2="120" y2="185" />
            <line x1="25" y1="210" x2="25" y2="225" />
            <line x1="125" y1="210" x2="125" y2="225" />
            <line x1="144" y1="10" x2="144" y2="210" strokeDasharray="5 3" />
          </g>
        </svg>
      </div>

      {/* ── Corner brackets — draw in on load ── */}
      <div ref={cornerTL} className="absolute hidden md:block" style={{ top: "20vh", left: "12px" }}>
        <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
          <path d="M 0,14 L 0,0 L 14,0" stroke="#ffffff" strokeWidth="1.2" opacity="0.65" strokeLinecap="square" />
        </svg>
      </div>
      <div ref={cornerTR} className="absolute hidden md:block" style={{ top: "20vh", right: "12px" }}>
        <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
          <path d="M 40,14 L 40,0 L 26,0" stroke="#ffffff" strokeWidth="1.2" opacity="0.65" strokeLinecap="square" />
        </svg>
      </div>

      {/* ── Crosshairs at strategic intervals ── */}
      {[
        { top: "45vh", left: "5%" },
        { top: "95vh", right: "4%" },
        { top: "165vh", left: "3%" },
        { top: "240vh", right: "6%" },
        { top: "310vh", left: "7%" },
      ].map((pos, i) => (
        <div
          key={i}
          ref={(el) => { crosshairs.current[i] = el; }}
          className="absolute hidden md:block"
          style={{ ...pos, width: 24, height: 24 }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <g stroke="#ffffff" strokeWidth="0.9" opacity="0.6" strokeLinecap="round">
              <line x1="12" y1="0" x2="12" y2="10" />
              <line x1="12" y1="14" x2="12" y2="24" />
              <line x1="0" y1="12" x2="10" y2="12" />
              <line x1="14" y1="12" x2="24" y2="12" />
              <circle cx="12" cy="12" r="3" />
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
}
