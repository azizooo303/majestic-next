"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { BlueprintOverlay } from "@/components/hero/blueprint-overlay";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(DrawSVGPlugin, SplitText);

export interface HeroSlide {
  image: string;
  mobileImage?: string;
  alt: string;
  headline: string;
  tagline?: string;
  collection?: string;
  cta: string;
  href: string;
  locale?: string;
  objectPosition?: string;
}

interface HeroBannerProps {
  slides?: HeroSlide[];
  /** Legacy single-slide prop */
  slide?: HeroSlide;
}

const AUTO_ADVANCE_MS = 5000;

export function HeroBanner({ slides, slide }: HeroBannerProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const reduced = useReducedMotion();

  const allSlides: HeroSlide[] = slides ?? (slide ? [slide] : []);
  const total = allSlides.length;

  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bracketTL = useRef<SVGPathElement>(null);
  const bracketTR = useRef<SVGPathElement>(null);
  const dimLine = useRef<SVGPathElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // DrawSVG bracket animation on mount
  useEffect(() => {
    if (reduced) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    if (bracketTL.current) { gsap.set(bracketTL.current, { drawSVG: "0%" }); gsap.to(bracketTL.current, { drawSVG: "100%", duration: 1.0, ease: "power2.out", delay: 0.6 }); }
    if (bracketTR.current) { gsap.set(bracketTR.current, { drawSVG: "0%" }); gsap.to(bracketTR.current, { drawSVG: "100%", duration: 1.0, ease: "power2.out", delay: 0.8 }); }
    if (dimLine.current)   { gsap.set(dimLine.current,   { drawSVG: "0%" }); gsap.to(dimLine.current,   { drawSVG: "100%", duration: 1.8, ease: "power1.out", delay: 1.2 }); }
  }, [reduced]);

  // SplitText headline reveal on each slide change
  useEffect(() => {
    if (reduced || !headlineRef.current) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const split = new SplitText(headlineRef.current, { type: "words,chars" });
    const tl = gsap.timeline({ delay: 0.35 });
    tl.from(split.chars, {
      opacity: 0,
      y: 18,
      stagger: 0.025,
      duration: 0.45,
      ease: "power3.out",
      onComplete: () => split.revert(),
    });
    return () => { tl.kill(); split.revert(); };
  }, [activeIdx, reduced]);

  const advance = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % total);
  }, [total]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!paused && total > 1 && !reduced) {
      intervalRef.current = setInterval(advance, AUTO_ADVANCE_MS);
    }
  }, [paused, total, reduced, advance]);

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTimer]);

  const goTo = (idx: number) => {
    setActiveIdx(idx);
    // Reset timer on manual navigation
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!paused && total > 1 && !reduced) {
      intervalRef.current = setInterval(advance, AUTO_ADVANCE_MS);
    }
  };

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo((activeIdx + 1) % total);
      if (e.key === "ArrowLeft") goTo((activeIdx - 1 + total) % total);
    },
    [activeIdx, total] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (allSlides.length === 0) return null;

  const currentSlide = allSlides[activeIdx];

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-white",
        "min-h-[100svh] md:min-h-[90vh]"
      )}
      style={{ minHeight: "640px" }}
      aria-label="Featured collections"
      aria-live="polite"
      role="region"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* ── Slide images — stacked, crossfade via opacity ── */}
      {allSlides.map((s, i) => (
        <div
          key={s.image}
          className="absolute inset-0 z-0"
          aria-hidden={i !== activeIdx}
        >
          {/* Desktop image */}
          <Image
            src={s.image}
            alt={s.alt}
            fill
            priority={i === 0}
            className={cn(
              "object-cover hidden md:block",
              "transition-opacity duration-[800ms] ease-in-out",
              i === activeIdx ? "opacity-100" : "opacity-0"
            )}
            style={{ objectPosition: s.objectPosition ?? "center center" }}
            sizes="100vw"
            data-hero-image
          />
          {/* Mobile image */}
          <Image
            src={s.mobileImage ?? s.image}
            alt={s.alt}
            fill
            priority={i === 0}
            className={cn(
              "object-cover object-top md:hidden",
              "transition-opacity duration-[800ms] ease-in-out",
              i === activeIdx ? "opacity-100" : "opacity-0"
            )}
            sizes="100vw"
            data-hero-image
          />
        </div>
      ))}

      {/* ── Blueprint overlay — fades in on each slide ── */}
      <BlueprintOverlay slideKey={activeIdx} />

      {/* ── Legibility gradient — bottom-third only ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.30) 35%, rgba(0,0,0,0) 60%)",
        }}
      />

      {/* ── Blueprint watermark — corner ── */}
      <div className="absolute top-0 end-0 z-10 pointer-events-none w-[180px] h-[180px] md:w-[320px] md:h-[320px]">
        <Image
          src="/images/blueprint-pattern.png"
          alt=""
          fill
          className="object-cover object-right-top"
          style={{ opacity: 0.04, mixBlendMode: "screen" }}
          aria-hidden="true"
        />
      </div>

      {/* ── Architectural corner brackets ── */}
      {!reduced && (
        <>
          {/* Top-left bracket — GSAP DrawSVG */}
          <svg className="absolute top-8 start-8 z-10 pointer-events-none hidden md:block" width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
            <path ref={bracketTL} d="M 0,40 L 0,0 L 40,0" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" strokeLinecap="square" />
          </svg>
          {/* Top-right bracket — GSAP DrawSVG */}
          <svg className="absolute top-8 end-8 z-10 pointer-events-none hidden md:block" width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
            <path ref={bracketTR} d="M 60,40 L 60,0 L 20,0" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" strokeLinecap="square" />
          </svg>
          {/* Bottom dimension line — GSAP DrawSVG */}
          <svg className="absolute bottom-16 inset-x-0 z-10 pointer-events-none hidden md:block w-full" height="8" viewBox="0 0 1000 8" preserveAspectRatio="none" aria-hidden="true">
            <path ref={dimLine} d="M 80,4 L 920,4" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" fill="none" strokeDasharray="3 8" />
          </svg>
        </>
      )}

      {/* ── Text content — slides in per slide ── */}
      <div className="absolute bottom-0 start-0 end-0 z-20 ps-4 pe-4 pb-16 sm:ps-6 sm:pb-16 md:ps-10 md:pe-10 md:pb-16 lg:ps-16 lg:pb-20">
        <div style={{ maxWidth: "540px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${activeIdx}`}
              initial={reduced ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? {} : { opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              {/* Collection label */}
              {currentSlide.collection && (
                <p
                  className={cn(
                    "font-semibold mb-3",
                    isAr
                      ? "font-alyamama text-[12px] tracking-normal"
                      : "text-[11px] uppercase tracking-[0.14em]"
                  )}
                  style={{ color: "#C1B167" }}
                  data-hero-label
                >
                  {currentSlide.collection}
                </p>
              )}

              {/* Headline */}
              <h1
                className={cn(
                  "font-extrabold text-white mb-3 whitespace-pre-line",
                  isAr
                    ? "font-alyamama font-bold leading-[1.1em] tracking-normal text-[33px] sm:text-[42px] md:text-[48px] lg:text-[57px]"
                    : "leading-[0.95em] tracking-[-0.04em] text-[30px] sm:text-[38px] md:text-[44px] lg:text-[52px]"
                )}
                data-hero-headline
                ref={headlineRef}
              >
                {currentSlide.headline}
              </h1>

              {/* Tagline */}
              {currentSlide.tagline && (
                <p
                  className={cn(
                    "font-normal leading-[1.55] mb-6",
                    isAr
                      ? "font-alyamama text-[16px] sm:text-[17px] tracking-normal"
                      : "text-[14px] sm:text-[15px] tracking-normal max-w-[400px]"
                  )}
                  style={{ color: "rgba(255,255,255,0.82)" }}
                  data-hero-tagline
                >
                  {currentSlide.tagline}
                </p>
              )}

              {/* CTA */}
              <Link
                href={currentSlide.href}
                className={cn(
                  "group inline-flex items-center gap-2",
                  "border-2 text-white",
                  "px-6 py-3 min-h-[48px]",
                  "rounded-none",
                  "font-semibold text-sm tracking-tight",
                  "bg-transparent",
                  "transition-all duration-200",
                  "hover:bg-white/[0.12]",
                  "active:scale-[0.98] active:bg-white/[0.20]",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C1B167]",
                  "w-full max-w-[280px] justify-center sm:w-auto sm:max-w-none sm:justify-start"
                )}
                style={{ borderColor: "rgba(255,255,255,0.85)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.85)")}
                data-hero-cta
              >
                {currentSlide.cta}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className={cn(
                    "transition-transform duration-200",
                    isAr
                      ? "rotate-180 group-hover:-translate-x-1"
                      : "group-hover:translate-x-1"
                  )}
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Slide indicators — numbered architectural lines ── */}
      {total > 1 && (
        <div
          className="absolute bottom-5 md:bottom-10 start-1/2 -translate-x-1/2 z-30 flex gap-4 items-end"
          role="tablist"
          aria-label={isAr ? "شرائح البانر" : "Hero slides"}
        >
          {allSlides.map((s, i) => (
            <button
              key={s.image}
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={isAr ? `الشريحة ${i + 1}` : `Go to slide ${String(i + 1).padStart(2, "0")}: ${s.alt}`}
              onClick={() => goTo(i)}
              className="flex flex-col items-center gap-1.5 p-3 -m-3 cursor-pointer"
            >
              {/* Progress line */}
              <div
                className="relative h-[2px] overflow-hidden transition-all duration-300 ease-out"
                style={{
                  width: i === activeIdx ? "48px" : "24px",
                  backgroundColor:
                    i === activeIdx ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.4)",
                }}
                data-indicator-progress={i === activeIdx ? "true" : undefined}
              >
                {/* Active fill animation */}
                {i === activeIdx && (
                  <div
                    className="absolute inset-y-0 start-0 bg-white"
                    style={{
                      animation: reduced
                        ? undefined
                        : `indicator-fill ${AUTO_ADVANCE_MS}ms linear forwards`,
                      width: reduced ? "100%" : undefined,
                    }}
                  />
                )}
                {/* Inactive line — static white */}
                {i !== activeIdx && (
                  <div className="absolute inset-0 bg-white/40" />
                )}
              </div>
              {/* Number — hidden on mobile */}
              <span
                className={cn(
                  "font-semibold text-[10px] tracking-[0.10em] hidden sm:block transition-colors duration-200",
                  i === activeIdx ? "text-white/90" : "text-white/50"
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
