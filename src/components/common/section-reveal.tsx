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

    const isHorizontal = direction === "left" || direction === "right";

    if (isHorizontal) {
      // Slide from true page edge — scrub-tied so it tracks mouse scroll position
      gsap.from(ref.current, {
        x: () => direction === "left" ? -window.innerWidth * 1.05 : window.innerWidth * 1.05,
        opacity: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "top 25%",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
    } else {
      // Vertical / fade-scale — scroll-synced
      gsap.from(ref.current, {
        opacity: 0,
        y: direction === "up" ? 130 : 0,
        scale: direction === "fade-scale" ? 0.96 : 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "top 42%",
          scrub: 1.2,
        },
      });
    }
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
