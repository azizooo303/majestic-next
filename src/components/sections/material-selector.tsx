"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FadeUp } from "@/components/common/fade-up";
import type { SanityMaterialFinish } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";

interface Props {
  isAr: boolean;
  finishes: SanityMaterialFinish[];
  labelEn?: string;
  labelAr?: string;
  headingEn?: string;
  headingAr?: string;
}

export function MaterialSelector({
  isAr,
  finishes,
  labelEn = "Materials & Finishes",
  labelAr = "الأسطح والتشطيبات",
  headingEn = "Find the Right Finish",
  headingAr = "حدّد التشطيب المناسب لمشروعك",
}: Props) {
  const [selectedId, setSelectedId] = useState(finishes[0]?._id ?? "");
  const current = finishes.find((f) => f._id === selectedId) ?? finishes[0];

  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <FadeUp>
          <div className="mb-8">
            <p className="text-xs tracking-widest text-[#3A3A3A] mb-2">
              {isAr ? labelAr : labelEn}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight">
              {isAr ? headingAr : headingEn}
            </h2>
          </div>
        </FadeUp>

        <div className={`flex flex-col md:flex-row gap-8 md:gap-12 ${isAr ? "md:flex-row-reverse" : ""}`}>
          {/* Product render */}
          <div className="w-full md:w-[60%] relative aspect-[5/6] overflow-hidden bg-white border border-[#D4D4D4]">
            {finishes.map((finish) => {
              const imageUrl = finish.image
                ? urlFor(finish.image).width(800).height(960).url()
                : null;
              return (
                <div
                  key={finish._id}
                  className={`absolute inset-0 transition-opacity duration-300 ${finish._id === selectedId ? "opacity-100" : "opacity-0"}`}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={isAr ? finish.nameAr : finish.nameEn}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ backgroundColor: finish.swatchHex ?? "#f5f4f2" }} />
                  )}
                </div>
              );
            })}
            {current && (
              <div className="absolute bottom-4 start-4 bg-white/90 px-3 py-1.5">
                <p className="text-xs font-semibold text-[#2C2C2C]">
                  {isAr ? current.nameAr : current.nameEn}
                </p>
              </div>
            )}
          </div>

          {/* Swatch panel */}
          <div className="w-full md:w-[40%] flex flex-col justify-center">
            <p className="text-sm text-[#3A3A3A] mb-5">
              {isAr
                ? "اختر من تشكيلة أسطح ماجستيك — أخشاب، ألواح لاميناتية، ومعادن — لتحديد التشطيب الأنسب لمواصفات مشروعك."
                : "Choose from Majestic's surface range — wood tones, laminates, and metals — to identify the right finish for your project."}
            </p>

            <div className="grid grid-cols-4 gap-3 mb-8">
              {finishes.map((finish) => (
                <button
                  key={finish._id}
                  onClick={() => setSelectedId(finish._id)}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  aria-label={isAr ? finish.nameAr : finish.nameEn}
                  aria-pressed={selectedId === finish._id}
                >
                  <div
                    className={`w-full aspect-square border-2 transition-all duration-150 ${
                      selectedId === finish._id
                        ? "border-[#2C2C2C] scale-105"
                        : "border-transparent hover:border-[#2C2C2C] hover:scale-110"
                    }`}
                    style={{ backgroundColor: finish.swatchHex ?? "#ccc" }}
                  />
                  <span className="text-[10px] text-[#3A3A3A] text-center leading-tight">
                    {isAr ? finish.nameAr : finish.nameEn}
                  </span>
                </button>
              ))}
            </div>

            <Link
              href="/about"
              className="btn-press inline-block self-start bg-[#2C2C2C] text-white px-7 py-3 text-sm font-semibold rounded-none hover:bg-[#3A3A3A] transition-colors"
            >
              {isAr ? "اطلب عيّنات المواد" : "Request Material Samples"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
