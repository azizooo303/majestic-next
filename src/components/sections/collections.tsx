import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FadeUp } from "@/components/common/fade-up";
import { StaggerChildren } from "@/components/common/stagger-children";
import type { SanityCollectionCard } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";

interface Props {
  isAr: boolean;
  collections: SanityCollectionCard[];
  labelEn?: string;
  labelAr?: string;
  headingEn?: string;
  headingAr?: string;
}

export function Collections({
  isAr,
  collections,
  labelEn = "The Collections",
  labelAr = "المجموعات",
  headingEn = "Complete Workspace Environments",
  headingAr = "بيئات عمل متكاملة",
}: Props) {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <FadeUp>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#3A3A3A] mb-2">
                {isAr ? labelAr : labelEn}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight">
                {isAr ? headingAr : headingEn}
              </h2>
              <p className="text-sm text-[#3A3A3A] mt-2">
                {isAr ? "ثلاث بيئات متناسقة، جاهزة للتحديد والتوريد." : "Three coordinated environments, ready to specify."}
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden md:block text-sm font-medium text-[#3A3A3A] hover:text-[#2C2C2C] border-b border-[#3A3A3A] pb-0.5 transition-colors"
            >
              {isAr ? "عرض جميع التشكيلات" : "View All Collections"}
            </Link>
          </div>
        </FadeUp>

        <StaggerChildren staggerDelay={0.08} yOffset={24} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((col, idx) => {
            // Per-card fallback if Sanity image is missing (3 cards max, by order)
            const fallbackImages = [
              "/images/website/s2-a-directorial-suite.jpg",
              "/images/website/s2-b-collaborative-floor.jpg",
              "/images/website/s2-c-reception-statement.jpg",
            ];
            const imageUrl = col.image
              ? urlFor(col.image).width(1200).height(800).url()
              : fallbackImages[idx] ?? fallbackImages[0];
            return (
              <div
                key={col._id}
                className="bg-white border border-[#D4D4D4] overflow-hidden group transition-all duration-200 hover:-translate-y-2 hover:shadow-[0_4px_16px_rgba(44,44,44,0.08)]"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={isAr ? col.nameAr : col.nameEn}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#2C2C2C] text-base">
                    {isAr ? col.nameAr : col.nameEn}
                  </h3>
                  <p className="text-sm text-[#3A3A3A] mt-2 leading-relaxed">
                    {isAr ? col.descriptionAr : col.descriptionEn}
                  </p>
                  <Link
                    href={col.link ?? "/shop"}
                    className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-[#2C2C2C] hover:text-[#3A3A3A] transition-colors group/link"
                  >
                    {isAr ? "استعرض التشكيلة" : "Explore the collection"}
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
