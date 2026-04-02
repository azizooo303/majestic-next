import Image from "next/image";
import { FadeUp } from "@/components/common/fade-up";
import { AutoScroll } from "@/components/common/auto-scroll";

const IMAGES = [
  { src: "/images/website/s3-a-desk-edge-detail.jpg", alt: "Desk edge detail" },
  { src: "/images/website/s3-b-height-adjustment-mechanism.jpg", alt: "Height adjustment mechanism" },
  { src: "/images/website/s3-c-leather-armrest-seam.jpg", alt: "Leather armrest seam" },
  { src: "/images/website/s3-d-conference-table-joinery.jpg", alt: "Conference table joinery" },
  { src: "/images/website/s3-e-acoustic-fabric-weave.jpg", alt: "Acoustic fabric weave" },
];

export function CraftsmanshipBand({ isAr }: { isAr: boolean }) {
  return (
    <section className="w-full bg-[#0c0c0c] py-14 md:py-20 overflow-hidden">
      {/* Overline */}
      <FadeUp>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 pb-8">
          <p className="text-xs uppercase tracking-widest text-[#aaaaaa]">
            {isAr ? "تفاصيل التصنيع والتشطيب" : "Construction Detail"}
          </p>
        </div>
      </FadeUp>

      {/* Auto-scrolling image strip */}
      <AutoScroll duration={60} gap="8px" isRTL={isAr}>
        {IMAGES.map((img) => (
          <div
            key={img.src}
            className="relative flex-none w-[220px] md:w-[260px] aspect-[3/4] overflow-hidden transition-transform duration-300 hover:scale-[1.05] hover:rotate-[0.5deg]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="260px"
            />
          </div>
        ))}
      </AutoScroll>

      {/* Centered bilingual tagline */}
      <FadeUp>
        <div className="text-center mt-10 px-4">
          <p className="text-white text-lg font-semibold tracking-widest uppercase">
            {isAr ? "كل سطح. وفق مواصفة." : "Every surface. Considered."}
          </p>
        </div>
      </FadeUp>
    </section>
  );
}
