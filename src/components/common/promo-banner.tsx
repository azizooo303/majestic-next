"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

interface PromoBannerProps {
  isAr: boolean;
  headline: string;
  body: string;
  cta: string;
  ctaHref: string;
}

export function PromoBanner({ isAr, headline, body, cta, ctaHref }: PromoBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Text panel — slides in from left (LTR) / right (RTL)
  const textX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1],
    [isAr ? 120 : -120, 0, 0, isAr ? 60 : -60]
  );

  // Image panel — slides in from right (LTR) / left (RTL)
  const imageX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1],
    [isAr ? -120 : 120, 0, 0, isAr ? 60 : -60]
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#fafafa] border-t border-b border-[rgba(0,0,0,0.12)] overflow-hidden"
    >
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* Text side */}
          <motion.div
            style={reducedMotion ? {} : { x: textX }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900] leading-tight tracking-tight">
              {headline}
            </h2>
            <p className="text-[#484848] mt-4 text-base leading-relaxed max-w-md">
              {body}
            </p>
            <Link
              href={ctaHref}
              className="inline-block mt-6 border-2 border-[#0c0c0c] text-gray-900] px-8 py-3
                font-semibold text-sm rounded-sm hover:bg-white] hover:text-white transition-all"
            >
              {cta}
            </Link>
          </motion.div>

          {/* Image side */}
          <motion.div
            className="relative aspect-[4/3] rounded-sm overflow-hidden"
            style={reducedMotion ? {} : { x: imageX }}
          >
            <Image
              src="/images/hero-tables.jpg"
              alt="Office furniture showroom"
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
