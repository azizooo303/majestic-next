import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { siteUrl } from "@/lib/site-url";
import { BlogPostingJsonLd } from "@/components/common/json-ld";
import { PortableText } from "@portabletext/react";
import {
  client,
  urlFor,
  POST_BY_SLUG_QUERY,
  ALL_SLUGS_QUERY,
  type SanityBlogPost,
} from "@/lib/sanity";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const slugs: { slug: string }[] = await client.fetch(ALL_SLUGS_QUERY);
    return slugs.map(({ slug }) => ({ slug }));
  } catch (err) {
    console.error("[blog] Failed to fetch slugs from Sanity:", err);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post: SanityBlogPost | null = await client.fetch(POST_BY_SLUG_QUERY, { slug });
  if (!post) return {};
  const isAr = locale === "ar";
  const title = isAr ? post.titleAr : post.title;
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined;
  return {
    title: `${title} | ${isAr ? "مدونة ماجستيك" : "Majestic Blog"}`,
    description: isAr ? post.excerptAr : post.excerpt,
    robots: { index: true, follow: true },
    alternates: {
      canonical: siteUrl(`/${locale}/blog/${slug}`),
      languages: {
        en: siteUrl(`/en/blog/${slug}`),
        ar: siteUrl(`/ar/blog/${slug}`),
        "x-default": siteUrl(`/en/blog/${slug}`),
      },
    },
    openGraph: {
      title,
      description: isAr ? post.excerptAr : post.excerpt,
      type: "article",
      locale: isAr ? "ar_SA" : "en_SA",
      siteName: "Majestic Furniture",
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      }),
    },
  };
}

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-[#3A3A3A] leading-[1.8] text-base">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-xl font-bold text-[#2C2C2C] mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-lg font-bold text-[#2C2C2C] mt-6 mb-3">{children}</h3>
    ),
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post: SanityBlogPost | null = await client.fetch(POST_BY_SLUG_QUERY, { slug });

  if (!post) notFound();

  const isAr = locale === "ar";
  const title = isAr ? post.titleAr : post.title;
  const category = isAr ? post.categoryAr : post.category;
  const body = isAr ? post.bodyAr : post.body;
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(675).url()
    : null;

  // Use the EN title for the schema headline regardless of locale — Google
  // indexes the canonical (EN) version, so the EN headline is correct here.
  const schemaImageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : siteUrl("/images/og/blog-default.jpg");

  // publishedAt comes from Sanity as an ISO 8601 date string (e.g. "2025-11-01")
  const datePublished = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : new Date().toISOString();

  return (
    <>
      <BlogPostingJsonLd
        headline={post.title}
        description={post.excerpt ?? ""}
        image={schemaImageUrl}
        datePublished={datePublished}
        url={siteUrl(`/en/blog/${slug}`)}
        slug={slug}
      />
      <PageWrapper id="main-content" className="flex-1 bg-white">
      {/* Breadcrumb + Hero */}
      <section className="bg-white border-b border-[#D4D4D4] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#3A3A3A] mb-3">
            <Link href="/" className="hover:text-[#2C2C2C] transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/blog"
              className="hover:text-[#2C2C2C] transition-colors"
            >
              {isAr ? "المدونة" : "Blog"}
            </Link>
            <span className="mx-2">/</span>
            {title}
          </p>
          <p className="text-xs uppercase tracking-wider font-semibold text-[#3A3A3A] mb-3">
            {category}
            <span className="mx-3 text-[#d1d5db]">·</span>
            {post.publishedAt}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#2C2C2C] max-w-3xl">
            {title}
          </h1>
        </div>
      </section>

      {/* Article */}
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            {/* Main content */}
            <article>
              {imageUrl && (
                <Reveal>
                  <div className="relative aspect-[16/9] overflow-hidden rounded-sm mb-10">
                    <Image
                      src={imageUrl}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 65vw"
                      priority
                    />
                  </div>
                </Reveal>
              )}

              <Reveal>
                <div className="space-y-6" dir={isAr ? "rtl" : "ltr"}>
                  <PortableText
                    value={body as Parameters<typeof PortableText>[0]["value"]}
                    components={portableTextComponents}
                  />
                </div>
              </Reveal>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="border border-[rgba(0,0,0,0.1)] rounded-sm p-6">
                <h2 className="text-xs uppercase tracking-widest text-[#3A3A3A] mb-4">
                  {isAr ? "تفاصيل المقال" : "Article Details"}
                </h2>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-[#3A3A3A] text-xs uppercase tracking-wider mb-0.5">
                      {isAr ? "التصنيف" : "Category"}
                    </dt>
                    <dd className="font-semibold text-[#2C2C2C]">{category}</dd>
                  </div>
                  <div>
                    <dt className="text-[#3A3A3A] text-xs uppercase tracking-wider mb-0.5">
                      {isAr ? "تاريخ النشر" : "Published"}
                    </dt>
                    <dd className="font-semibold text-[#2C2C2C]">
                      {post.publishedAt}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="block w-full text-center bg-[#2C2C2C] text-white px-6 py-3.5 text-sm font-semibold tracking-wide rounded-sm hover:bg-[#3A3A3A] transition-colors"
                >
                  {isAr ? "تواصل معنا" : "Get in Touch"}
                </Link>
                <Link
                  href="/blog"
                  className="block w-full text-center mt-3 border border-[#D4D4D4] text-[#3A3A3A] px-6 py-3 text-sm font-medium rounded-sm hover:border-[#2C2C2C] hover:text-[#2C2C2C] transition-colors"
                >
                  {isAr ? "جميع المقالات" : "All Articles"}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PageWrapper>
    </>
  );
}
