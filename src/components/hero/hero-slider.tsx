"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: number;
  image: string;
  mobileImage?: string;
  alt: string;
  headline: string;
  description?: string;
  cta: string;
  href: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  autoPlay?: boolean;
  interval?: number;
}

export function HeroSlider({
  slides,
  autoPlay = true,
  interval = 6000,
}: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, next, slides.length]);

  if (!slides.length) return null;

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {/* Slides */}
      <div className="relative aspect-[750/500] md:aspect-[1920/700]">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={i !== current}
          >
            {/* Desktop image */}
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover hidden md:block"
              priority={i === 0}
              sizes="100vw"
            />
            {/* Mobile image */}
            <Image
              src={slide.mobileImage || slide.image}
              alt={slide.alt}
              fill
              className="object-cover md:hidden"
              priority={i === 0}
              sizes="100vw"
            />

            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-600/50 via-transparent to-transparent" />

            {/* Text overlay — bottom-start */}
            <div className="absolute bottom-8 start-8 md:bottom-16 md:start-16 max-w-lg z-20">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                {slide.headline}
              </h2>
              {slide.description && (
                <p className="text-base md:text-lg text-white/90 mt-2 md:mt-3 drop-shadow">
                  {slide.description}
                </p>
              )}
              <Link
                href={slide.href}
                className="inline-block mt-4 md:mt-6 px-8 py-3 bg-gold text-gray-900
                  font-medium rounded-md transition-all duration-200
                  hover:opacity-90 hover:-translate-y-0.5
                  focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 z-30 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                i === current
                  ? "bg-gold w-8"
                  : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
