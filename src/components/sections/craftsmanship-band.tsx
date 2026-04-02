import Image from "next/image";
import { Reveal } from "@/components/common/reveal";

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
      <Reveal>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 pb-8">
          <p className="text-xs uppercase tracking-widest text-[#aaaaaa]">
            {isAr ? "تفاصيل التصنيع والتشطيب" : "Construction Detail"}
          </p>
        </div>
      </Reveal>
      {/* Horizontal scroll strip */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 md:px-6 lg:px-8 max-w-screen-2xl mx-auto">
        {IMAGES.map((img) => (
          <div
            key={img.src}
            className="relative flex-none w-[220px] md:w-[260px] aspect-[3/4] overflow-hidden"
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
      </div>

      {/* Centered bilingual tagline */}
      <Reveal>
        <div className="text-center mt-10 px-4">
          <p className="text-white text-lg font-semibold tracking-widest uppercase">
            {isAr ? "كل سطح. وفق مواصفة." : "Every surface. Considered."}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
