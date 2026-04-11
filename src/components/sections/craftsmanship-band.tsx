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
  headingEn?: string;
  headingAr?: string;
  subheadEn?: string;
  subheadAr?: string;
}

type TileCaption = {
  labelEn: string;
  labelAr: string;
  claimEn: string;
  claimAr: string;
};

const TILE_CAPTIONS: Record<number, TileCaption> = {
  1: {
    labelEn: "Millwork",
    labelAr: "النجارة الدقيقة",
    claimEn: "Responsibly harvested hardwood, bookmatched by hand",
    claimAr: "خشب من مصادر موثوقة، مُقَرَّن يدوياً",
  },
  2: {
    labelEn: "Structural Frame",
    labelAr: "الهيكل الإنشائي",
    claimEn: "Recycled-content metal, finished in-house",
    claimAr: "معدن معاد تدويره، تشطيب داخلي",
  },
  3: {
    labelEn: "Cable Management",
    labelAr: "إدارة الكابلات",
    claimEn: "Concealed, serviceable, built to last a decade",
    claimAr: "مخفي، قابل للصيانة، بُني ليدوم عقداً",
  },
  4: {
    labelEn: "Spine Beam",
    labelAr: "العمود المركزي",
    claimEn: "Architectural aluminum, routed for power and data",
    claimAr: "ألومنيوم معماري، مُجهَّز للطاقة والبيانات",
  },
  5: {
    labelEn: "Ergonomic Mechanism",
    labelAr: "الآلية الحركية",
    claimEn: "Repairable parts, ten-year standard warranty",
    claimAr: "قطع قابلة للاستبدال، ضمان عشر سنوات",
  },
  6: {
    labelEn: "Lounge Upholstery",
    labelAr: "تنجيد الجلوس",
    claimEn: "Chrome-free full-grain leather, vegetable tanned",
    claimAr: "جلد طبيعي مدبوغ نباتياً، خالٍ من الكروم",
  },
  7: {
    labelEn: "Contract Textile",
    labelAr: "الأقمشة المهنية",
    claimEn: "Natural-fibre weave, undyed where possible",
    claimAr: "نسيج طبيعي، غير مصبوغ قدر الإمكان",
  },
};

export function CraftsmanshipBand({
  isAr,
  images,
  overlineEn = "Made Sustainable",
  overlineAr = "صُنع ليدوم",
  headingEn = "The best the world makes. Chosen once, built to last.",
  headingAr = "أفضل ما يُصنع في العالم. خيارٌ واحد، يدوم طويلاً.",
  subheadEn = "Every panel, frame, tray, mechanism and fibre is sourced from the top of its category — and chosen for how it is grown, milled, finished, and one day returned. Nothing extravagant. Nothing disposable.",
  subheadAr = "كل لوح، وهيكل، ومسار، وآلية، ونسيج — مختار من أفضل ما يُصنع في العالم، ومختار لأصله ومآله. لا إسراف. لا استهلاك عابر.",
}: Props) {
  return (
    <section className="w-full bg-white py-20 overflow-hidden">
      <FadeUp>
        <div className="max-w-screen-lg mx-auto px-4 md:px-6 lg:px-8 pb-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#3A3A3A] mb-5">
            {isAr ? overlineAr : overlineEn}
          </p>
          <h2 className="text-[#2C2C2C] text-2xl md:text-4xl font-light leading-tight mb-5 max-w-2xl mx-auto">
            {isAr ? headingAr : headingEn}
          </h2>
          <p className="text-[#3A3A3A] text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {isAr ? subheadAr : subheadEn}
          </p>
        </div>
      </FadeUp>

      <AutoScroll duration={80} gap="12px" isRTL={isAr}>
        {images.map((img) => {
          const imageUrl = img.image
            ? urlFor(img.image).width(600).height(400).url()
            : `/images/website/s3-a-desk-edge-detail.jpg`;
          const caption = TILE_CAPTIONS[img.order];
          const label = caption ? (isAr ? caption.labelAr : caption.labelEn) : "";
          const claim = caption ? (isAr ? caption.claimAr : caption.claimEn) : "";
          return (
            <div
              key={img._id}
              className="relative flex-none w-[320px] md:w-[400px] aspect-[3/2] overflow-hidden group"
            >
              <Image
                src={imageUrl}
                alt={isAr ? (img.altAr ?? "") : (img.altEn ?? "")}
                fill
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                sizes="(min-width: 768px) 400px, 320px"
              />
              {caption && (
                <div
                  className="absolute inset-x-0 bottom-0 pt-16 pb-5 px-5 text-white pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0) 100%)",
                  }}
                  dir={isAr ? "rtl" : "ltr"}
                >
                  <p className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase opacity-90 mb-1">
                    {label}
                  </p>
                  <p className="text-xs md:text-sm leading-snug opacity-95">
                    {claim}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </AutoScroll>
    </section>
  );
}
