import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { StaggerGrid } from "@/components/common/stagger-grid";
import { PROJECTS } from "@/data/projects";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr
      ? "المشاريع — ماجستيك | أثاث مكتبي السعودية والخليج"
      : "Projects — Majestic | Office Furniture Saudi Arabia & Gulf",
    description: isAr
      ? "مشاريع أثاث مكتبي مُنجزة للشركات والجهات الحكومية والمؤسسات في السعودية ودول الخليج. من التصميم إلى التسليم الكامل."
      : "Office furniture projects delivered to corporations, government entities, and institutions across Saudi Arabia and the Gulf. From brief to full installation.",
    alternates: {
      canonical: siteUrl(`/${locale}/projects`),
      languages: {
        en: siteUrl("/en/projects"),
        ar: siteUrl("/ar/projects"),
        "x-default": siteUrl("/en/projects"),
      },
    },
  };
}

const CATEGORIES = ["All", "Commercial", "Government", "Finance", "Airlines", "Healthcare", "Residential", "Logistics"];
const CATEGORIES_AR: Record<string, string> = {
  All: "الكل",
  Commercial: "تجاري",
  Government: "حكومي",
  Finance: "مالي",
  Airlines: "طيران",
  Healthcare: "صحة",
  Residential: "سكني",
  Logistics: "لوجستي",
};

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-[#D4D4D4] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#3A3A3A] mb-3">
            <Link href="/" className="hover:text-[#2C2C2C] transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            {isAr ? "مشاريعنا" : "Projects"}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2C2C2C]">
            {isAr ? "المشاريع." : "Projects."}
          </h1>
          <p className="mt-3 text-[#3A3A3A] text-sm">
            {isAr
              ? `${PROJECTS.length}+ مشروع منجز في السعودية ودول الخليج`
              : `${PROJECTS.length}+ completed projects across Saudi Arabia and the Gulf`}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Filter bar — decorative only (SSR), JS filter can be added later */}
          <Reveal>
            <div
              className="flex gap-2 flex-wrap mb-10"
              role="group"
              aria-label={isAr ? "تصفية المشاريع" : "Filter projects"}
            >
              {CATEGORIES.map((cat, i) => (
                <span
                  key={cat}
                  className={`px-4 py-2 text-sm font-medium rounded-none border cursor-default ${
                    i === 0
                      ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                      : "bg-white text-[#3A3A3A] border-[rgba(0,0,0,0.21)]"
                  }`}
                >
                  {isAr ? CATEGORIES_AR[cat] : cat}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Project grid */}
          <StaggerGrid
            stagger={0.06}
            isRTL={isAr}
            className="grid grid-cols-2 md:grid-cols-3 gap-5"
          >
            {PROJECTS.map((project) => {
              const displayName = isAr && project.nameAr ? project.nameAr : project.name;
              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="relative group overflow-hidden rounded-none border border-[rgba(0,0,0,0.1)] block"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={project.images[0]}
                      alt={displayName}
                      fill
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      unoptimized
                    />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                    <span className="inline-block text-xs font-semibold uppercase tracking-wider px-2 py-1 bg-white/20 rounded-none mb-2 w-fit">
                      {project.category}
                    </span>
                    <h3 className="font-bold text-base leading-tight">{displayName}</h3>
                    <p className="text-white/70 text-xs mt-1">
                      {isAr ? "عرض المشروع" : "View project"} →
                    </p>
                  </div>

                  {/* Always-visible footer */}
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-[#2C2C2C] text-sm truncate">{displayName}</h3>
                    <p className="text-[#3A3A3A] text-xs mt-0.5 uppercase tracking-wider font-semibold">
                      {project.category}
                    </p>
                  </div>
                </Link>
              );
            })}
          </StaggerGrid>

          {/* CTA */}
          <Reveal>
            <div className="mt-16 text-center">
              <p className="text-[#3A3A3A] text-sm mb-6 max-w-md mx-auto leading-relaxed">
                {isAr
                  ? "مشروع أثاث مكتبي في السعودية أو الخليج؟ فريق ماجستيك يتولى من المواصفة إلى التركيب."
                  : "An office furniture project in Saudi Arabia or the Gulf? Majestic handles from specification to installation."}
              </p>
              <Link
                href="/contact"
                className="inline-block bg-[#2C2C2C] text-white px-10 py-3.5 font-semibold text-sm tracking-wide rounded-none hover:bg-[#3A3A3A] transition-colors"
              >
                {isAr ? "ابدأ مشروعك." : "Start a Project."}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
