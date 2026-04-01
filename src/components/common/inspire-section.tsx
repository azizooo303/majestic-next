import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function InspireSection({ isAr }: { isAr: boolean }) {
  return (
    <section className="px-3 py-2 bg-[#D4D0C8]" aria-label="Design Inspiration">
      {/* Win2K window chrome */}
      <div
        className="mx-auto win2k-window"
        style={{ maxWidth: '1200px' }}
      >
        {/* Title bar */}
        <div className="win2k-titlebar px-2 py-0.5 text-xs flex items-center gap-1">
          <span>&#128736;</span>
          <span>{isAr ? "إلهام التصميم — مساحة العمل" : "Design Inspiration — Workspace Planning"}</span>
          <div className="flex-1" />
          <div className="flex gap-1">
            <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px]">_</button>
            <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px]">&#9633;</button>
            <button className="win2k-btn !min-w-0 !px-1.5 !py-0 text-xs leading-4 h-[18px] font-bold">&#x2715;</button>
          </div>
        </div>

        {/* Menu bar */}
        <div
          className="flex items-center px-2 py-0.5 bg-[#D4D0C8] text-xs gap-0.5"
          style={{ borderBottom: '1px solid #808080', borderTop: '1px solid #FFFFFF' }}
        >
          <button className="win2k-menu-item">File</button>
          <button className="win2k-menu-item">Edit</button>
          <button className="win2k-menu-item">View</button>
          <button className="win2k-menu-item">Help</button>
        </div>

        {/* Two-pane layout like Windows Explorer */}
        <div className="flex flex-col md:flex-row min-h-[360px] bg-[#D4D0C8]">
          {/* Left sidebar — folder tree */}
          <div
            className={`md:w-[200px] flex-shrink-0 p-2 ${isAr ? "md:order-2" : "md:order-1"}`}
            style={{
              background: '#ECE9D8',
              borderRight: isAr ? 'none' : '1px solid #808080',
              borderLeft: isAr ? '1px solid #808080' : 'none',
            }}
          >
            <p
              className="text-[10px] font-bold text-black mb-2 uppercase tracking-wide"
              style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
            >
              {isAr ? "الأقسام" : "Folders"}
            </p>
            <ul className="space-y-0.5">
              {[
                isAr ? "المكاتب التنفيذية" : "Executive Desks",
                isAr ? "كراسي مريحة" : "Ergonomic Chairs",
                isAr ? "محطات العمل" : "Workstations",
                isAr ? "طاولات الاجتماعات" : "Meeting Tables",
                isAr ? "حلول التخزين" : "Storage Solutions",
                isAr ? "الاستقبال" : "Reception Areas",
              ].map((item, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-1 px-1 py-0.5 text-[10px] cursor-pointer ${i === 0 ? "bg-[#0A246A] text-white" : "text-black hover:bg-[#0A246A] hover:text-white"}`}
                  style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
                >
                  <span>{i === 0 ? "&#128193;" : "&#128194;"}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right pane — image + text */}
          <div
            className={`flex-1 flex flex-col md:flex-row ${isAr ? "md:order-1" : "md:order-2"}`}
          >
            {/* Image */}
            <div
              className="relative flex-1 min-h-[240px]"
              style={{
                background: '#FFFFFF',
                borderTop: '2px solid #FFFFFF',
              }}
            >
              <Image
                src="/images/hero-tables.jpg"
                alt={isAr ? "أفكار لتخطيط مساحة العمل" : "Office space planning ideas"}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>

            {/* Text content */}
            <div
              className="flex flex-col justify-center p-4 md:w-[280px] flex-shrink-0 bg-[#D4D0C8]"
              style={{ borderLeft: isAr ? 'none' : '1px solid #808080', borderRight: isAr ? '1px solid #808080' : 'none' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-base"
                  style={{
                    background: '#ECE9D8',
                    border: '1px solid #808080',
                    boxShadow: 'inset 1px 1px 0 #FFFFFF',
                  }}
                >
                  &#128736;
                </div>
                <p
                  className="text-[10px] font-bold text-black uppercase tracking-wide"
                  style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
                >
                  {isAr ? "إلهام التصميم" : "Design Inspiration"}
                </p>
              </div>

              <h2
                className="text-sm font-bold text-black leading-tight mb-2"
                style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
              >
                {isAr ? "أفكار لتخطيط مساحة عملك" : "Planning Ideas For Your Workspace"}
              </h2>

              <div className="win2k-groupbox relative mb-3">
                <span className="absolute -top-2 left-2 bg-[#D4D0C8] px-1 text-[10px] font-bold text-black">
                  {isAr ? "الوصف" : "Description"}
                </span>
                <p
                  className="text-[10px] text-black leading-relaxed"
                  style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
                >
                  {isAr
                    ? "استلهم من مجموعات أثاث مكتبي مصممة لتعزيز الإنتاجية."
                    : "Get inspired by curated office furniture collections designed to elevate productivity and style."}
                </p>
              </div>

              <Link
                href="/inspirations"
                className="win2k-btn-primary text-[10px] px-4 py-1.5 font-bold no-underline text-black inline-block text-center"
              >
                {isAr ? "استكشف الإلهام" : "Explore Collection"}
              </Link>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          className="win2k-statusbar flex items-center gap-1 px-2 py-1"
          style={{ borderTop: '2px solid #FFFFFF' }}
        >
          <div className="win2k-raised px-2 py-0.5 text-xs flex-1">
            {isAr ? "&#128193; مجموعة الإلهام جاهزة" : "&#128193; Inspiration collection loaded"}
          </div>
          <div className="win2k-raised px-2 py-0.5 text-xs">6 {isAr ? "عناصر" : "items"}</div>
        </div>
      </div>
    </section>
  );
}
