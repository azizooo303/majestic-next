"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FadeUp } from "@/components/common/fade-up";

interface Finish {
  key: string;
  labelEn: string;
  labelAr: string;
  image: string;
  swatch: string;
}

const FINISHES: Finish[] = [
  { key: "wenge", labelEn: "Wenge", labelAr: "وينجي", image: "/images/website/s6-finish-wenge.jpg", swatch: "#3d2b1f" },
  { key: "walnut", labelEn: "Walnut", labelAr: "جوز", image: "/images/website/s6-finish-walnut.jpg", swatch: "#6b4c33" },
  { key: "oak", labelEn: "Oak", labelAr: "بلوط", image: "/images/website/s6-finish-oak.jpg", swatch: "#c4a97a" },
  { key: "white", labelEn: "White", labelAr: "أبيض", image: "/images/website/s6-finish-white.jpg", swatch: "#f5f4f2" },
  { key: "light-grey", labelEn: "Light Grey", labelAr: "رمادي فاتح", image: "/images/website/s6-finish-light-grey.jpg", swatch: "#c8c8c5" },
  { key: "black-chrome", labelEn: "Black Chrome", labelAr: "كروم أسود", image: "/images/website/s6-finish-black-chrome.jpg", swatch: "#1a1a1a" },
  { key: "warm-sand", labelEn: "Warm Sand", labelAr: "رملي دافئ", image: "/images/website/s6-finish-warm-sand.jpg", swatch: "#d4c4a8" },
  { key: "graphite", labelEn: "Graphite", labelAr: "جرافيت", image: "/images/website/s6-finish-graphite.jpg", swatch: "#4a4a4a" },
];

export function MaterialSelector({ isAr }: { isAr: boolean }) {
  const [selected, setSelected] = useState("wenge");
  const current = FINISHES.find((f) => f.key === selected)!;

  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <FadeUp>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-[#484848] mb-2">
              {isAr ? "الأسطح والتشطيبات" : "Materials & Finishes"}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900] tracking-tight">
              {isAr ? "حدّد التشطيب المناسب لمشروعك" : "Find the Right Finish"}
            </h2>
          </div>
        </FadeUp>

        <div className={`flex flex-col md:flex-row gap-8 md:gap-12 ${isAr ? "md:flex-row-reverse" : ""}`}>
          {/* Product render */}
          <div className="w-full md:w-[60%] relative aspect-[5/6] overflow-hidden bg-white border border-[rgba(0,0,0,0.08)]">
            {FINISHES.map((finish) => (
              <div
                key={finish.key}
                className={`absolute inset-0 transition-opacity duration-300 ${finish.key === selected ? "opacity-100" : "opacity-0"}`}
              >
                <Image
                  src={finish.image}
                  alt={isAr ? finish.labelAr : finish.labelEn}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
            ))}
            {/* Selected finish label overlay */}
            <div className="absolute bottom-4 start-4 bg-white/90 px-3 py-1.5">
              <p className="text-xs font-semibold text-gray-900]">
                {isAr ? current.labelAr : current.labelEn}
              </p>
            </div>
          </div>

          {/* Swatch panel */}
          <div className="w-full md:w-[40%] flex flex-col justify-center">
            <p className="text-sm text-[#484848] mb-5">
              {isAr
                ? "اختر من تشكيلة أسطح ماجيستيك — أخشاب، ألواح لاميناتية، ومعادن — لتحديد التشطيب الأنسب لمواصفات مشروعك."
                : "Choose from Majestic's surface range — wood tones, laminates, and metals — to identify the right finish for your project."}
            </p>

            {/* Swatches grid */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {FINISHES.map((finish) => (
                <button
                  key={finish.key}
                  onClick={() => setSelected(finish.key)}
                  className={`flex flex-col items-center gap-1.5 group cursor-pointer`}
                  aria-label={isAr ? finish.labelAr : finish.labelEn}
                  aria-pressed={selected === finish.key}
                >
                  <div
                    className={`w-full aspect-square border-2 transition-all duration-150 ${
                      selected === finish.key
                        ? "border-[#0c0c0c] scale-105"
                        : "border-transparent hover:border-[#C1B167] hover:scale-110"
                    }`}
                    style={{ backgroundColor: finish.swatch }}
                  />
                  <span className="text-[10px] text-[#484848] text-center leading-tight">
                    {isAr ? finish.labelAr : finish.labelEn}
                  </span>
                </button>
              ))}
            </div>

            <Link
              href="/about"
              className="btn-press inline-block self-start bg-white] text-white px-7 py-3 text-sm font-semibold rounded-sm hover:bg-[#333] transition-colors"
            >
              {isAr ? "اطلب عيّنات المواد" : "Request Material Samples"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
