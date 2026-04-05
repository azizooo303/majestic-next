"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { useState, use } from "react";
import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { PROJECTS, getProjectBySlug } from "@/data/projects";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = use(params);
  const isAr = locale === "ar";
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const [active, setActive] = useState(0);
  const displayName = isAr && project.nameAr ? project.nameAr : project.name;

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      {/* Breadcrumb */}
      <section className="border-b border-[rgba(0,0,0,0.08)] py-10 md:py-14 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#484848] mb-3">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            <Link href="/projects" className="hover:text-gray-900 transition-colors">
              {isAr ? "مشاريعنا" : "Projects"}
            </Link>
            <span className="mx-2">/</span>
            {displayName}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            {displayName}
          </h1>
          <p className="mt-2 text-sm text-[#C1B167] uppercase tracking-widest font-semibold">
            {project.category}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
            {/* Main gallery */}
            <div>
              {/* Hero image */}
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm bg-gray-100 mb-4">
                <Image
                  key={active}
                  src={project.images[active]}
                  alt={`${displayName} — image ${active + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  priority={active === 0}
                  unoptimized
                />
              </div>

              {/* Thumbnails */}
              {project.images.length > 1 && (
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {project.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`relative aspect-square overflow-hidden rounded-sm border-2 transition-colors ${
                        i === active
                          ? "border-[#C1B167]"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${displayName} thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Info card */}
              <div className="border border-[rgba(0,0,0,0.1)] rounded-sm p-6">
                <h2 className="text-xs uppercase tracking-widest text-[#484848] mb-4">
                  {isAr ? "تفاصيل المشروع" : "Project Details"}
                </h2>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-[#484848] text-xs uppercase tracking-wider mb-0.5">
                      {isAr ? "العميل" : "Client"}
                    </dt>
                    <dd className="font-semibold text-gray-900">{displayName}</dd>
                  </div>
                  <div>
                    <dt className="text-[#484848] text-xs uppercase tracking-wider mb-0.5">
                      {isAr ? "القطاع" : "Sector"}
                    </dt>
                    <dd className="font-semibold text-gray-900">{project.category}</dd>
                  </div>
                  <div>
                    <dt className="text-[#484848] text-xs uppercase tracking-wider mb-0.5">
                      {isAr ? "عدد الصور" : "Images"}
                    </dt>
                    <dd className="font-semibold text-gray-900">{project.images.length}</dd>
                  </div>
                </dl>
              </div>

              {/* Description */}
              {project.description && (
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-[#484848] mb-3">
                    {isAr ? "عن المشروع" : "About"}
                  </h2>
                  <p className="text-sm text-[#484848] leading-relaxed">
                    {project.description}
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="block w-full text-center bg-[#0c0c0c] text-white px-6 py-3.5 text-sm font-semibold tracking-wide rounded-sm hover:bg-[#333] transition-colors"
                >
                  {isAr ? "ابدأ مشروعك معنا" : "Start a Similar Project"}
                </Link>
                <Link
                  href="/projects"
                  className="block w-full text-center mt-3 border border-[rgba(0,0,0,0.21)] text-[#484848] px-6 py-3 text-sm font-medium rounded-sm hover:border-[#0c0c0c] hover:text-gray-900 transition-colors"
                >
                  {isAr ? "جميع المشاريع" : "All Projects"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}
