"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { FadeDown } from "@/components/common/fade-down";
import { CountUp } from "@/components/common/count-up";
import { ease } from "@/lib/motion";
import type { SanityProjectCaseStudy } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";

interface Props {
  isAr: boolean;
  projects: SanityProjectCaseStudy[];
  labelEn?: string;
  labelAr?: string;
  headingEn?: string;
  headingAr?: string;
}

export function ProjectScale({
  isAr,
  projects,
  labelEn = "Completed Projects",
  labelAr = "مشاريع منجزة",
  headingEn = "Built for Institutional Scale.",
  headingAr = "صُنع للعمل المؤسسي.",
}: Props) {
  return (
    <section className="relative w-full bg-white py-16 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <FadeDown>
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-[#3A3A3A] mb-2">
              {isAr ? labelAr : labelEn}
            </p>
            <h2 className="text-2xl md:text-[36px] font-bold text-[#2C2C2C] tracking-[-0.02em]">
              {isAr ? headingAr : headingEn}
            </h2>
          </div>
        </FadeDown>

        <div className="flex flex-col gap-12">
          {projects.map((project, i) => {
            const imageUrl = project.image
              ? urlFor(project.image).width(800).height(600).url()
              : `/images/website/s4-a-workfloor-scale.jpg`;
            return (
              <div
                key={project._id}
                className={`flex flex-col md:flex-row gap-0 overflow-hidden border border-[#D4D4D4] ${isAr ? "md:flex-row-reverse" : ""}`}
              >
                <motion.div
                  className="relative w-full md:w-1/2 aspect-[16/9] md:aspect-auto min-h-[320px]"
                  initial={{ opacity: 0, x: isAr ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: ease.smooth }}
                >
                  <Image
                    src={imageUrl}
                    alt={isAr ? project.titleAr : project.titleEn}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>

                <motion.div
                  className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center"
                  initial={{ opacity: 0, x: isAr ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: ease.smooth, delay: 0.1 }}
                >
                  {project.stats && project.stats.length > 0 && (
                    <div className="flex gap-8 mb-8">
                      {project.stats.map((stat) => (
                        <div key={stat._key}>
                          <p className="text-4xl font-bold text-[#2C2C2C]">
                            <CountUp value={stat.value} duration={1500} />
                          </p>
                          <p className="text-xs text-[#3A3A3A] mt-1 leading-tight">
                            {isAr ? stat.labelAr : stat.labelEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[#3A3A3A] text-sm leading-relaxed mb-8">
                    {isAr ? project.descriptionAr : project.descriptionEn}
                  </p>
                  <Link
                    href="/about"
                    className="inline-block self-start bg-[#2C2C2C] text-white px-7 py-3 min-h-[44px] text-sm font-semibold rounded-none hover:bg-[#3A3A3A] transition-colors"
                  >
                    {isAr ? "اطلب استشارة مشروع" : "Request a Project Consultation"}
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
