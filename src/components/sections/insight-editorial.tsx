import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FadeUp } from "@/components/common/fade-up";
import { StaggerChildren } from "@/components/common/stagger-children";
import type { SanityInsightCard } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";

interface Props {
  isAr: boolean;
  cards: SanityInsightCard[];
  labelEn?: string;
  labelAr?: string;
  headingEn?: string;
  headingAr?: string;
}

export function InsightEditorial({
  isAr,
  cards,
  labelEn = "Insights",
  labelAr = "مقالات تقنية",
  headingEn = "The Workspace Standard",
  headingAr = "معيار بيئة العمل",
}: Props) {
  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <FadeUp>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs tracking-widest text-[#3A3A3A] mb-2">
                {isAr ? labelAr : labelEn}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                {isAr ? headingAr : headingEn}
              </h2>
            </div>
            <Link
              href="/insights"
              className="hidden md:block text-sm font-medium text-[#3A3A3A] hover:text-gray-900 border-b border-[#3A3A3A] pb-0.5 transition-colors"
            >
              {isAr ? "جميع المقالات" : "All Articles"}
            </Link>
          </div>
        </FadeUp>

        <StaggerChildren staggerDelay={0.08} yOffset={24} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const imageUrl = card.image
              ? urlFor(card.image).width(600).height(315).url()
              : `/images/website/s7-a-executive-floor-article.jpg`;
            return (
              <div key={card._id} className="bg-white border border-[#D4D4D4] overflow-hidden group">
                <div className="relative aspect-[1200/630] overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={isAr ? card.titleAr : card.titleEn}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] tracking-widest text-[#3A3A3A] font-medium">
                      {isAr ? card.tagAr : card.tagEn}
                    </span>
                    <span className="text-[10px] text-[#3A3A3A]">{card.publishedDate}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-4">
                    {isAr ? card.titleAr : card.titleEn}
                  </h3>
                  <Link
                    href={card.link ?? "/insights"}
                    className="text-xs font-semibold text-gray-900 hover:text-[#3A3A3A] transition-colors inline-flex items-center gap-1 group/link"
                  >
                    {isAr ? "اقرأ" : "Read"}
                    <span className="transition-transform duration-200 ltr:group-hover/link:translate-x-0.5 rtl:group-hover/link:-translate-x-0.5">›</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
