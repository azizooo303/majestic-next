"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PROJECTS } from "@/data/projects";

const TRACK = [...PROJECTS, ...PROJECTS];

export function ProjectsReel({ isAr }: { isAr: boolean }) {
  const [paused, setPaused] = useState(false);

  return (
    <section className="relative w-full bg-[#0c0c0c] overflow-hidden py-12">
      {/* Header */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 mb-8 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/60 mb-1">
            {isAr ? "مشاريعنا المنجزة" : "Delivered Projects"}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
            {isAr ? "بيئات عمل راقية في أرجاء المملكة" : "Workspace Excellence Across the Kingdom"}
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

      {/* Reel */}
      <div
        className="w-full overflow-hidden"
        style={{ maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label={isAr ? "معرض المشاريع" : "Projects gallery"}
      >
        <div
          className={`projects-reel-track flex gap-4${paused ? " paused" : ""}`}
          style={{ width: "max-content" }}
        >
          {TRACK.map((project, i) => {
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
