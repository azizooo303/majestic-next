import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { StaggerGrid } from "@/components/common/stagger-grid";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "مشاريعنا — حلول الأثاث للشركات والمؤسسات | ماجيستيك" : "Our Projects — Corporate & Institutional Furniture Solutions | Majestic",
    description: isAr
      ? "استعرض مشاريع ماجيستيك في تأثيث المكاتب للشركات الكبرى، المستشفيات، الجامعات، والفنادق في المملكة العربية السعودية. 500+ مشروع منجز."
      : "Explore Majestic's completed furniture projects for major corporations, hospitals, universities, and hotels across Saudi Arabia. 500+ projects delivered.",
    alternates: {
      canonical: `https://thedeskco.net/${locale}/projects`,
      languages: {
        en: "https://thedeskco.net/en/projects",
        ar: "https://thedeskco.net/ar/projects",
        "x-default": "https://thedeskco.net/en/projects",
      },
    },
    openGraph: {
      title: isAr ? "مشاريعنا | ماجيستيك" : "Our Projects | Majestic Furniture",
      description: isAr
        ? "مشاريع أثاث مكتبي للشركات والمؤسسات في السعودية."
        : "Office furniture projects for corporations and institutions across Saudi Arabia.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
      siteName: "Majestic Furniture",
    },
  };
}

interface Project {
  name: string;
  nameAr: string;
  client: string;
  clientAr: string;
  year: number;
  category: "Corporate" | "Education" | "Hospitality" | "Healthcare";
  categoryAr: string;
  image: string;
}

const PROJECTS: Project[] = [
  {
    name: "Al Rajhi Bank HQ",
    nameAr: "مقر بنك الراجحي",
    client: "Al Rajhi Bank",
    clientAr: "بنك الراجحي",
    year: 2024,
    category: "Corporate",
    categoryAr: "شركات",
    image: "/images/hero-desks.jpg",
  },
  {
    name: "King Saud University Faculty",
    nameAr: "كلية جامعة الملك سعود",
    client: "King Saud University",
    clientAr: "جامعة الملك سعود",
    year: 2023,
    category: "Education",
    categoryAr: "تعليم",
    image: "/images/hero-tables.jpg",
  },
  {
    name: "Nobu Hotel Riyadh",
    nameAr: "فندق نوبو الرياض",
    client: "Nobu Hospitality",
    clientAr: "نوبو هوسبيتالتي",
    year: 2024,
    category: "Hospitality",
    categoryAr: "ضيافة",
    image: "/images/hero-seating.jpg",
  },
  {
    name: "Saudi Aramco Office",
    nameAr: "مكاتب أرامكو السعودية",
    client: "Saudi Aramco",
    clientAr: "أرامكو السعودية",
    year: 2023,
    category: "Corporate",
    categoryAr: "شركات",
    image: "/images/hero-storage.jpg",
  },
  {
    name: "Mouwasat Medical Center",
    nameAr: "مركز موواسات الطبي",
    client: "Mouwasat",
    clientAr: "موواسات",
    year: 2024,
    category: "Healthcare",
    categoryAr: "رعاية صحية",
    image: "/images/hero-tables.jpg",
  },
  {
    name: "SABIC Innovation Hub",
    nameAr: "مركز ابتكار سابك",
    client: "SABIC",
    clientAr: "سابك",
    year: 2022,
    category: "Corporate",
    categoryAr: "شركات",
    image: "/images/hero-desks.jpg",
  },
];

const FILTER_LABELS = (isAr: boolean) => [
  { label: isAr ? "الكل" : "All", value: "all" },
  { label: isAr ? "شركات" : "Corporate", value: "Corporate" },
  { label: isAr ? "رعاية صحية" : "Healthcare", value: "Healthcare" },
  { label: isAr ? "تعليم" : "Education", value: "Education" },
  { label: isAr ? "ضيافة" : "Hospitality", value: "Hospitality" },
];

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const filters = FILTER_LABELS(isAr);

  const projectItems = PROJECTS.map((project) => (
    <div
      key={project.name}
      className="relative group overflow-hidden rounded-sm border border-[rgba(0,0,0,0.21)] cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.image}
          alt={isAr ? project.nameAr : project.name}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
        <span
          className={`inline-block text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-sm mb-2 w-fit ${
            project.category === "Corporate"
              ? "bg-white/20"
              : project.category === "Healthcare"
              ? "bg-white/20"
              : project.category === "Education"
              ? "bg-white/20"
              : "bg-white/20"
          }`}
        >
          {isAr ? project.categoryAr : project.category}
        </span>
        <h3 className="font-bold text-base leading-tight mb-1">
          {isAr ? project.nameAr : project.name}
        </h3>
        <p className="text-white/70 text-xs">
          {isAr ? project.clientAr : project.client} · {project.year}
        </p>
      </div>

      {/* Always-visible footer */}
      <div className="p-4 bg-white">
        <h3 className="font-bold text-[#0c0c0c] text-sm truncate">
          {isAr ? project.nameAr : project.name}
        </h3>
        <p className="text-[#484848] text-xs mt-0.5">
          {isAr ? project.clientAr : project.client} · {project.year}
        </p>
      </div>
    </div>
  ));

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      {/* Hero */}
      <section className="bg-[#fafafa] border-b border-[rgba(0,0,0,0.08)] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#484848] mb-3">
            <Link href="/" className="hover:text-[#0c0c0c] transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            {isAr ? "مشاريعنا" : "Projects"}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0c0c0c]">
            {isAr ? "مشاريعنا" : "Our Projects"}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Filter bar */}
          <Reveal>
            <div
              className="flex gap-2 flex-wrap mb-10"
              role="group"
              aria-label={isAr ? "تصفية المشاريع" : "Filter projects"}
            >
              {filters.map((f, i) => (
                <button
                  key={f.value}
                  className={`px-4 py-2 text-sm font-medium rounded-sm border transition-colors ${
                    i === 0
                      ? "bg-[#0c0c0c] text-white border-[#0c0c0c]"
                      : "bg-white text-[#484848] border-[rgba(0,0,0,0.21)] hover:border-[#0c0c0c] hover:text-[#0c0c0c]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Project grid */}
          <StaggerGrid
            stagger={0.08}
            isRTL={isAr}
            className="grid grid-cols-2 md:grid-cols-3 gap-5"
          >
            {projectItems}
          </StaggerGrid>

          {/* CTA */}
          <Reveal>
            <div className="mt-16 text-center">
              <p className="text-[#484848] text-sm mb-6 max-w-md mx-auto leading-relaxed">
                {isAr
                  ? "هل تبحث عن شريك موثوق لمشروع أثاث مكتبي؟ تواصل معنا لمناقشة متطلبات مشروعك."
                  : "Looking for a reliable partner for an office furniture project? Contact us to discuss your requirements."}
              </p>
              <Link
                href="/contact"
                className="btn-press inline-block bg-[#0c0c0c] text-white px-10 py-3.5 font-semibold text-sm tracking-wide rounded-sm hover:bg-[#333] transition-colors"
              >
                {isAr ? "ابدأ مشروعك معنا" : "Start a Project"}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
