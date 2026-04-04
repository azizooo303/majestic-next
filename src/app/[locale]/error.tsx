"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const isAr = locale === "ar";

  useEffect(() => {
    console.error("[Error Boundary]", error);
  }, [error]);

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {isAr ? "حدث خطأ ما" : "Something went wrong"}
      </h1>
      <p className="text-sm text-[#484848] mb-6 max-w-sm">
        {isAr
          ? "نعتذر، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
          : "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="bg-[#2C2C2C] text-white px-6 py-2 text-sm font-semibold rounded-sm hover:bg-[#C1B167] transition-colors"
      >
        {isAr ? "حاول مرة أخرى" : "Try again"}
      </button>
    </main>
  );
}
