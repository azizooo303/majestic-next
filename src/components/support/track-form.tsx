"use client";
import { useState } from "react";

interface TrackFormProps {
  isAr: boolean;
}

interface TrackStep {
  key: string;
  label: string;
  done: boolean;
  active: boolean;
}

interface TrackResult {
  found: boolean;
  orderNumber?: string;
  status?: string;
  statusLabel?: string;
  date_created?: string;
  steps?: TrackStep[];
}

export function TrackForm({ isAr }: TrackFormProps) {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) {
      setError(
        isAr
          ? "يرجى إدخال رقم الطلب والبريد الإلكتروني."
          : "Please enter your order number and email address."
      );
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `/api/orders/track?number=${encodeURIComponent(orderNumber.trim())}&email=${encodeURIComponent(email.trim())}`
      );
      const data: TrackResult = await res.json();

      if (!data.found) {
        setError(
          isAr
            ? "لم يتم العثور على الطلب. يرجى التحقق من رقم الطلب والبريد الإلكتروني."
            : "Order not found. Please check your order number and email."
        );
      } else {
        setResult(data);
      }
    } catch {
      setError(
        isAr
          ? "حدث خطأ. يرجى المحاولة لاحقاً."
          : "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-[rgba(0,0,0,0.21)] rounded-sm px-4 py-3 text-sm text-gray-900 placeholder:text-[#999] focus:outline-none focus:border-gray-900 bg-white transition-colors";

  if (result?.found && result.steps) {
    return (
      <div className="border border-[rgba(0,0,0,0.21)] rounded-sm p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <p className="text-xs text-[#484848] uppercase tracking-widest">
              {isAr ? "رقم الطلب" : "Order Number"}
            </p>
            <p className="text-base font-bold text-gray-900 mt-0.5">{result.orderNumber}</p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider border border-[rgba(0,0,0,0.21)] px-3 py-1 rounded-sm text-[#484848]">
            {result.statusLabel}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-0 sm:gap-0" role="list" aria-label={isAr ? "حالة الطلب" : "Order status"}>
          {result.steps.map((step, index) => {
            const bgClass = step.done
              ? "bg-gray-400"
              : step.active
              ? "bg-gray-600"
              : "bg-gray-200";

            return (
              <div
                key={step.key}
                role="listitem"
                className="flex sm:flex-1 flex-row sm:flex-col items-center gap-3 sm:gap-0"
              >
                <div className="flex sm:flex-col items-center flex-shrink-0">
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bgClass}`}
                    aria-current={step.active ? "step" : undefined}
                  >
                    {step.done && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {step.active && (
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" aria-hidden="true" />
                    )}
                  </div>
                  {index < result.steps!.length - 1 && (
                    <>
                      <div className="sm:hidden w-px h-6 bg-[rgba(0,0,0,0.12)] mx-auto" />
                      <div className="hidden sm:block flex-1 h-px bg-[rgba(0,0,0,0.12)] w-full mt-4" />
                    </>
                  )}
                </div>
                <p className={`text-xs font-medium mt-0 sm:mt-2 text-center ${step.active ? "text-gray-900" : "text-[#484848]"}`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => { setResult(null); setOrderNumber(""); setEmail(""); }}
          className="mt-8 text-sm text-[#484848] underline underline-offset-2 hover:text-gray-900 transition-colors"
        >
          {isAr ? "البحث عن طلب آخر" : "Track another order"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border border-[rgba(0,0,0,0.21)] rounded-sm p-6 md:p-8"
      aria-label={isAr ? "نموذج تتبع الطلب" : "Order tracking form"}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="order-number"
            className="block text-sm font-semibold text-gray-900 mb-1.5"
          >
            {isAr ? "رقم الطلب" : "Order Number"}
          </label>
          <input
            id="order-number"
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder={isAr ? "مثال: MAJ-12345" : "e.g. MAJ-12345"}
            className={inputClass}
            autoComplete="off"
          />
        </div>
        <div>
          <label
            htmlFor="track-email"
            className="block text-sm font-semibold text-gray-900 mb-1.5"
          >
            {isAr ? "البريد الإلكتروني" : "Email Address"}
          </label>
          <input
            id="track-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isAr ? "أدخل بريدك الإلكتروني" : "Enter your email address"}
            className={inputClass}
            autoComplete="email"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-press w-full bg-white text-gray-900 border border-gray-900 py-3.5 font-semibold text-sm
            tracking-wide rounded-sm hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {loading
            ? (isAr ? "جارٍ البحث..." : "Tracking...")
            : (isAr ? "تتبع الطلب" : "Track Order")}
        </button>
      </div>
    </form>
  );
}
