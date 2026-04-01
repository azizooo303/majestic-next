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
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2" style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}>
      <label className="text-xs text-black text-start" htmlFor="newsletter-email">
        {t("checkout.email")}:
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
          placeholder="user@example.com"
          required
          className="flex-1 win2k-sunken bg-white text-black text-xs px-2 py-1 outline-none min-w-0"
        />
        <button
          type="submit"
          className="win2k-btn-primary text-xs px-4 py-1"
        >
          {t("common.subscribe")}
        </button>
      </div>
      {status === "success" && (
        <p className="text-xs text-[#006600] flex items-center gap-1">
          <span>&#10003;</span> {t("common.subscribeThankYou")}
        </p>
      )}
      {status === "error" && (
        <p className="text-xs text-[#CC0000] flex items-center gap-1">
          <span>&#9888;</span> {t("common.invalidEmail")}
        </p>
      )}
    </form>
  );
}
