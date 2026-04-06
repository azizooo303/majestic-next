"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

interface GsapBatchRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Max items to animate per batch (default 4) */
  batchMax?: number;
  /** Stagger between items in a batch (default 0.08s) */
  stagger?: number;
  /** Initial y offset (default 32px) */
  yOffset?: number;
  /** Animate only once on first enter (default true) */
  once?: boolean;
}

/**
 * Replaces StaggerChildren for grid layouts.
 * Uses ScrollTrigger.batch() — more performant than per-item Framer Motion variants.
 * Children are queried as direct DOM children; no extra wrapper divs added.
 */
export function GsapBatchReveal({
  children,
  className,
  batchMax = 4,
  stagger = 0.08,
  yOffset = 32,
  once = true,
}: GsapBatchRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!containerRef.current || reduced) return;
      if (window.innerWidth < 768) return;

      const items = Array.from(containerRef.current.children) as HTMLElement[];
      if (items.length === 0) return;

      // Set hidden state before first render paint
      gsap.set(items, { opacity: 0, y: yOffset });

      const batches = ScrollTrigger.batch(items, {
        interval: 0.1,
        batchMax,
        start: "top 88%",
        once,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger,
            ease: "power3.out",
            overwrite: true,
          });
        },
        ...(once
          ? {}
          : {
              onLeaveBack: (batch) => {
                gsap.set(batch, { opacity: 0, y: yOffset, overwrite: true });
              },
            }),
      });

      return () => {
        batches.forEach((t) => t.kill());
        gsap.set(items, { clearProps: "all" });
      };
    },
    { scope: containerRef, dependencies: [reduced, batchMax, stagger, yOffset, once] }
  );

  // Reduced motion: render children as-is, no animation wrappers
  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
