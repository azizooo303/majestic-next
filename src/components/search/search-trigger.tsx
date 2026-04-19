"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function SearchTrigger() {
  const t = useTranslations();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      const focusable = e.currentTarget.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-700 hover:text-[#2C2C2C] transition-colors cursor-pointer"
        aria-label={t("common.search")}
      >
        <Search className="w-5 h-5 stroke-[2]" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-none shadow-[0_8px_24px_rgba(0,0,0,0.12)] w-full max-w-lg mx-4 p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-800 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("common.searchPlaceholder")}
                className="flex-1 text-lg text-[#2C2C2C] placeholder:text-gray-800/50 outline-none"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-800 hover:text-[#2C2C2C] cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
