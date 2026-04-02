"use client";

import { useState } from "react";
import Image from "next/image";

interface Project {
  name: string;
  category: string;
  image: string;
  href: string;
}

const PROJECTS: Project[] = [
  { name: "Alat", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/10/MALI1541-HDR-400x284.jpg", href: "https://majestic.com.sa/project/alat/" },
  { name: "Media Authority", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/12/DSC_7553-400x284.jpg", href: "https://majestic.com.sa/project/media-authority/" },
  { name: "NHC | Al-Sadan Villa", category: "Residential", image: "https://majestic.com.sa/wp-content/uploads/2025/12/DSC_5694-HDR-copy-final-400x284.jpg", href: "https://majestic.com.sa/project/nhcal-sadan-villa/" },
  { name: "Tanmeya Development", category: "Residential", image: "https://majestic.com.sa/wp-content/uploads/2025/12/IMG_1092-400x284.jpeg", href: "https://majestic.com.sa/project/tanmeya-development/" },
  { name: "Ministry of Health", category: "Government", image: "https://majestic.com.sa/wp-content/uploads/2025/12/2A0DC341-6918-473C-AA40-CE4F48521823-13451-000003FE3DCA14A5-1-400x284.jpg", href: "https://majestic.com.sa/project/ministry-of-health/" },
  { name: "Saudi Airlines – HQ", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/08/SaudiAirLines-hq-400x284.jpg", href: "https://majestic.com.sa/project/saudi-air-lines-hq/" },
  { name: "Bin Laden – HQ", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-400x284.jpg", href: "https://majestic.com.sa/project/bin-laden-hq/" },
  { name: "Emirates NBD", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-105-400x284.jpg", href: "https://majestic.com.sa/project/emirates-nbd/" },
  { name: "Bank AlJazira – HQ", category: "Finance", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-89-400x284.jpg", href: "https://majestic.com.sa/project/bank-aljazira-hq/" },
  { name: "Ministry of Finance", category: "Government", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-94-400x284.jpg", href: "https://majestic.com.sa/project/ministry-of-finance/" },
  { name: "Saudi Airlines – Admin", category: "Airlines", image: "https://majestic.com.sa/wp-content/uploads/2025/12/DSC_0394-400x284.jpg", href: "https://majestic.com.sa/project/saudi-air-lines-admin/" },
  { name: "Saudi Airlines Operations", category: "Airlines", image: "https://majestic.com.sa/wp-content/uploads/2025/08/1-400x284.jpg", href: "https://majestic.com.sa/project/saudi-air-lines-operation/" },
  { name: "Jeddah Park – HQ", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-106-400x284.jpg", href: "https://majestic.com.sa/project/jeddah-park-hq/" },
  { name: "DP World – Jeddah", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-103-400x284.jpg", href: "https://majestic.com.sa/project/dp-world-jeddah/" },
  { name: "NUPCO – HQ", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/08/02-2-400x284.jpg", href: "https://majestic.com.sa/project/nupco-hq/" },
  { name: "General Court of Audit", category: "Government", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-104-400x284.jpg", href: "https://majestic.com.sa/project/general-court-of-audit/" },
  { name: "National Water Company", category: "Government", image: "https://majestic.com.sa/wp-content/uploads/2025/08/1212-1-400x284.jpg", href: "https://majestic.com.sa/project/national-water-company/" },
  { name: "Al Kifah – Ruaa Proj", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-1-400x284.jpg", href: "https://majestic.com.sa/project/al-kifah-ruaa-proj/" },
  { name: "Non Oil Revenue DC", category: "Government", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-102-400x284.jpg", href: "https://majestic.com.sa/project/non-oil-revenue-dc/" },
  { name: "Al Naghy – HQ", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-101-400x284.jpg", href: "https://majestic.com.sa/project/al-naghy-hq/" },
  { name: "Maba", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-100-400x284.jpg", href: "https://majestic.com.sa/project/maba/" },
  { name: "Chamber of Commerce Dammam", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-97-400x284.jpg", href: "https://majestic.com.sa/project/chamber-of-commerce-dammam/" },
  { name: "Al Dawaa Medical – HQ", category: "Healthcare", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-95-400x284.jpg", href: "https://majestic.com.sa/project/al-dawaa-medical-hq/" },
  { name: "TAHCOM", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/12/WhatsApp-Image-1446-07-04-at-23.49.31-400x284.jpeg", href: "https://majestic.com.sa/project/tahcom/" },
  { name: "SPL", category: "Logistics", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-91-400x284.jpg", href: "https://majestic.com.sa/project/spl/" },
  { name: "Tanmiah – Murabaa Proj", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-90-400x284.jpg", href: "https://majestic.com.sa/project/tanmiah-murabaa-proj/" },
  { name: "Jeddah Municipality Office", category: "Government", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-96-400x284.jpg", href: "https://majestic.com.sa/project/office-of-the-director-of-the-jeddah-municipality/" },
  { name: "Al Diyar Al Arabyiyah", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-93-400x284.jpg", href: "https://majestic.com.sa/project/al-diyar-al-arabyiyah/" },
  { name: "King Abdullah Air Base", category: "Government", image: "https://majestic.com.sa/wp-content/uploads/2025/08/Cover-98-400x284.jpg", href: "https://majestic.com.sa/project/king-abdullah-air-base-in-jeddah-mod/" },
  { name: "Tes-project", category: "Commercial", image: "https://majestic.com.sa/wp-content/uploads/2025/12/WhatsApp-Image-1446-07-04-at-23.49.52-400x284.jpeg", href: "https://majestic.com.sa/project/tes-project/" },
];

// Duplicate for seamless infinite loop
const TRACK = [...PROJECTS, ...PROJECTS];

export function ProjectsReel({ isAr }: { isAr: boolean }) {
  const [paused, setPaused] = useState(false);

  return (
    <section className="relative w-full bg-[rgba(12,12,12,0.85)] overflow-hidden py-10">
      {/* Header */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#C1B167] mb-1">
            {isAr ? "مشاريعنا المنجزة" : "Delivered Projects"}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
            {isAr ? "بيئات عمل راقية في أرجاء المملكة" : "Workspace Excellence Across the Kingdom"}
          </h2>
        </div>
        <a
          href="https://majestic.com.sa/projects/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 text-[13px] text-white/60 hover:text-white transition-colors border-b border-white/20 hover:border-white/60 pb-0.5 whitespace-nowrap"
        >
          {isAr ? "جميع المشاريع" : "View all projects"}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
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
          {TRACK.map((project, i) => (
            <a
              key={`${project.name}-${i}`}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/card relative flex-shrink-0 overflow-hidden"
              style={{ width: "320px", height: "200px" }}
              tabIndex={i >= PROJECTS.length ? -1 : 0}
              aria-hidden={i >= PROJECTS.length ? true : undefined}
            >
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover transition-transform duration-500 group-hover/card:scale-[1.06]"
                sizes="320px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C1B167] mb-0.5">
                  {project.category}
                </span>
                <p className="text-white text-sm font-semibold leading-tight line-clamp-1">
                  {project.name}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
