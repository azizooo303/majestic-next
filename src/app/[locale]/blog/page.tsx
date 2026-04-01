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
    title: isAr
      ? "المدونة — أفكار وإلهام لبيئات العمل | ماجيستيك"
      : "Blog — Workspace Ideas & Inspiration | Majestic Furniture",
    description: isAr
      ? "اكتشف أحدث الأفكار والنصائح حول تصميم بيئات العمل المكتبية، اتجاهات الأثاث، والإلهام للمساحات الاحترافية في المملكة العربية السعودية."
      : "Discover the latest ideas and tips on office workspace design, furniture trends, and inspiration for professional spaces across Saudi Arabia.",
    alternates: {
      canonical: `https://thedeskco.net/en/blog`,
      languages: {
        en: "https://thedeskco.net/en/blog",
        ar: "https://thedeskco.net/ar/blog",
        "x-default": "https://thedeskco.net/en/blog",
      },
    },
    openGraph: {
      title: isAr ? "المدونة | ماجيستيك" : "Blog | Majestic Furniture",
      description: isAr
        ? "أفكار ونصائح حول تصميم بيئات العمل المكتبية."
        : "Ideas and tips on office workspace design and furniture trends.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
      siteName: "Majestic Furniture",
    },
  };
}

const POSTS = [
  {
    slug: "ergonomic-workspace-guide",
    title: "The Complete Guide to an Ergonomic Workspace",
    titleAr: "الدليل الشامل لبيئة عمل مريحة ومتوافقة مع طبيعة الجسم",
    excerpt:
      "Everything you need to know about setting up a workspace that supports posture, reduces fatigue, and boosts focus.",
    excerptAr:
      "كل ما تحتاج معرفته لتهيئة بيئة عمل تدعم وضعية الجلوس وتقلل الإجهاد وتعزز التركيز.",
    date: "2024-03-15",
    category: "Ergonomics",
    categoryAr: "الإرغونوميكس",
    image: "/images/hero-seating.jpg",
  },
  {
    slug: "executive-desk-buying-guide",
    title: "Executive Desk Buying Guide 2024",
    titleAr: "دليل اختيار المكتب التنفيذي 2024",
    excerpt:
      "Key factors to consider when investing in an executive desk — materials, size, storage, and brand reputation.",
    excerptAr:
      "أبرز العوامل التي يجب مراعاتها عند الاستثمار في مكتب تنفيذي: المواد، الحجم، التخزين، وسمعة العلامة التجارية.",
    date: "2024-02-20",
    category: "Buying Guide",
    categoryAr: "دليل الشراء",
    image: "/images/hero-desks.jpg",
  },
  {
    slug: "office-design-trends-2024",
    title: "Office Design Trends Shaping Workspaces in 2024",
    titleAr: "اتجاهات تصميم المكاتب التي تُشكّل بيئات العمل في 2024",
    excerpt:
      "From biophilic design to hybrid work layouts, discover the trends redefining office environments this year.",
    excerptAr:
      "من التصميم البيوفيلي إلى تخطيطات العمل الهجين، اكتشف الاتجاهات التي تُعيد تعريف بيئات المكاتب هذا العام.",
    date: "2024-01-10",
    category: "Design Trends",
    categoryAr: "اتجاهات التصميم",
    image: "/images/hero-tables.jpg",
  },
];

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const postItems = POSTS.map((post) => (
    <article
      key={post.slug}
      className="border border-[rgba(0,0,0,0.21)] rounded-sm overflow-hidden group"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#fafafa]">
        <div className="w-full h-full bg-[#e5e7eb]" aria-hidden="true" />
      </div>
      <div className="p-6">
        <p className="text-xs uppercase tracking-wider font-semibold text-[#484848] mb-2">
          {isAr ? post.categoryAr : post.category}
        </p>
        <h2 className="text-base font-bold text-[#0c0c0c] leading-snug mb-3 group-hover:text-[#484848] transition-colors">
          {isAr ? post.titleAr : post.title}
        </h2>
        <p className="text-sm text-[#484848] leading-relaxed mb-4">
          {isAr ? post.excerptAr : post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#9ca3af]">{post.date}</span>
          <Link
            href={`/blog/${post.slug}`}
            className="text-xs font-semibold text-[#0c0c0c] border-b border-[#0c0c0c] pb-0.5 hover:text-[#484848] hover:border-[#484848] transition-colors"
          >
            {isAr ? "اقرأ المزيد" : "Read more"}
          </Link>
        </div>
      </div>
    </article>
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
            {isAr ? "المدونة" : "Blog"}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0c0c0c]">
            {isAr ? "المدونة" : "Blog"}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <StaggerGrid
            stagger={0.08}
            isRTL={isAr}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {postItems}
          </StaggerGrid>

          <Reveal>
            <p className="text-center text-sm text-[#484848] mt-16">
              {isAr
                ? "المزيد من المقالات قريباً."
                : "More articles coming soon."}
            </p>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
