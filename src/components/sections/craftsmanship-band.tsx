import Image from "next/image";
import { FadeUp } from "@/components/common/fade-up";
import { AutoScroll } from "@/components/common/auto-scroll";
import type { SanityCraftsmanshipImage } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";

interface Props {
  isAr: boolean;
  images: SanityCraftsmanshipImage[];
  overlineEn?: string;
  overlineAr?: string;
  taglineEn?: string;
  taglineAr?: string;
}

export function CraftsmanshipBand({
  isAr,
  images,
  overlineEn = "Construction Detail",
  overlineAr = "تفاصيل التصنيع والتشطيب",
  taglineEn = "Every surface. Considered.",
  taglineAr = "كل سطح. وفق مواصفة.",
}: Props) {
  return (
    <section className="w-full bg-white py-16 overflow-hidden">
      <FadeUp>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 pb-8">
          <p className="text-xs tracking-widest text-[#3A3A3A]">
            {isAr ? overlineAr : overlineEn}
          </p>
        </div>
      </FadeUp>

      <AutoScroll duration={60} gap="8px" isRTL={isAr}>
        {images.map((img) => {
          const imageUrl = img.image
            ? urlFor(img.image).width(480).height(320).url()
            : `/images/website/s3-a-desk-edge-detail.jpg`;
          return (
            <div
              key={img._id}
              className="relative flex-none w-[300px] md:w-[360px] aspect-[3/2] overflow-hidden transition-transform duration-300 hover:scale-[1.05] hover:rotate-[0.5deg]"
            >
              <Image
                src={imageUrl}
                alt={isAr ? (img.altAr ?? "") : (img.altEn ?? "")}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 360px, 300px"
              />
            </div>
          );
        })}
      </AutoScroll>

      <FadeUp>
        <div className="text-center mt-12 px-4">
          <p className="text-[#2C2C2C] text-lg font-semibold tracking-widest">
            {isAr ? taglineAr : taglineEn}
          </p>
        </div>
      </FadeUp>
    </section>
  );
}
