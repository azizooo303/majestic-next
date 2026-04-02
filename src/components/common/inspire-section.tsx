"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function InspireSection({ isAr }: { isAr: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Image panel — slides in from left (LTR) / right (RTL), enter only
  const imageX = useTransform(
    scrollYProgress,
    [0, 0.5],
    [isAr ? 30 : -30, 0]
  );

  // Text panel — slides in from right (LTR) / left (RTL), enter only
  const textX = useTransform(
    scrollYProgress,
    [0, 0.5],
    [isAr ? -30 : 30, 0]
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#f7f7f5] border-t border-b border-[rgba(0,0,0,0.08)] overflow-hidden relative"
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid md:grid-cols-2 min-h-[420px]">
          {/* Image side */}
          <motion.div
            className={`relative overflow-hidden min-h-[300px] md:min-h-[420px] ${
              isAr ? "md:order-2" : "md:order-1"
            }`}
            style={reducedMotion ? {} : { x: imageX }}
          >
            <Image
              src="/images/hero-tables.jpg"
              alt={
                isAr
                  ? "أفكار لتخطيط مساحة العمل"
                  : "Office space planning ideas"
              }
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Text side */}
          <motion.div
            className={`flex flex-col justify-center px-8 lg:px-16 py-12 md:py-16 ${
              isAr ? "md:order-1" : "md:order-2"
            }`}
            style={reducedMotion ? {} : { x: textX }}
          >
            <p className="text-xs uppercase tracking-widest text-[#484848] font-medium mb-4">
              {isAr ? "إلهام التصميم" : "Design Inspiration"}
            </p>
            <h2 className="text-[28px] lg:text-[36px] font-bold text-[#0c0c0c] leading-tight tracking-tight">
              {isAr
                ? "أفكار لتخطيط\nمساحة عملك"
                : "Planning Ideas\nFor Your Workspace"}
            </h2>
            <p className="mt-4 text-[#484848] text-base leading-relaxed max-w-sm">
              {isAr
                ? "استلهم من مجموعات أثاث مكتبي مصممة لتعزيز الإنتاجية والأناقة في كل بيئة عمل."
                : "Get inspired by curated office furniture collections designed to elevate productivity and style in any work environment."}
            </p>
            <Link
              href="/inspirations"
              className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-[#0c0c0c] hover:text-[#484848] transition-colors group"
            >
              {isAr ? "استكشف الإلهام" : "Explore the collection"}
              <span className="text-base transition-transform duration-200 ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180">
                ›
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
