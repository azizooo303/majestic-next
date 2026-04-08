import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

interface BlogPost {
  slug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  date: string;
  category: string;
  categoryAr: string;
  image: string;
  body: string[];
  bodyAr: string[];
}

const POSTS: BlogPost[] = [
  {
    slug: "ergonomic-workspace-guide",
    title: "The Complete Guide to an Ergonomic Workspace",
    titleAr: "الدليل الشامل لبيئة عمل مريحة ومتوافقة مع طبيعة الجسم",
    excerpt:
      "Everything you need to know about setting up a workspace that supports posture, reduces fatigue, and boosts focus.",
    excerptAr:
      "كل ما تحتاج معرفته لتهيئة بيئة عمل تدعم وضعية الجلوس وتقلل الإجهاد وتعزز التركيز.",
    date: "2024-03-15",
    category: "Ergonomics",
    categoryAr: "الإرغونوميكس",
    image: "/images/website/blog-ergonomics.jpg",
    body: [
      "A well-designed workspace isn't just about aesthetics — it directly impacts your health, productivity, and long-term well-being. Ergonomics, the science of designing the workplace to fit the worker, has become a cornerstone of modern office planning.",
      "The foundation of any ergonomic setup starts with the chair. Look for adjustable seat height, lumbar support that follows the natural curve of your spine, and armrests that let your shoulders relax. Your feet should rest flat on the floor with knees at a 90-degree angle.",
      "Your desk height matters just as much. When seated, your forearms should be parallel to the floor with your wrists in a neutral position. Height-adjustable desks give you the flexibility to alternate between sitting and standing throughout the day — a practice that reduces back strain and improves circulation.",
      "Monitor placement is often overlooked. Position your screen at arm's length, with the top of the display at or slightly below eye level. This prevents the forward head posture that causes neck and shoulder tension over time.",
      "Finally, consider your workspace environment. Proper lighting reduces eye strain — aim for indirect, diffused light rather than harsh overhead fluorescents. Keep frequently used items within arm's reach to minimize repetitive stretching. Small changes compound into significant health benefits over months and years.",
    ],
    bodyAr: [
      "بيئة العمل المصممة جيدًا ليست مسألة جمالية فحسب — بل تؤثر بشكل مباشر على صحتك وإنتاجيتك ورفاهيتك على المدى الطويل. أصبح علم الإرغونوميكس، وهو علم تصميم مكان العمل ليتناسب مع العامل، حجر الزاوية في تخطيط المكاتب الحديثة.",
      "يبدأ الأساس في أي إعداد مريح من الكرسي. ابحث عن ارتفاع مقعد قابل للتعديل، ودعم لأسفل الظهر يتبع الانحناء الطبيعي لعمودك الفقري، ومساند ذراعين تتيح لكتفيك الاسترخاء. يجب أن تستقر قدماك بشكل مسطح على الأرض مع ركبتيك بزاوية 90 درجة.",
      "ارتفاع مكتبك مهم بنفس القدر. عند الجلوس، يجب أن تكون ساعداك موازيين للأرض مع وضع معصميك في وضع محايد. المكاتب القابلة لتعديل الارتفاع تمنحك المرونة للتبديل بين الجلوس والوقوف طوال اليوم — ممارسة تقلل من إجهاد الظهر وتحسّن الدورة الدموية.",
      "وضع الشاشة غالبًا ما يُهمل. ضع شاشتك على بُعد ذراع، مع الجزء العلوي من الشاشة عند مستوى العين أو أسفله قليلاً. هذا يمنع انحناء الرأس للأمام الذي يسبب توتر الرقبة والكتف مع مرور الوقت.",
      "أخيرًا، انتبه لبيئة مساحة عملك. الإضاءة المناسبة تقلل إجهاد العين — استهدف إضاءة غير مباشرة ومنتشرة بدلًا من الفلورسنت العلوي الحاد. احتفظ بالأغراض المستخدمة بشكل متكرر في متناول يدك لتقليل التمدد المتكرر. التغييرات الصغيرة تتراكم لتصبح فوائد صحية كبيرة على مدى الأشهر والسنوات.",
    ],
  },
  {
    slug: "executive-desk-buying-guide",
    title: "Executive Desk Buying Guide 2024",
    titleAr: "دليل اختيار المكتب التنفيذي 2024",
    excerpt:
      "Key factors to consider when investing in an executive desk — materials, size, storage, and brand reputation.",
    excerptAr:
      "أبرز العوامل التي يجب مراعاتها عند الاستثمار في مكتب تنفيذي: المواد، الحجم، التخزين، وسمعة العلامة التجارية.",
    date: "2024-02-20",
    category: "Buying Guide",
    categoryAr: "دليل الشراء",
    image: "/images/website/blog-executive-design.jpg",
    body: [
      "An executive desk is more than furniture — it's a statement about your professional identity. Whether you're outfitting a corner office or a home study, the right desk anchors the room and sets the tone for how you work.",
      "Start with size. Measure your space carefully and leave at least 90cm of clearance behind the desk for your chair to move freely. Standard executive desks range from 160cm to 200cm wide. Consider an L-shaped or U-shaped configuration if you need extra surface area for dual monitors or client-facing meetings.",
      "Material quality defines longevity. Solid wood desks — walnut, oak, or mahogany — age beautifully and signal permanence. Engineered wood with premium veneer offers a similar look at a lower price point. For a modern, minimalist aesthetic, look for desks combining metal frames with tempered glass or matte lacquer surfaces.",
      "Storage is practical and personal. Some executives prefer a clean, minimal desktop with drawers hidden below. Others need integrated cable management, built-in charging ports, and modular shelving. Think about how you actually work — not how you think you should work.",
      "Finally, invest in a brand with proven after-sales support. A quality executive desk should last 10–15 years. Ask about warranty coverage, replacement parts availability, and whether the manufacturer offers assembly and white-glove delivery.",
    ],
    bodyAr: [
      "المكتب التنفيذي أكثر من مجرد أثاث — إنه تعبير عن هويتك المهنية. سواء كنت تجهز مكتبًا زاويًا أو غرفة دراسة منزلية، فالمكتب المناسب يُرسّخ المساحة ويحدد أسلوب عملك.",
      "ابدأ بالحجم. قِس مساحتك بعناية واترك مسافة لا تقل عن 90 سم خلف المكتب لحركة الكرسي بحرية. المكاتب التنفيذية القياسية تتراوح بين 160 سم و200 سم عرضًا. فكّر في تصميم L أو U إذا كنت بحاجة لسطح إضافي لشاشتين أو اجتماعات مع العملاء.",
      "جودة المواد تحدد العمر الافتراضي. المكاتب الخشبية الصلبة — الجوز أو البلوط أو الماهوغاني — تتقادم بأناقة وتوحي بالرسوخ. الخشب المهندس مع القشرة الفاخرة يقدم مظهرًا مشابهًا بسعر أقل. للمظهر العصري البسيط، ابحث عن مكاتب تجمع بين الهياكل المعدنية والزجاج المقسّى أو الأسطح بطلاء مطفي.",
      "التخزين عملي وشخصي. بعض التنفيذيين يفضلون سطح مكتب نظيف بأدراج مخفية أسفله. البعض الآخر يحتاج إدارة كابلات مدمجة ومنافذ شحن وأرفف معيارية. فكّر في كيفية عملك فعلاً — وليس كيف تعتقد أنه يجب أن تعمل.",
      "أخيرًا، استثمر في علامة تجارية ذات دعم ما بعد البيع مُثبت. المكتب التنفيذي الجيد يجب أن يدوم 10-15 سنة. اسأل عن تغطية الضمان، وتوفر قطع الغيار، وما إذا كانت الشركة المصنعة تقدم التجميع والتوصيل المتميز.",
    ],
  },
  {
    slug: "office-design-trends-2024",
    title: "Office Design Trends Shaping Workspaces in 2024",
    titleAr: "اتجاهات تصميم المكاتب التي تُشكّل بيئات العمل في 2024",
    excerpt:
      "From biophilic design to hybrid work layouts, discover the trends redefining office environments this year.",
    excerptAr:
      "من التصميم البيوفيلي إلى تخطيطات العمل الهجين، اكتشف الاتجاهات التي تُعيد تعريف بيئات المكاتب هذا العام.",
    date: "2024-01-10",
    category: "Design Trends",
    categoryAr: "اتجاهات التصميم",
    image: "/images/website/blog-fitout.jpg",
    body: [
      "The office is no longer just a place to work — it's a destination that must earn people's commute. In 2024, the most successful workspaces are those that blend functionality with experience, creating environments employees genuinely want to be in.",
      "Biophilic design continues its rise. Natural materials, indoor greenery, and access to daylight are no longer nice-to-haves — they're expected. Studies show that offices with biophilic elements reduce stress by up to 37% and increase creativity by 15%. Think living walls, timber accents, and stone or terrazzo surfaces.",
      "The hybrid work model has fundamentally changed space planning. Fixed desks for every employee are giving way to activity-based working — quiet focus zones, collaborative hubs, phone booths for video calls, and social lounges. Furniture must be modular and reconfigurable to support this flexibility.",
      "Acoustic comfort is the sleeper trend of 2024. Open-plan offices increase collaboration but destroy concentration. Smart companies are investing in acoustic panels, sound-masking systems, and enclosed meeting pods. The goal is to give employees choice — not force everyone into the same soundscape.",
      "Color palettes are shifting from the sterile greys of the 2010s toward warmer, earthier tones — terracotta, sage green, warm beige, and muted navy. These colors create a sense of comfort and belonging, signaling that the office is a place of care, not just productivity.",
    ],
    bodyAr: [
      "لم يعد المكتب مجرد مكان للعمل — إنه وجهة يجب أن تستحق تنقل الناس إليها. في 2024، أنجح بيئات العمل هي التي تمزج بين الوظيفة والتجربة، لتخلق بيئات يرغب الموظفون فعلاً في التواجد فيها.",
      "التصميم البيوفيلي يواصل صعوده. المواد الطبيعية والنباتات الداخلية والوصول إلى ضوء النهار لم تعد رفاهيات — بل أصبحت متوقعة. تُظهر الدراسات أن المكاتب ذات العناصر البيوفيلية تقلل التوتر بنسبة تصل إلى 37% وتزيد الإبداع بنسبة 15%. فكّر في جدران النباتات الحية ولمسات الخشب وأسطح الحجر أو التيرازو.",
      "نموذج العمل الهجين غيّر تخطيط المساحات بشكل جذري. المكاتب الثابتة لكل موظف تتراجع لصالح العمل القائم على النشاط — مناطق التركيز الهادئة ومراكز التعاون وأكشاك المكالمات المرئية وصالات التواصل. يجب أن يكون الأثاث معياريًا وقابلًا لإعادة التشكيل لدعم هذه المرونة.",
      "الراحة الصوتية هي الاتجاه الخفي لعام 2024. المكاتب المفتوحة تزيد التعاون لكنها تدمر التركيز. الشركات الذكية تستثمر في الألواح الصوتية وأنظمة إخفاء الصوت وكبائن الاجتماعات المغلقة. الهدف هو منح الموظفين خيارات — وليس إجبار الجميع على نفس البيئة الصوتية.",
      "لوحات الألوان تتحول من الرمادي المعقم في العقد الثاني للألفية نحو درجات أكثر دفئًا وأرضية — التيراكوتا والأخضر الميرمية والبيج الدافئ والأزرق الداكن الهادئ. هذه الألوان تخلق شعورًا بالراحة والانتماء، مُعلنة أن المكتب مكان للعناية وليس للإنتاجية فحسب.",
    ],
  },
];

function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const isAr = locale === "ar";
  const title = isAr ? post.titleAr : post.title;
  return {
    title: `${title} | ${isAr ? "مدونة ماجستيك" : "Majestic Blog"}`,
    description: isAr ? post.excerptAr : post.excerpt,
    robots: { index: false, follow: true },
    alternates: {
      canonical: siteUrl(`/${locale}/blog/${slug}`),
      languages: {
        en: siteUrl(`/en/blog/${slug}`),
        ar: siteUrl(`/ar/blog/${slug}`),
        "x-default": siteUrl(`/en/blog/${slug}`),
      },
    },
    openGraph: {
      title,
      description: isAr ? post.excerptAr : post.excerpt,
      type: "article",
      locale: isAr ? "ar_SA" : "en_SA",
      siteName: "Majestic Furniture",
      images: [{ url: post.image, width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const isAr = locale === "ar";
  const title = isAr ? post.titleAr : post.title;
  const category = isAr ? post.categoryAr : post.category;
  const body = isAr ? post.bodyAr : post.body;

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      {/* Breadcrumb + Hero */}
      <section className="bg-white border-b border-[rgba(0,0,0,0.08)] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#484848] mb-3">
            <Link href="/" className="hover:text-[#0c0c0c] transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/blog"
              className="hover:text-[#0c0c0c] transition-colors"
            >
              {isAr ? "المدونة" : "Blog"}
            </Link>
            <span className="mx-2">/</span>
            {title}
          </p>
          <p className="text-xs uppercase tracking-wider font-semibold text-[#484848] mb-3">
            {category}
            <span className="mx-3 text-[#d1d5db]">·</span>
            {post.date}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0c0c0c] max-w-3xl">
            {title}
          </h1>
        </div>
      </section>

      {/* Article */}
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            {/* Main content */}
            <article>
              <Reveal>
                <div className="relative aspect-[16/9] overflow-hidden rounded-sm mb-10">
                  <Image
                    src={post.image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    priority
                  />
                </div>
              </Reveal>

              <div className="space-y-6">
                {body.map((paragraph, i) => (
                  <Reveal key={i}>
                    <p className="text-[#484848] leading-[1.8] text-base">
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="border border-[rgba(0,0,0,0.1)] rounded-sm p-6">
                <h2 className="text-xs uppercase tracking-widest text-[#484848] mb-4">
                  {isAr ? "تفاصيل المقال" : "Article Details"}
                </h2>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-[#484848] text-xs uppercase tracking-wider mb-0.5">
                      {isAr ? "التصنيف" : "Category"}
                    </dt>
                    <dd className="font-semibold text-[#0c0c0c]">
                      {category}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#484848] text-xs uppercase tracking-wider mb-0.5">
                      {isAr ? "تاريخ النشر" : "Published"}
                    </dt>
                    <dd className="font-semibold text-[#0c0c0c]">
                      {post.date}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="block w-full text-center bg-[#0c0c0c] text-white px-6 py-3.5 text-sm font-semibold tracking-wide rounded-sm hover:bg-[#333] transition-colors"
                >
                  {isAr ? "تواصل معنا" : "Get in Touch"}
                </Link>
                <Link
                  href="/blog"
                  className="block w-full text-center mt-3 border border-[rgba(0,0,0,0.21)] text-[#484848] px-6 py-3 text-sm font-medium rounded-sm hover:border-[#0c0c0c] hover:text-[#0c0c0c] transition-colors"
                >
                  {isAr ? "جميع المقالات" : "All Articles"}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
