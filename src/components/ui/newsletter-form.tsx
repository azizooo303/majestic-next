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
      <label htmlFor="newsletter-email" className="sr-only">
        {t("common.emailLabel")}
      </label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
        placeholder={t("checkout.email")}
        required
        className="flex-1 px-4 py-3 rounded-none bg-white text-[#2C2C2C]
          placeholder:text-[#3A3A3A] border border-[#D4D4D4]
          focus:border-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#2C2C2C]/30"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-[#2C2C2C] text-white font-medium rounded-none
          transition-all duration-200 hover:bg-[#3A3A3A] cursor-pointer"
      >
        {t("common.subscribe")}
      </button>
      {status === "success" && (
        <p className="sm:absolute sm:top-full sm:mt-2 text-sm text-green-700 mt-2" role="status">
          {t("common.subscribeThankYou")}
        </p>
      )}
      {status === "error" && (
        <p className="sm:absolute sm:top-full sm:mt-2 text-sm text-red-600 font-medium mt-2" role="alert">
          {t("common.invalidEmail")}
        </p>
      )}
    </form>
  );
}
