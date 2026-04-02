"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { FadeDown } from "@/components/common/fade-down";
import { SectionArchOverlay } from "@/components/sections/section-arch-overlay";
import { CountUp } from "@/components/common/count-up";
import { ease } from "@/lib/motion";

interface Stat {
  value: string;
  labelEn: string;
  labelAr: string;
}

interface Project {
  image: string;
  stats: Stat[];
  descEn: string;
  descAr: string;
}

const PROJECTS: Project[] = [
  {
    image: "/images/website/s4-a-workfloor-scale.jpg",
    stats: [
      { value: "320", labelEn: "Workstations Installed", labelAr: "محطة عمل مُركَّبة" },
      { value: "4", labelEn: "Floors Furnished", labelAr: "طوابق مُجهَّزة" },
      { value: "12", labelEn: "Weeks to Delivery", labelAr: "أسبوعاً حتى التسليم" },
    ],
    descEn:
      "A complete open-floor fit-out across four levels for a financial services firm in Riyadh. Every workstation, every partition, every ergonomic detail — supplied and installed by Majestic.",
    descAr:
      "تجهيز كامل لأربعة طوابق بنظام المكاتب المفتوحة لشركة خدمات مالية في الرياض. كل محطة عمل، كل وحدة تقسيم، كل تفصيل هندسي — توريد وتركيب من ماجيستيك.",
  },
  {
    image: "/images/website/s4-b-executive-floor-corridor.jpg",
    stats: [
      { value: "18", labelEn: "Executive Offices", labelAr: "مكتباً تنفيذياً" },
      { value: "1", labelEn: "Full Floor Fit-Out", labelAr: "طابق مُجهَّز بالكامل" },
      { value: "100%", labelEn: "Custom Specification", labelAr: "مواصفات مخصصة" },
    ],
    descEn:
      "A full executive floor for a regional headquarters — bespoke Newton GM desks, Kratos boardroom tables, and integrated storage, delivered to a single specification brief.",
    descAr:
      "تجهيز طابق تنفيذي كامل لمقر إقليمي — مكاتب Newton GM، وطاولات Kratos لقاعات الاجتماعات، ووحدات تخزين متكاملة، مُنفَّذة وفق كراسة مواصفات موحدة.",
  },
];


export function ProjectScale({ isAr }: { isAr: boolean }) {
  return (
    <section className="relative w-full bg-white py-14 md:py-20 overflow-hidden">
      <SectionArchOverlay variant="dimension" opacity={0.07} />
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <FadeDown>
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-[#484848] mb-2">
              {isAr ? "مشاريع منجزة" : "Completed Projects"}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0c0c0c] tracking-tight">
              {isAr ? "تجهيز على المستوى المؤسسي" : "Built for Institutional Scale"}
            </h2>
          </div>
        </FadeDown>

        <div className="flex flex-col gap-12">
          {PROJECTS.map((project, i) => (
            <div
              key={i}
              className={`flex flex-col md:flex-row gap-0 overflow-hidden border border-[rgba(0,0,0,0.12)] ${isAr ? "md:flex-row-reverse" : ""}`}
            >
              {/* Image — slides in from left (or right in RTL) */}
              <motion.div
                className="relative w-full md:w-1/2 aspect-[16/9] md:aspect-auto min-h-[280px]"
                initial={{ opacity: 0, x: isAr ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: ease.smooth }}
              >
                <Image
                  src={project.image}
                  alt={isAr ? project.descAr.slice(0, 40) : project.descEn.slice(0, 40)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>

              {/* Text block — slides in from right (or left in RTL) */}
              <motion.div
                className="w-full md:w-1/2 bg-[#f7f7f5] p-8 md:p-12 flex flex-col justify-center"
                initial={{ opacity: 0, x: isAr ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: ease.smooth, delay: 0.1 }}
              >
                {/* Stats with CountUp */}
                <div className="flex gap-8 mb-8">
                  {project.stats.map((stat) => (
                    <div key={stat.labelEn}>
                      <p className="text-4xl font-bold text-[#C1B167]">
                        <CountUp value={stat.value} duration={1500} />
                      </p>
                      <p className="text-xs text-[#484848] mt-1 leading-tight">
                        {isAr ? stat.labelAr : stat.labelEn}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Description */}
                <p className="text-[#484848] text-sm leading-relaxed mb-8">
                  {isAr ? project.descAr : project.descEn}
                </p>
                {/* CTA */}
                <Link
                  href="/about"
                  className="btn-press inline-block self-start bg-[#0c0c0c] text-white px-7 py-3 text-sm font-semibold rounded-sm hover:bg-[#333] transition-colors"
                >
                  {isAr ? "اطلب استشارة مشروع" : "Request a Project Consultation"}
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
