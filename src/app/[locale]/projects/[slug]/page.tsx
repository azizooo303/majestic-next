import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { ProjectGallery } from "@/components/sections/project-gallery";
import { getProjectBySlug } from "@/data/projects";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const isAr = locale === "ar";
  const name = isAr && project.nameAr ? project.nameAr : project.name;
  return {
    title: `${name} | ${isAr ? "ماجستيك" : "Majestic Furniture"}`,
    description: project.description ?? (isAr ? "مشروع أثاث مكتبي منجز بواسطة ماجستيك." : "Office furniture project delivered by Majestic."),
    alternates: {
      canonical: siteUrl(`/${locale}/projects/${slug}`),
      languages: {
        en: siteUrl(`/en/projects/${slug}`),
        ar: siteUrl(`/ar/projects/${slug}`),
        "x-default": siteUrl(`/en/projects/${slug}`),
      },
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isAr = locale === "ar";
  const project = getProjectBySlug(slug);

  if (!project) notFound();

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
          <p className="mt-2 text-sm text-[#484848] uppercase tracking-widest font-semibold">
            {project.category}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
            {/* Gallery — client component */}
            <ProjectGallery images={project.images} name={displayName} />

            {/* Sidebar */}
            <div className="space-y-8">
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

              {project.description && (
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-[#484848] mb-3">
                    {isAr ? "عن المشروع" : "About"}
                  </h2>
                  <p className="text-sm text-[#484848] leading-relaxed">{project.description}</p>
                </div>
              )}

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
