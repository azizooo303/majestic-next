"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function NewsletterForm() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    // TODO: Wire to newsletter API when backend is ready
    setStatus("success");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 relative">
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
        placeholder={t("checkout.email")}
        required
        className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white
          placeholder:text-white/50 border border-white/20
          focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-gold text-gray-900 font-medium rounded-lg
          transition-all duration-200 hover:opacity-90 cursor-pointer"
      >
        {t("common.subscribe")}
      </button>
      {status === "success" && (
        <p className="sm:absolute sm:top-full sm:mt-2 text-sm text-gold mt-2">
          {t("common.subscribeThankYou")}
        </p>
      )}
      {status === "error" && (
        <p className="sm:absolute sm:top-full sm:mt-2 text-sm text-red-400 mt-2">
          {t("common.invalidEmail")}
        </p>
      )}
    </form>
  );
}
