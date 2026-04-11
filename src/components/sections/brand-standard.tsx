import { Reveal } from "@/components/common/reveal";
import { StaggerGrid } from "@/components/common/stagger-grid";
import type { SanityBrandPillar } from "@/lib/sanity";

interface Props {
  isAr: boolean;
  pillars: SanityBrandPillar[];
  labelEn?: string;
  labelAr?: string;
  headingEn?: string;
  headingAr?: string;
}

export function BrandStandard({
  isAr,
  pillars,
  labelEn = "The Majestic Standard",
  labelAr = "معيار ماجستيك",
  headingEn = "What We Are Built On",
  headingAr = "أسس عملنا",
}: Props) {
  return (
    <section className="relative w-full bg-white py-16 overflow-hidden border-t border-[#D4D4D4]">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="text-xs tracking-widest text-[#3A3A3A] mb-3">
              {isAr ? labelAr : labelEn}
            </p>
            <h2 className="text-2xl md:text-[36px] font-bold text-[#2C2C2C] tracking-[-0.02em]">
              {isAr ? headingAr : headingEn}
            </h2>
            <p className="text-[#3A3A3A] text-sm mt-3">
              {isAr ? "أربعة معايير تحكم كل مشروع نتولاه." : "Four commitments that define every project we take on."}
            </p>
          </div>
        </Reveal>

        <StaggerGrid
          stagger={0.1}
          isRTL={isAr}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {pillars.map((pillar) => (
            <div key={pillar._id} className="bg-white border border-[#D4D4D4] p-8 md:p-10">
              <p className="text-4xl font-bold text-[#2C2C2C] mb-5">{pillar.number}</p>
              <h3 className="text-[#2C2C2C] font-bold text-base mb-3">
                {isAr ? pillar.titleAr : pillar.titleEn}
              </h3>
              <p className="text-[#3A3A3A] text-sm leading-relaxed">
                {isAr ? pillar.bodyAr : pillar.bodyEn}
              </p>
            </div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
