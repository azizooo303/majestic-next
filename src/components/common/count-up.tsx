"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
  value: string;       // e.g. "320", "18", "100%"
  duration?: number;   // ms, default 1500
  className?: string;
}

export function CountUp({ value, duration = 1500, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  // Parse numeric prefix and any suffix (%, +, etc.)
  const numeric = parseInt(value, 10);
  const suffix = isNaN(numeric) ? value : value.replace(String(numeric), "");
  const isNumeric = !isNaN(numeric);

  const [display, setDisplay] = useState(isNumeric ? "0" : value);

  useEffect(() => {
    if (!isInView || reduced || !isNumeric) {
      setDisplay(value);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * numeric);
      setDisplay(String(current) + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, reduced, isNumeric, numeric, suffix, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
