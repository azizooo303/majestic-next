import { Reveal } from "@/components/common/reveal";
import { StaggerGrid } from "@/components/common/stagger-grid";

interface Pillar {
  number: string;
  headingEn: string;
  headingAr: string;
  bodyEn: string;
  bodyAr: string;
}

const PILLARS: Pillar[] = [
  {
    number: "01",
    headingEn: "Precision",
    headingAr: "الدقة في التصنيع",
    bodyEn: "Every product meets defined structural and finish standards. We do not compromise on tolerances, materials, or assembly quality.",
    bodyAr: "كل منتج يستوفي المعايير الإنشائية ومواصفات التشطيب المحددة. لا تساهل في فجوات الضبط، ولا في المواد، ولا في جودة التجميع.",
  },
  {
    number: "02",
    headingEn: "Scale",
    headingAr: "قدرة التوسع",
    bodyEn: "From a single executive office to a multi-floor corporate fit-out, our systems are built to grow with your organisation.",
    bodyAr: "من مكتب تنفيذي واحد إلى تجهيز طوابق متعددة لمؤسسة كبرى — أنظمتنا تستوعب أي نطاق.",
  },
  {
    number: "03",
    headingEn: "Partnership",
    headingAr: "الشراكة في المشروع",
    bodyEn: "We work alongside architects, procurement teams, and facilities managers from brief to installation. The relationship does not end at delivery.",
    bodyAr: "نعمل مع المهندسين المعماريين وفرق المشتريات ومديري المرافق — من مرحلة الإحاطة حتى التركيب النهائي. العلاقة لا تنتهي عند التسليم.",
  },
  {
    number: "04",
    headingEn: "Regional Expertise",
    headingAr: "خبرة إقليمية متخصصة",
    bodyEn: "Deep knowledge of Saudi corporate environments, spatial norms, and procurement requirements — built over a decade of institutional projects.",
    bodyAr: "معرفة معمّقة بالبيئات المؤسسية السعودية ومتطلبات المشتريات والمعايير الفضائية — مكتسبة عبر عقد من مشاريع التجهيز المؤسسي.",
  },
];

export function BrandStandard({ isAr }: { isAr: boolean }) {
  return (
    <section className="relative w-full bg-white py-16 overflow-hidden border-t border-[rgba(0,0,0,0.08)]">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-widest text-[#484848] mb-3">
              {isAr ? "معيار ماجستيك" : "The Majestic Standard"}
            </p>
            <h2 className="text-2xl md:text-[36px] font-bold text-[#0c0c0c] tracking-[-0.02em]">
              {isAr ? "أسس عملنا" : "What We Are Built On"}
            </h2>
            <p className="text-[#484848] text-sm mt-3">
              {isAr ? "أربعة معايير تحكم كل مشروع نتولاه." : "Four commitments that define every project we take on."}
            </p>
          </div>
        </Reveal>

        <StaggerGrid
          stagger={0.1}
          isRTL={isAr}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {PILLARS.map((pillar) => (
            <div key={pillar.number} className="bg-white border border-[rgba(0,0,0,0.21)] p-8 md:p-10">
              <p className="text-4xl font-bold text-[#0c0c0c] mb-5">{pillar.number}</p>
              <h3 className="text-[#0c0c0c] font-bold text-base mb-3">
                {isAr ? pillar.headingAr : pillar.headingEn}
              </h3>
              <p className="text-[#484848] text-sm leading-relaxed">
                {isAr ? pillar.bodyAr : pillar.bodyEn}
              </p>
            </div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
