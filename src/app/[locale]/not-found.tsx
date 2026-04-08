"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-extrabold text-[#0c0c0c] mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {isAr ? "الصفحة غير موجودة" : "Page not found"}
      </h1>
      <p className="text-sm text-[#484848] mb-8 max-w-sm">
        {isAr
          ? "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
          : "Sorry, the page you're looking for doesn't exist or has been moved."}
      </p>
      <Link
        href="/"
        className="bg-[#0c0c0c] text-white px-8 py-3 text-sm font-semibold rounded-sm hover:bg-[#333] transition-colors"
      >
        {isAr ? "العودة للرئيسية" : "Back to Home"}
      </Link>
    </main>
  );
}
