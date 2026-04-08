"use client";

import { useSyncExternalStore, useCallback } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "mj_cookie_consent";

let consentListeners: Array<() => void> = [];

function subscribeConsent(cb: () => void) {
  consentListeners.push(cb);
  return () => { consentListeners = consentListeners.filter((l) => l !== cb); };
}

function getConsentSnapshot() {
  try {
    return !localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

function getConsentServerSnapshot() {
  return false;
}

export function CookieConsent() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const visible = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getConsentServerSnapshot);

  const accept = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // silent
    }
    consentListeners.forEach((l) => l());
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[rgba(0,0,0,0.12)] px-4 py-4 md:py-3">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-[#484848] text-center sm:text-start">
          {isAr
            ? "نستخدم ملفات تعريف الارتباط لتحسين تجربتك. بالاستمرار، أنت توافق على "
            : "We use cookies to improve your experience. By continuing, you agree to our "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-[#0c0c0c] transition-colors"
          >
            {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="shrink-0 bg-[#0c0c0c] text-white px-6 py-2.5 text-sm font-semibold rounded-sm hover:bg-[#333] transition-colors"
        >
          {isAr ? "موافق" : "Accept"}
        </button>
      </div>
    </div>
  );
}
