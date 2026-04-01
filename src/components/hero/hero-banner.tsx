"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
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

export function HeroBanner({ slide }: { slide: HeroSlide }) {
  const locale = useLocale();
  const isAr = locale === "ar";

  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // Mobile parallax guard — no parallax on touch devices
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  }, []);

  // Scroll parallax — image only
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // GSAP intro timeline — dynamically imported so GSAP (~60KB) is not in the critical bundle
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // RTL detection from DOM — authoritative source
    const isRTL = document.documentElement.dir === "rtl";

    let killed = false;
    let tl: { kill: () => void } | null = null;

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

      // Image subtle Ken Burns
      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { scale: 1.04 },
          { scale: 1.0, duration: 0.8, ease: "power2.out" },
          0
        );
      }

      // Collection label
      if (collectionRef.current) {
        tl.fromTo(
          collectionRef.current,
          { y: 8, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
          0.2
        );
      }

      // Headline text wipe — direction depends on locale
      if (headlineRef.current) {
        const clipFrom = isRTL ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
        const clipTo = isRTL ? "inset(0 0 0 0%)" : "inset(0 0% 0 0)";
        tl.fromTo(
          headlineRef.current,
          { clipPath: clipFrom, opacity: 1 },
          { clipPath: clipTo, duration: 0.55, ease: "power2.out" },
          0.35
        );
      }

      // Tagline
      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.6
        );
      }

      // CTA — starts at 0.95 so it only begins after headline wipe completes
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" },
          0.95
        );
      }
    });

    return () => {
      killed = true;
      tl?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden flex items-center"
      style={{ minHeight: "600px", background: "#f2f2f2" }}
    >
      {/* Product image — right 55% */}
      <motion.div
        className="absolute inset-y-0 end-0 w-full md:w-[55%]"
        style={{ y: isMobile ? 0 : imageY, willChange: "transform" }}
      >
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
          />
        </div>
        {/* Gradient fade from left — blends image into bg on desktop */}
        <div
          className={`absolute inset-y-0 start-0 w-1/3 ${isAr ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-[#f2f2f2] to-transparent hidden md:block`}
        />
      </motion.div>

      {/* On mobile: overlay so text stays readable */}
      <div className="absolute inset-0 bg-[#f2f2f2]/70 md:hidden" />

      {/* Text — left side (no parallax) */}
      <div className="relative z-10 w-full md:w-[45%] px-8 lg:px-16 xl:px-24 py-16">
        {slide.collection && (
          <p
            ref={collectionRef}
            className="text-xs uppercase tracking-widest text-[#484848] mb-3 font-medium"
          >
            {slide.collection}
          </p>
        )}
        <h1
          ref={headlineRef}
          className="text-[38px] lg:text-[52px] xl:text-[60px] font-bold text-[#0c0c0c] leading-[1.0] tracking-tight whitespace-pre-line"
        >
          {slide.headline}
        </h1>
        {slide.tagline && (
          <p
            ref={taglineRef}
            className="mt-4 text-[#484848] text-base max-w-sm leading-relaxed"
          >
            {slide.tagline}
          </p>
        )}
        <Link
          ref={ctaRef}
          href={slide.href}
          className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-[#0c0c0c] hover:text-[#484848] transition-colors group"
        >
          {slide.cta}
          <span className="text-base transition-transform duration-200 ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
            ›
          </span>
        </Link>
      </div>
    </section>
  );
}
