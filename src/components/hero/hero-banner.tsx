"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";

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
}

interface HeroBannerProps {
  /** Pass multiple slides for a carousel, or a single slide for static hero */
  slides?: HeroSlide[];
  /** Legacy single-slide prop — wrapped into a 1-item array internally */
  slide?: HeroSlide;
}

export function HeroBanner({ slides, slide }: HeroBannerProps) {
  const locale = useLocale();
  const isAr = locale === "ar";

  // Normalise: prefer slides array, fall back to wrapping single slide
  const allSlides: HeroSlide[] = slides ?? (slide ? [slide] : []);
  const total = allSlides.length;

  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mobile touch guard — no parallax on touch devices
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  }, []);

  // Auto-advance
  const advance = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || paused) return;
    intervalRef.current = setInterval(advance, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [total, paused, advance]);

  const goTo = (idx: number) => {
    setActiveIdx(idx);
    // Reset timer on manual navigation
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!paused && total > 1) {
      intervalRef.current = setInterval(advance, 5000);
    }
  };

  // Scroll parallax — image panel only
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  // GSAP refs — only used for the initial page load animation on slide 0
  const imageRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // GSAP intro — fires once on mount for the initial slide
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isRTL = document.documentElement.dir === "rtl";

    let killed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tl: any = null;

    import("gsap").then(({ gsap }) => {
      if (killed) return;

      if (prefersReduced) {
        gsap.set(
          [collectionRef.current, headlineRef.current, taglineRef.current, ctaRef.current],
          { opacity: 1, clearProps: "all" }
        );
        if (imageRef.current) gsap.set(imageRef.current, { scale: 1 });
        return;
      }

      tl = gsap.timeline();

      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { scale: 1.04 },
          { scale: 1.0, duration: 1.2, ease: "power2.out" },
          0
        );
      }

      if (gradientRef.current) {
        tl.fromTo(
          gradientRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" },
          0
        );
      }

      if (collectionRef.current) {
        tl.fromTo(
          collectionRef.current,
          { y: 8, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
          0.1
        );
      }

      if (headlineRef.current) {
        const clipFrom = isRTL ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
        const clipTo   = isRTL ? "inset(0 0 0 0%)"   : "inset(0 0% 0 0)";
        tl.fromTo(
          headlineRef.current,
          { clipPath: clipFrom, opacity: 1 },
          { clipPath: clipTo, duration: 0.45, ease: "power3.out" },
          0.25
        );
      }

      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.45
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" },
          0.65
        );
      }
    });

    return () => {
      killed = true;
      tl?.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (allSlides.length === 0) return null;

  const currentSlide = allSlides[activeIdx];

  const trustStats = [
    { value: "500+",                          label: isAr ? "شركة وجهة حكومية"   : "Corporate clients"    },
    { value: isAr ? "الرياض وخارجها" : "KSA-wide", label: isAr ? "توريد في كل مكان" : "delivery & install"  },
    { value: "15+",                           label: isAr ? "سنة في السوق"        : "years in market"      },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden flex flex-col md:flex-row md:items-center min-h-[85vh]"
      style={{ minHeight: "715px", background: "#F8F8F6" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── MOBILE: stacked image ── */}
      <div
        className="relative w-full md:hidden"
        style={{ minHeight: "200px", maxHeight: "320px", height: "52vw" }}
      >
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={`mobile-img-${activeIdx}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          >
            <Image
              src={currentSlide.mobileImage ?? currentSlide.image}
              alt={currentSlide.alt}
              fill
              className="object-cover object-center"
              priority={activeIdx === 0}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── MOBILE: text block ── */}
      <div className="bg-[#F8F8F6] px-6 py-8 md:hidden w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`mobile-text-${activeIdx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {currentSlide.collection && (
              <p className="text-xs uppercase tracking-widest text-[#C1B167] mb-3 font-medium">
                {currentSlide.collection}
              </p>
            )}
            <h1
              className={
                "text-[32px] font-bold text-[#2C2C2C] leading-[1.0] tracking-tight whitespace-pre-line" +
                (isAr ? " font-alyamama" : "")
              }
            >
              {currentSlide.headline}
            </h1>
            {currentSlide.tagline && (
              <p className="mt-4 text-[#2C2C2C]/70 text-base max-w-sm leading-relaxed">
                {currentSlide.tagline}
              </p>
            )}
            <Link
              href={currentSlide.href}
              className="mt-8 w-fit self-start inline-flex items-center gap-3 bg-[#2C2C2C] text-white text-sm font-semibold px-6 py-3 min-h-[48px] rounded-none tracking-wide hover:bg-[#444] active:bg-[#1a1a1a] transition-colors group"
            >
              {currentSlide.cta}
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                className="transition-transform duration-150 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180"
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Trust strip */}
        <div className="mt-10 flex items-center gap-6 flex-wrap">
          {trustStats.map((stat) => (
            <div key={stat.value} className="flex flex-col">
              <span className="text-sm font-bold text-[#2C2C2C] tracking-tight">{stat.value}</span>
              <span className="text-[11px] text-[#2C2C2C]/50 uppercase tracking-wider mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── DESKTOP: image panel — right 58% ── */}
      <motion.div
        className="hidden md:block absolute inset-y-0 end-0 w-[58%]"
        style={{ y: isMobile ? 0 : imageY, willChange: "transform" }}
      >
        {/* Crossfade between slides */}
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={`desktop-img-${activeIdx}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
          >
            <div ref={activeIdx === 0 ? imageRef : undefined} className="absolute inset-0 will-change-transform">
              <Image
                src={currentSlide.image}
                alt={currentSlide.alt}
                fill
                className="object-cover object-center"
                priority={activeIdx === 0}
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Soft vignette — 3-stop gradient, much gentler than a sharp seam */}
        <div
          ref={gradientRef}
          className={`absolute inset-y-0 start-0 w-2/5 pointer-events-none ${
            isAr
              ? "bg-gradient-to-l from-[#F8F8F6]/60 via-[#F8F8F6]/10 to-transparent"
              : "bg-gradient-to-r from-[#F8F8F6]/60 via-[#F8F8F6]/10 to-transparent"
          }`}
        />
      </motion.div>

      {/* ── DESKTOP: text panel — left 42% ── */}
      <div className="hidden md:flex flex-col relative z-10 w-[42%] pl-16 lg:pl-24 xl:pl-32 pr-8 py-20">
        {/* Inner wrapper constrains text width */}
        <div className="max-w-[520px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`desktop-text-${activeIdx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {currentSlide.collection && (
                <p
                  ref={activeIdx === 0 ? collectionRef : undefined}
                  className="text-xs uppercase tracking-widest text-[#C1B167] mb-3 font-medium"
                >
                  {currentSlide.collection}
                </p>
              )}
              <h1
                ref={activeIdx === 0 ? headlineRef : undefined}
                className={
                  "text-[38px] lg:text-[52px] xl:text-[60px] font-bold text-[#2C2C2C] leading-[1.0] tracking-tight whitespace-pre-line" +
                  (isAr ? " font-alyamama" : "")
                }
              >
                {currentSlide.headline}
              </h1>
              {currentSlide.tagline && (
                <p
                  ref={activeIdx === 0 ? taglineRef : undefined}
                  className="mt-4 text-[#2C2C2C]/70 text-base leading-relaxed"
                >
                  {currentSlide.tagline}
                </p>
              )}
              <Link
                ref={activeIdx === 0 ? ctaRef : undefined}
                href={currentSlide.href}
                className="mt-8 w-fit self-start inline-flex items-center gap-3 bg-[#2C2C2C] text-white text-sm font-semibold px-6 py-3 min-h-[48px] rounded-none tracking-wide hover:bg-[#444] active:bg-[#1a1a1a] transition-colors group"
              >
                {currentSlide.cta}
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                  className="transition-transform duration-150 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Trust strip */}
          <div className="mt-10 flex items-center gap-6 flex-wrap">
            {trustStats.map((stat) => (
              <div key={stat.value} className="flex flex-col">
                <span className="text-sm font-bold text-[#2C2C2C] tracking-tight">{stat.value}</span>
                <span className="text-[11px] text-[#2C2C2C]/50 uppercase tracking-wider mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Dot indicators — shown when more than 1 slide ── */}
      {total > 1 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2"
          role="tablist"
          aria-label={isAr ? "شرائح البانر" : "Hero slides"}
        >
          {allSlides.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={idx === activeIdx}
              aria-label={isAr ? `الشريحة ${idx + 1}` : `Slide ${idx + 1}`}
              onClick={() => goTo(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C1B167] ${
                idx === activeIdx
                  ? "bg-[#2C2C2C] w-4"
                  : "bg-[#2C2C2C]/30 w-1.5"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
