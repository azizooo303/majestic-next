import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FadeUp } from "@/components/common/fade-up";
import { StaggerChildren } from "@/components/common/stagger-children";

interface Collection {
  image: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
}

const COLLECTIONS: Collection[] = [
  {
    image: "/images/website/s2-a-directorial-suite.jpg",
    nameEn: "The Directorial Suite",
    nameAr: "تجهيزات مكتب المدير التنفيذي",
    descEn: "Executive desk, credenza, chair, and conference table — one fully coordinated environment for a senior office.",
    descAr: "مكتب تنفيذي، خزانة جانبية، كرسي رئاسي، وطاولة اجتماعات — بيئة متكاملة لمكتب الإدارة العليا.",
  },
  {
    image: "/images/website/s2-b-collaborative-floor.jpg",
    nameEn: "The Collaborative Floor",
    nameAr: "تجهيزات طابق العمل المفتوح",
    descEn: "Modular workstations, task seating, and a central meeting table — configured for open-plan offices at any scale.",
    descAr: "محطات عمل مدولة، كراسي مهام، وطاولة اجتماعات مركزية — مُهيَّأة لمساحات العمل المفتوحة بأي حجم.",
  },
  {
    image: "/images/website/s2-c-reception-statement.jpg",
    nameEn: "The Reception Statement",
    nameAr: "تجهيزات منطقة الاستقبال",
    descEn: "Reception desk, lounge seating, and low table — a composed entry environment that sets the standard before a word is spoken.",
    descAr: "مكتب استقبال، جلسات بهو، وطاولة منخفضة — تجهيز كامل لمنطقة المدخل.",
  },
];

export function Collections({ isAr }: { isAr: boolean }) {
  return (
    <section className="w-full bg-[rgba(247,247,245,0.88)] py-14 md:py-20">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <FadeUp>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#484848] mb-2">
                {isAr ? "المجموعات" : "The Collections"}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900] tracking-tight">
                {isAr ? "بيئات عمل متكاملة" : "Complete Workspace Environments"}
              </h2>
              <p className="text-sm text-[#484848] mt-2">
                {isAr ? "ثلاث بيئات متناسقة، جاهزة للتحديد والتوريد." : "Three coordinated environments, ready to specify."}
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden md:block text-sm font-medium text-[#484848] hover:text-gray-900] border-b border-[#484848] pb-0.5 transition-colors"
            >
              {isAr ? "عرض جميع التشكيلات" : "View All Collections"}
            </Link>
          </div>
        </FadeUp>

        <StaggerChildren staggerDelay={0.08} yOffset={24} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLLECTIONS.map((col) => (
            <div
              key={col.nameEn}
              className="bg-white border border-[rgba(0,0,0,0.12)] overflow-hidden group transition-all duration-200 hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={col.image}
                  alt={isAr ? col.nameAr : col.nameEn}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900] text-base">
                  {isAr ? col.nameAr : col.nameEn}
                </h3>
                <p className="text-sm text-[#484848] mt-2 leading-relaxed">
                  {isAr ? col.descAr : col.descEn}
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-gray-900] hover:text-[#484848] transition-colors group/link"
                >
                  {isAr ? "استعرض التشكيلة" : "Explore the collection"}
                  <span className="transition-transform duration-200 ltr:group-hover/link:translate-x-0.5 rtl:group-hover/link:-translate-x-0.5">›</span>
                </Link>
              </div>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
