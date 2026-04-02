"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface FadeDownProps {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  delay?: number;
}

export function FadeDown({ children, className, yOffset = 24, delay = 0 }: FadeDownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (!ref.current || reduced) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const el = ref.current;

    // Headings get SplitText word-by-word reveal
    const headings = el.querySelectorAll<HTMLElement>("h1, h2, h3");
    if (headings.length > 0) {
      headings.forEach((heading) => {
        const split = new SplitText(heading, { type: "words" });
        gsap.from(split.words, {
          opacity: 0,
          y: -yOffset,
          stagger: 0.06,
          duration: 0.55,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 88%",
            toggleActions: "play none play reverse",
          },
          onComplete: () => split.revert(),
        });
      });
    } else {
      // Non-heading content: simple fade from above
      gsap.from(el, {
        opacity: 0,
        y: -yOffset,
        duration: 0.55,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none play reverse",
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
