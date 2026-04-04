"use client";

import { useEffect } from "react";

// Catches errors in the root layout itself
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error Boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          A critical error occurred. Please refresh the page.
        </p>
        <button
          onClick={reset}
          className="bg-[#2C2C2C] text-white px-6 py-2 text-sm font-semibold rounded-sm hover:bg-[#C1B167] transition-colors"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
