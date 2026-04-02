import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/common/reveal";

interface Panel {
  image: string;
  labelEn: string;
  labelAr: string;
  href: string;
}

const PANELS: Panel[] = [
  { image: "/images/website/s1-a-executive-office.jpg", labelEn: "Executive Office", labelAr: "المكتب التنفيذي", href: "/shop?category=tables" },
  { image: "/images/website/s1-b-boardroom.jpg", labelEn: "Boardroom", labelAr: "قاعة الاجتماعات", href: "/shop?category=tables" },
  { image: "/images/website/s1-c-open-workfloor.jpg", labelEn: "Open Workfloor", labelAr: "طابق العمل المفتوح", href: "/shop?category=workstations" },
  { image: "/images/website/s1-d-reception-lobby.jpg", labelEn: "Reception & Lobby", labelAr: "منطقة الاستقبال والبهو", href: "/shop?category=storage" },
  { image: "/images/website/s1-e-lounge-collaboration.jpg", labelEn: "Lounge & Collaboration", labelAr: "منطقة الجلوس والتعاون", href: "/shop?category=lounge" },
  { image: "/images/website/s1-f-training-seminar.jpg", labelEn: "Training & Seminar", labelAr: "قاعات التدريب والندوات", href: "/shop?category=workstations" },
];

export function SpaceTypology({ isAr }: { isAr: boolean }) {
  return (
    <section className="w-full bg-[#0c0c0c]">
      <Reveal>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 pt-10 pb-4">
          <p className="text-xs uppercase tracking-widest text-[#aaaaaa] mb-6">
            {isAr ? "حلول تجهيز لكل فضاء عمل" : "Every Space Has a Standard"}
          </p>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {PANELS.map((panel) => (
          <Link key={panel.labelEn} href={panel.href} className="group relative aspect-[9/16] md:aspect-[9/14] lg:aspect-[9/16] overflow-hidden block">
            <Image
              src={panel.image}
              alt={isAr ? panel.labelAr : panel.labelEn}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 17vw"
            />
            {/* Dark gradient overlay always present */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Label */}
            <div className="absolute bottom-0 start-0 end-0 p-4">
              <p className="text-white text-sm font-semibold leading-tight">
                {isAr ? panel.labelAr : panel.labelEn}
              </p>
              <p className="text-white/70 text-xs mt-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                {isAr ? "استعرض التشكيلة ←" : "See the range →"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
