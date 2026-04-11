"use client";

import { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, useScroll, useTransform } from "framer-motion";

export interface HeroSlide {
  id: number;
  image: string;
  mobileImage?: string;
  alt: string;
  headline: string;
  subheadline?: string;
  description?: string;
  cta: string;
  href: string;
}

interface HeroCinematicProps {
  slides: HeroSlide[];
}

/**
 * Cinematic scroll-pinned hero.
 *
 * Desktop: The hero section pins while scrolling. Vertical scroll drives
 * horizontal movement through all slides. After the last slide, the
 * section unpins and normal scroll resumes.
 *
 * Mobile: Vertical snap-scroll sections — one per slide.
 *
 * Reduced motion: Falls back to stacked layout, no pinning.
 */
export function HeroCinematic({ slides }: HeroCinematicProps) {
  if (!slides.length) return null;

  return (
    <>
      {/* Desktop: pinned horizontal scroll */}
      <div className="hidden md:block">
        <DesktopHero slides={slides} />
      </div>

      {/* Mobile: vertical snap sections */}
      <div className="md:hidden">
        <MobileHero slides={slides} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  DESKTOP — Pinned horizontal scroll                                */
/* ------------------------------------------------------------------ */

function DesktopHero({ slides }: { slides: HeroSlide[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress [0, 1] → translateX [0%, -(n-1)*100%]
  const slideCount = slides.length;
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${-(slideCount - 1) * 100}%`]
  );

  return (
    // Outer container: tall enough to scroll through all slides
    // Each slide gets 100vh of scroll distance
    <div
      ref={containerRef}
      style={{ height: `${slideCount * 100}vh` }}
    >
      {/* Sticky viewport — pins the visible area */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Horizontal track — moves left as user scrolls */}
        <motion.div
          className="flex h-full"
          style={{ x, width: `${slideCount * 100}%` }}
        >
          {slides.map((slide, i) => (
            <DesktopSlide
              key={slide.id}
              slide={slide}
              index={i}
              total={slideCount}
              scrollProgress={scrollYProgress}
            />
          ))}
        </motion.div>

        {/* Progress dots — fixed at bottom center */}
        <ProgressDots
          count={slideCount}
          scrollProgress={scrollYProgress}
        />
      </div>
    </div>
  );
}

function DesktopSlide({
  slide,
  index,
  total,
  scrollProgress,
}: {
  slide: HeroSlide;
  index: number;
  total: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each slide occupies 1/total of the scroll range
  const slideStart = index / total;
  const slideEnd = (index + 1) / total;
  const slideMid = (slideStart + slideEnd) / 2;

  // Text fades in during first half of slide's range, stays visible
  const textOpacity = useTransform(
    scrollProgress,
    [slideStart, slideStart + (slideEnd - slideStart) * 0.3, slideMid, slideEnd - (slideEnd - slideStart) * 0.1, slideEnd],
    [0, 1, 1, 1, index < total - 1 ? 0 : 1]
  );

  const textY = useTransform(
    scrollProgress,
    [slideStart, slideStart + (slideEnd - slideStart) * 0.3],
    [30, 0]
  );

  return (
    <div
      className="relative flex-shrink-0 h-full overflow-hidden"
      style={{ width: `${100 / total}%` }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          className="object-cover"
          priority={index === 0}
          sizes="100vw"
        />
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Text overlay */}
      <motion.div
        className="absolute bottom-24 start-16 lg:start-24 max-w-xl z-10"
        style={{ opacity: textOpacity, y: textY }}
      >
        {slide.subheadline && (
          <p className="text-sm md:text-base font-medium text-white/65 tracking-widest mb-3">
            {slide.subheadline}
          </p>
        )}
        <h2 className="text-4xl font-bold text-white leading-[1.1]">
          {slide.headline}
        </h2>
        {slide.description && (
          <p className="text-base lg:text-lg text-white/85 mt-3 leading-relaxed max-w-md">
            {slide.description}
          </p>
        )}
        <Link
          href={slide.href}
          className="inline-flex items-center gap-2 mt-6 px-8 py-3.5 border-2 border-white
            bg-white/10 text-white font-medium tracking-wider text-sm
            rounded-none transition-all duration-300
            hover:bg-white hover:text-[#2C2C2C]
            focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <span className="w-1.5 h-1.5 bg-white" />
          {slide.cta}
        </Link>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PROGRESS DOTS                                                     */
/* ------------------------------------------------------------------ */

function ProgressDots({
  count,
  scrollProgress,
}: {
  count: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  return (
    <div className="absolute bottom-8 inset-x-0 z-20 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <DotIndicator
          key={i}
          index={i}
          total={count}
          scrollProgress={scrollProgress}
        />
      ))}
    </div>
  );
}

function DotIndicator({
  index,
  total,
  scrollProgress,
}: {
  index: number;
  total: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Determine if this dot is "active" based on scroll progress
  const isActive = useTransform(
    scrollProgress,
    (v: number) => {
      const slideIndex = Math.round(v * (total - 1));
      return slideIndex === index;
    }
  );

  const width = useTransform(isActive, (active: boolean) => active ? 32 : 10);
  const opacity = useTransform(isActive, (active: boolean) => active ? 1 : 0.5);

  return (
    <motion.div
      className="h-2.5 rounded-none bg-white transition-all duration-300"
      style={{ width, opacity }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  MOBILE — Vertical snap scroll                                     */
/* ------------------------------------------------------------------ */

function MobileHero({ slides }: { slides: HeroSlide[] }) {
  return (
    <div
      className="snap-y snap-mandatory overflow-y-auto motion-reduce:snap-none motion-reduce:overflow-y-visible motion-reduce:!h-auto"
      style={{ height: `${slides.length * 100}vh` }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="snap-start relative h-screen w-full overflow-hidden motion-reduce:h-auto motion-reduce:min-h-[50vh]"
        >
          <Image
            src={slide.mobileImage || slide.image}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Content */}
          <div className="absolute bottom-20 start-6 end-6 z-10">
            <h2 className="text-3xl font-bold text-white leading-tight">
              {slide.headline}
            </h2>
            {slide.description && (
              <p className="text-sm text-white/85 mt-2">
                {slide.description}
              </p>
            )}
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 border-2 border-white
                bg-white/10 text-white font-medium tracking-wider text-sm
                rounded-none transition-all duration-300
                hover:bg-white hover:text-[#2C2C2C]"
            >
              <span className="w-1.5 h-1.5 bg-white" />
              {slide.cta}
            </Link>
          </div>

          {/* Slide counter */}
          <div className="absolute bottom-6 end-6 text-white/60 text-sm font-medium z-10">
            {i + 1} / {slides.length}
          </div>
        </div>
      ))}
    </div>
  );
}
