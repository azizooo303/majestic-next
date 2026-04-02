import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FadeUp } from "@/components/common/fade-up";
import { StaggerChildren } from "@/components/common/stagger-children";

interface Article {
  image: string;
  tagEn: string;
  tagAr: string;
  titleEn: string;
  titleAr: string;
  date: string;
}

const ARTICLES: Article[] = [
  {
    image: "/images/website/s7-a-executive-floor-article.jpg",
    tagEn: "Design Standards",
    tagAr: "معايير التصميم",
    titleEn: "Designing the Executive Floor: Standards for Saudi Corporate Offices",
    titleAr: "تصميم الطابق التنفيذي: معايير المكاتب المؤسسية السعودية",
    date: "April 2026",
  },
  {
    image: "/images/website/s7-b-height-adjustable-article.jpg",
    tagEn: "Ergonomics",
    tagAr: "الإرغونوميا",
    titleEn: "Why Height-Adjustable Desks Are Now a Specification Requirement",
    titleAr: "لماذا أصبحت المكاتب القابلة للضبط متطلباً رسمياً في مواصفات التجهيز",
    date: "March 2026",
  },
  {
    image: "/images/website/s7-c-fit-out-brief-article.jpg",
    tagEn: "Project Planning",
    tagAr: "تخطيط المشاريع",
    titleEn: "Complete Workspace: How to Brief a Full Office Fit-Out",
    titleAr: "بيئة العمل المتكاملة: كيف تُعدّ كراسة الإحاطة لمشروع تجهيز مكاتب كامل",
    date: "March 2026",
  },
];

export function InsightEditorial({ isAr }: { isAr: boolean }) {
  return (
    <section className="w-full bg-[#f2f2f2] py-14 md:py-20">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <FadeUp>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#484848] mb-2">
                {isAr ? "مقالات تقنية" : "Insights"}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0c0c0c] tracking-tight">
                {isAr ? "معيار بيئة العمل" : "The Workspace Standard"}
              </h2>
            </div>
            <Link
              href="/insights"
              className="hidden md:block text-sm font-medium text-[#484848] hover:text-[#0c0c0c] border-b border-[#484848] pb-0.5 transition-colors"
            >
              {isAr ? "جميع المقالات" : "All Articles"}
            </Link>
          </div>
        </FadeUp>

        <StaggerChildren staggerDelay={0.08} yOffset={24} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map((article) => (
            <div key={article.titleEn} className="bg-white border border-[rgba(0,0,0,0.12)] overflow-hidden group">
              <div className="relative aspect-[1200/630] overflow-hidden">
                <Image
                  src={article.image}
                  alt={isAr ? article.titleAr : article.titleEn}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#484848] font-medium">
                    {isAr ? article.tagAr : article.tagEn}
                  </span>
                  <span className="text-[10px] text-[#aaaaaa]">{article.date}</span>
                </div>
                <h3 className="text-sm font-bold text-[#0c0c0c] leading-snug mb-4">
                  {isAr ? article.titleAr : article.titleEn}
                </h3>
                <Link
                  href="/insights"
                  className="text-xs font-semibold text-[#0c0c0c] hover:text-[#484848] transition-colors inline-flex items-center gap-1 group/link"
                >
                  {isAr ? "اقرأ" : "Read"}
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
