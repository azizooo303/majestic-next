"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase";

interface ContactFormProps {
  isAr: boolean;
  source?: "contact" | "quotation";
}

export function ContactForm({ isAr, source = "contact" }: ContactFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabaseClient.from("contact_submissions").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      message: form.message,
      source,
    });

    if (error) {
      console.error("[ContactForm] Supabase insert error:", error);
      setErrorMsg(
        isAr
          ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى."
          : "Something went wrong. Please try again."
      );
      setStatus("error");
      return;
    }

    setStatus("success");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  }

  const fieldClass =
    "w-full border border-[rgba(0,0,0,0.21)] rounded-sm px-4 py-3 text-sm text-[#0c0c0c] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0c0c0c] transition-colors bg-white";

  const subjects = isAr
    ? [
        { value: "", label: "اختر الموضوع" },
        { value: "general", label: "استفسار عام" },
        { value: "quote", label: "طلب عرض سعر" },
        { value: "aftersales", label: "ما بعد البيع" },
        { value: "other", label: "أخرى" },
      ]
    : [
        { value: "", label: "Select a subject" },
        { value: "general", label: "General Inquiry" },
        { value: "quote", label: "Quote Request" },
        { value: "aftersales", label: "After Sales" },
        { value: "other", label: "Other" },
      ];

  if (status === "success") {
    return (
      <div className="rounded-sm border border-[rgba(0,0,0,0.12)] bg-[#fafafa] px-6 py-10 text-center space-y-3">
        <p className="text-2xl">✓</p>
        <p className="font-semibold text-[#0c0c0c] text-base">
          {isAr ? "تم إرسال رسالتك بنجاح" : "Message sent successfully"}
        </p>
        <p className="text-sm text-[#484848]">
          {isAr
            ? "سيتواصل معك فريقنا خلال يوم عمل."
            : "Our team will get back to you within one business day."}
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm text-[#484848] border-b border-[#484848] pb-0.5 hover:text-[#0c0c0c] transition-colors"
        >
          {isAr ? "إرسال رسالة أخرى" : "Send another message"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="block text-xs font-semibold text-[#0c0c0c] uppercase tracking-wider mb-1.5">
          {isAr ? "الاسم" : "Name"}
          <span className="text-[#e53e3e] ml-1">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder={isAr ? "اسمك الكامل" : "Your full name"}
          className={fieldClass}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#0c0c0c] uppercase tracking-wider mb-1.5">
          {isAr ? "البريد الإلكتروني" : "Email"}
          <span className="text-[#e53e3e] ml-1">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder={isAr ? "بريدك الإلكتروني" : "your@email.com"}
          className={fieldClass}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#0c0c0c] uppercase tracking-wider mb-1.5">
          {isAr ? "رقم الهاتف" : "Phone"}
          <span className="text-[#484848] ml-1 font-normal normal-case">
            ({isAr ? "اختياري" : "optional"})
          </span>
        </label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder={isAr ? "+966 5x xxx xxxx" : "+966 5x xxx xxxx"}
          className={fieldClass}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#0c0c0c] uppercase tracking-wider mb-1.5">
          {isAr ? "الموضوع" : "Subject"}
          <span className="text-[#e53e3e] ml-1">*</span>
        </label>
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          className={fieldClass}
        >
          {subjects.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#0c0c0c] uppercase tracking-wider mb-1.5">
          {isAr ? "الرسالة" : "Message"}
          <span className="text-[#e53e3e] ml-1">*</span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder={isAr ? "اكتب رسالتك هنا..." : "Write your message here..."}
          className={`${fieldClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-[#e53e3e] bg-[#fff5f5] border border-[#fed7d7] rounded-sm px-4 py-3">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-press w-full bg-[#0c0c0c] text-white px-8 py-3.5 font-semibold text-sm tracking-wide rounded-sm hover:bg-[#333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading"
          ? isAr ? "جارٍ الإرسال..." : "Sending..."
          : isAr ? "إرسال الرسالة" : "Send Message"}
      </button>
    </form>
  );
}
