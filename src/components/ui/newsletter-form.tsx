"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function NewsletterForm() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
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
          focus:border-[#0c0c0c] focus:outline-none focus:ring-2 focus:ring-[#0c0c0c]/30"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-[#0c0c0c] text-white font-medium rounded-lg
          transition-all duration-200 hover:opacity-90 cursor-pointer"
      >
        {t("common.subscribe")}
      </button>
      {status === "success" && (
        <p className="sm:absolute sm:top-full sm:mt-2 text-sm text-[#0c0c0c] mt-2">
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
