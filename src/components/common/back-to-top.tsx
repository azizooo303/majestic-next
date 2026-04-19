"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 end-4 z-40 w-11 h-11 bg-[#2C2C2C] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#3A3A3A] transition-colors"
      aria-label="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  );
}
