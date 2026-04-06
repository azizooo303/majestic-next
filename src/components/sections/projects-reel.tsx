"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/common/count-up";
import { PROJECTS } from "@/data/projects";

const TRACK = [...PROJECTS, ...PROJECTS];

const STATS = [
  { value: "500+", labelEn: "Projects Delivered", labelAr: "مشروع منجز" },
  { value: "12+",  labelEn: "Years of Excellence", labelAr: "عاماً من الخبرة" },
  { value: "6",    labelEn: "GCC Markets", labelAr: "أسواق خليجية" },
  { value: "100+", labelEn: "Premium Brands", labelAr: "علامة تجارية راقية" },
];

export function ProjectsReel({ isAr }: { isAr: boolean }) {
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  return (
    <section className="relative w-full bg-[#0c0c0c] overflow-hidden py-12">
      {/* Header */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 mb-8 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/60 mb-1">
            {isAr ? "مشاريعنا المنجزة" : "Delivered Projects"}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
            {isAr ? "وزارات. مقرات. مؤسسات. في المملكة ودول الخليج." : "Ministries. Headquarters. Institutions. Across Saudi Arabia and the Gulf."}
          </h2>
        </div>
        <Link
          href="/projects"
          className="hidden md:flex items-center gap-1.5 text-[13px] text-white/60 hover:text-white transition-colors border-b border-white/20 hover:border-white/60 pb-0.5 whitespace-nowrap"
        >
          {isAr ? "جميع المشاريع" : "View all projects"}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Trust Metrics */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 border border-white/10">
          {STATS.map((stat) => (
            <div key={stat.labelEn} className="flex flex-col items-center justify-center py-5 px-4 text-center">
              <p className="text-2xl md:text-[28px] font-extrabold text-white tracking-tight leading-none">
                <CountUp value={stat.value} duration={1200} />
              </p>
              <p className={`mt-1.5 text-white/50 ${isAr ? "text-[12px]" : "text-[10px] uppercase tracking-[0.13em]"}`}>
                {isAr ? stat.labelAr : stat.labelEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reel */}
      <div
        className="w-full overflow-hidden"
        style={reduced ? undefined : { maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)" }}
        onMouseEnter={() => !reduced && setPaused(true)}
        onMouseLeave={() => !reduced && setPaused(false)}
        aria-label={isAr ? "معرض المشاريع" : "Projects gallery"}
      >
        <div
          className={reduced ? "flex gap-4 overflow-x-auto pb-2 no-scrollbar px-4 md:px-8" : `projects-reel-track flex gap-4${paused ? " paused" : ""}`}
          style={reduced ? undefined : { width: "max-content" }}
        >
          {(reduced ? PROJECTS : TRACK).map((project, i) => {
            const displayName = isAr && project.nameAr ? project.nameAr : project.name;
            return (
              <Link
                key={`${project.slug}-${i}`}
                href={`/projects/${project.slug}`}
                className="group/card relative flex-shrink-0 overflow-hidden"
                style={{ width: "360px", height: "240px" }}
                tabIndex={i >= PROJECTS.length ? -1 : 0}
                aria-hidden={i >= PROJECTS.length ? true : undefined}
              >
                <Image
                  src={project.images[0]}
                  alt={displayName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-[1.06]"
                  sizes="320px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60 mb-0.5">
                    {project.category}
                  </span>
                  <p className="text-white text-sm font-semibold leading-tight line-clamp-1">
                    {displayName}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
