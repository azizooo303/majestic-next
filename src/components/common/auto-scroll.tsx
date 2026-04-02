"use client";
import { useReducedMotion } from "framer-motion";

interface AutoScrollProps {
  children: React.ReactNode;
  duration?: number;  // seconds for one full loop, default 60
  gap?: string;       // CSS gap between items, default "8px"
  className?: string;
  isRTL?: boolean;    // flip scroll direction for Arabic
}

export function AutoScroll({
  children,
  duration = 60,
  gap = "8px",
  className,
  isRTL = false,
}: AutoScrollProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div
        className={className}
        style={{ display: "flex", gap, overflowX: "auto" }}
      >
        {children}
      </div>
    );
  }

  const animationName = isRTL ? "majestic-autoscroll-rtl" : "majestic-autoscroll";

  return (
    <div
      className={className}
      style={{ overflow: "hidden", position: "relative" }}
    >
      <div
        style={{
          display: "flex",
          gap,
          width: "max-content",
          animation: `${animationName} ${duration}s linear infinite`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "running";
        }}
      >
        {children}
        {/* Duplicate for seamless loop */}
        {children}
      </div>
    </div>
  );
}
