import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FadeDown } from "@/components/common/fade-down";
import { SlideIn } from "@/components/common/slide-in";
import type { SanitySpacePanel } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";

interface Props {
  isAr: boolean;
  panels?: SanitySpacePanel[];
  labelEn?: string;
  labelAr?: string;
}

export function SpaceTypology({ isAr, panels = [], labelEn = "Every Space Has a Standard", labelAr = "لكل فضاء. معيار." }: Props) {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      <FadeDown>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 pt-10 pb-4">
          <h2 className="overline mb-6">
            {isAr ? labelAr : labelEn}
          </h2>
        </div>
      </FadeDown>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {panels.map((panel, i) => {
          const imageUrl = panel.image
            ? urlFor(panel.image).width(400).height(700).url()
            : `/images/website/s1-a-executive-office.jpg`;
          return (
            <SlideIn key={panel._id} xOffset={isAr ? 20 : -20} delay={i * 0.06}>
              <Link
                href={panel.link ?? "/shop"}
                className="group relative aspect-[9/16] md:aspect-[9/14] lg:aspect-[9/16] overflow-hidden block"
              >
                <Image
                  src={imageUrl}
                  alt={isAr ? panel.labelAr : panel.labelEn}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 17vw"
                />
                <div className="absolute inset-0 bg-black/15" />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 start-0 end-0 p-4">
                  <p className="text-white text-sm font-semibold leading-tight">
                    {isAr ? panel.labelAr : panel.labelEn}
                  </p>
                  <p className="text-white/70 text-xs mt-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                    {isAr ? "→ استعرض التشكيلة" : "See the range →"}
                  </p>
                </div>
              </Link>
            </SlideIn>
          );
        })}
      </div>
    </section>
  );
}
