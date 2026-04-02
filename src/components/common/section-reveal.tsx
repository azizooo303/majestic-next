"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type Direction = "left" | "right" | "up" | "fade-scale";

interface SectionRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  distance?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export function SectionReveal({
  children,
  direction = "up",
  distance = 50,
  duration = 0.7,
  delay = 0,
  className,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (!ref.current || reduced) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      x: direction === "left" ? -distance : direction === "right" ? distance : 0,
      y: direction === "up" ? distance * 0.6 : 0,
      scale: direction === "fade-scale" ? 0.97 : 1,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 88%",
        // play on enter ↓, stay visible scrolling past ↓, re-play on scroll up ↑, hide when fully above ↑
        toggleActions: "play none play reverse",
      },
    };

    gsap.from(ref.current, fromVars);
  }, { scope: ref });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
