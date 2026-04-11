import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { StaggerGrid } from "@/components/common/stagger-grid";
import { siteUrl } from "@/lib/site-url";
import { client, urlFor, POSTS_QUERY, type SanityBlogPost } from "@/lib/sanity";
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
      ? "المدونة — أفكار وإلهام لبيئات العمل | ماجستيك"
      : "Blog — Workspace Ideas & Inspiration | Majestic Furniture",
    description: isAr
      ? "اكتشف أحدث الأفكار والنصائح حول تصميم بيئات العمل المكتبية، اتجاهات الأثاث، والإلهام للمساحات الاحترافية في المملكة العربية السعودية."
      : "Discover the latest ideas and tips on office workspace design, furniture trends, and inspiration for professional spaces across Saudi Arabia.",
    robots: { index: true, follow: true },
    alternates: {
      canonical: siteUrl(`/${locale}/blog`),
      languages: {
        en: siteUrl("/en/blog"),
        ar: siteUrl("/ar/blog"),
        "x-default": siteUrl("/en/blog"),
      },
    },
    openGraph: {
      title: isAr ? "المدونة | ماجستيك" : "Blog | Majestic Furniture",
      description: isAr
        ? "أفكار ونصائح حول تصميم بيئات العمل المكتبية."
        : "Ideas and tips on office workspace design and furniture trends.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_SA",
      siteName: "Majestic Furniture",
    },
  };
}

export const revalidate = 3600; // revalidate every hour

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const posts: SanityBlogPost[] = await client.fetch(POSTS_QUERY);

  const postItems = posts.map((post) => {
    const imageUrl = post.mainImage
      ? urlFor(post.mainImage).width(800).height(450).url()
      : null;

    return (
      <article
        key={post._id}
        className="border border-[rgba(0,0,0,0.21)] rounded-none overflow-hidden group"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-[#FFFFFF]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={isAr ? post.titleAr : post.title}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-[#F5F5F5]" />
          )}
        </div>
        <div className="p-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#3A3A3A] mb-2">
            {isAr ? post.categoryAr : post.category}
          </p>
          <h2 className="text-base font-bold text-[#2C2C2C] leading-snug mb-3 group-hover:text-[#3A3A3A] transition-colors">
            {isAr ? post.titleAr : post.title}
          </h2>
          <p className="text-sm text-[#3A3A3A] leading-relaxed mb-4">
            {isAr ? post.excerptAr : post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#3A3A3A]">{post.publishedAt}</span>
            <Link
              href={`/blog/${post.slug.current}`}
              className="text-xs font-semibold text-[#2C2C2C] border-b border-[#2C2C2C] pb-0.5 hover:text-[#3A3A3A] hover:border-[#3A3A3A] transition-colors"
            >
              {isAr ? "اقرأ المزيد" : "Read more"}
            </Link>
          </div>
        </div>
      </article>
    );
  });

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
            {isAr ? "المدونة" : "Blog"}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2C2C2C]">
            {isAr ? "المدونة" : "Blog"}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          {posts.length > 0 ? (
            <StaggerGrid
              stagger={0.08}
              isRTL={isAr}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {postItems}
            </StaggerGrid>
          ) : (
            <Reveal>
              <p className="text-center text-sm text-[#3A3A3A] mt-16">
                {isAr ? "المزيد من المقالات قريباً." : "More articles coming soon."}
              </p>
            </Reveal>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
