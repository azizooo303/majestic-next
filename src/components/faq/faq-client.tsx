"use client";

import { useState } from "react";
import { Reveal } from "@/components/common/reveal";

// Category labels must match the values assigned during SSR (passed as props)
export interface FaqItem {
  q: string;
  a: string;
  category?: string;
}

interface FaqClientProps {
  faqs: FaqItem[];
  categories: string[];
  // Category values in English used for matching (parallel array to categories labels)
  categoryValues: string[];
  isAr: boolean;
}

export function FaqClient({ faqs, categories, categoryValues, isAr }: FaqClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCategoryValue = categoryValues[activeIndex];

  const filtered =
    activeIndex === 0
      ? faqs
      : faqs.filter((item) => {
          if (!item.category) return false;
          return item.category.toLowerCase() === activeCategoryValue.toLowerCase();
        });

  return (
    <>
      {/* Category tabs */}
      <Reveal>
        <div
          className="flex gap-2 flex-wrap mb-10"
          role="tablist"
          aria-label={isAr ? "تصفية الأسئلة" : "FAQ categories"}
        >
          {categories.map((cat, i) => (
            <button
              key={cat}
              role="tab"
              aria-selected={i === activeIndex}
              onClick={() => setActiveIndex(i)}
              className={`px-4 py-2 text-sm font-medium rounded-none border transition-colors ${
                i === activeIndex
                  ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                  : "bg-white text-[#3A3A3A] border-[#D4D4D4] hover:border-[#2C2C2C] hover:text-[#2C2C2C]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Accordion */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Reveal>
            <p className="text-[#3A3A3A] text-sm py-8 text-center">
              {isAr ? "لا توجد أسئلة في هذه الفئة." : "No questions in this category yet."}
            </p>
          </Reveal>
        ) : (
          filtered.map((faq, i) => (
            <Reveal key={i}>
              <details
                className="group border border-[#D4D4D4] rounded-none overflow-hidden"
                open={i === 0}
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none select-none hover:bg-white transition-colors">
                  <span className="font-semibold text-[#2C2C2C] text-sm md:text-base pr-4">
                    {faq.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-6 h-6 border border-[#D4D4D4] rounded-none flex items-center justify-center text-xs font-bold text-[#3A3A3A] group-open:bg-[#2C2C2C] group-open:text-white group-open:border-[#2C2C2C] transition-colors"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 pt-1 border-t border-[#D4D4D4]">
                  <p className="text-[#3A3A3A] leading-relaxed text-sm">{faq.a}</p>
                </div>
              </details>
            </Reveal>
          ))
        )}
      </div>
    </>
  );
}
