"use client";

import { useState, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Check, ShieldCheck, ChevronLeft } from "lucide-react";
import Image from "next/image";

type Step = 1 | 2 | 3;
type PaymentMethod = "card" | "applepay" | "tabby" | "tamara";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  instructions: string;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
}

const INITIAL_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  region: "",
  instructions: "",
  paymentMethod: "card",
  cardNumber: "",
  expiry: "",
  cvv: "",
  cardName: "",
};

const VAT_RATE = 0.15;

const ORDER_ITEMS = [
  {
    id: 1,
    name: "Enigma Executive Desk",
    nameAr: "مكتب إنيجما التنفيذي",
    price: 2850,
    image: "/images/hero-desks.jpg",
  },
  {
    id: 2,
    name: "ErgoMax Pro Chair",
    nameAr: "كرسي إرجوماكس برو",
    price: 1250,
    image: "/images/hero-seating.jpg",
  },
];

const REGIONS = [
  { value: "riyadh", en: "Riyadh", ar: "الرياض" },
  { value: "jeddah", en: "Jeddah", ar: "جدة" },
  { value: "dammam", en: "Dammam", ar: "الدمام" },
  { value: "mecca", en: "Mecca", ar: "مكة المكرمة" },
  { value: "medina", en: "Medina", ar: "المدينة المنورة" },
];

const fmt = (n: number) =>
  `SAR ${n.toLocaleString("en-SA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

function StepIndicator({ step, isAr }: { step: Step; isAr: boolean }) {
  const steps = [
    { num: 1 as Step, en: "Address", ar: "العنوان" },
    { num: 2 as Step, en: "Payment", ar: "الدفع" },
    { num: 3 as Step, en: "Confirmation", ar: "التأكيد" },
  ];

  return (
    <nav
      aria-label={isAr ? "خطوات الدفع" : "Checkout steps"}
      className="flex items-center justify-center gap-0 mb-10"
    >
      {steps.map((s, idx) => {
        const isActive = step === s.num;
        const isComplete = step > s.num;

        return (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                  isActive
                    ? "bg-[#0c0c0c] text-white"
                    : isComplete
                    ? "bg-[#484848] text-white"
                    : "border border-[rgba(0,0,0,0.21)] text-[#9ca3af]",
                ].join(" ")}
                aria-current={isActive ? "step" : undefined}
              >
                {isComplete ? <Check size={14} strokeWidth={2.5} /> : s.num}
              </div>
              <span
                className={[
                  "text-xs whitespace-nowrap",
                  isActive
                    ? "font-bold text-[#0c0c0c]"
                    : isComplete
                    ? "font-medium text-[#484848]"
                    : "text-[#9ca3af]",
                ].join(" ")}
              >
                {isAr ? s.ar : s.en}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={[
                  "h-px w-16 md:w-24 mx-2 mb-5 transition-colors",
                  step > s.num ? "bg-[#484848]" : "bg-[rgba(0,0,0,0.12)]",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

function OrderSummary({ isAr }: { isAr: boolean }) {
  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  return (
    <aside
      aria-label={isAr ? "ملخص الطلب" : "Order summary"}
      className="w-full lg:w-[40%] lg:sticky lg:top-[176px]"
    >
      <div className="border border-[rgba(0,0,0,0.21)] rounded-sm p-6 bg-white">
        <h2 className="text-base font-bold text-[#0c0c0c] mb-5 pb-4 border-b border-[rgba(0,0,0,0.1)]">
          {isAr ? "ملخص الطلب" : "Order Summary"}
        </h2>

        <div className="flex flex-col gap-4 mb-5 pb-5 border-b border-[rgba(0,0,0,0.08)]">
          {ORDER_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 flex-shrink-0 border border-[rgba(0,0,0,0.1)] rounded-sm overflow-hidden">
                <Image
                  src={item.image}
                  alt={isAr ? item.nameAr : item.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0c0c0c] leading-snug truncate">
                  {isAr ? item.nameAr : item.name}
                </p>
              </div>
              <p className="text-sm font-semibold text-[#0c0c0c] flex-shrink-0">
                {fmt(item.price)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between text-[#484848]">
            <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#484848]">
            <span>{isAr ? "الشحن" : "Shipping"}</span>
            <span className="text-[#0c0c0c] font-medium">
              {isAr ? "مجاناً" : "Free"}
            </span>
          </div>
          <div className="flex justify-between text-[#484848]">
            <span>{isAr ? "ضريبة القيمة المضافة (15%)" : "VAT (15%)"}</span>
            <span>{fmt(vat)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#0c0c0c] pt-3 border-t border-[rgba(0,0,0,0.1)]">
            <span>{isAr ? "الإجمالي" : "Total"}</span>
            <span>{fmt(total)}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-[rgba(0,0,0,0.08)] flex items-center gap-2 justify-center">
          <ShieldCheck size={13} className="text-[#484848] flex-shrink-0" />
          <span className="text-xs text-[#484848]">
            {isAr ? "مؤمّن بـ SSL" : "Secured by SSL"}
          </span>
        </div>
      </div>
    </aside>
  );
}

function Field({
  label,
  labelAr,
  isAr,
  required,
  children,
}: {
  label: string;
  labelAr: string;
  isAr: boolean;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#484848] uppercase tracking-wide">
        {isAr ? labelAr : label}
        {required && (
          <span className="text-[#e53e3e] ms-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "border border-[rgba(0,0,0,0.21)] rounded-sm px-4 py-3 w-full text-sm text-[#0c0c0c] bg-white placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0c0c0c] focus:ring-1 focus:ring-[#0c0c0c] transition-colors";

function StepAddress({
  form,
  onChange,
  onContinue,
  isAr,
}: {
  form: FormState;
  onChange: (k: keyof FormState, v: string) => void;
  onContinue: () => void;
  isAr: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-[#0c0c0c]">
        {isAr ? "عنوان التوصيل" : "Delivery Address"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name" labelAr="الاسم الأول" isAr={isAr} required>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder={isAr ? "الاسم الأول" : "First name"}
            className={inputCls}
            autoComplete="given-name"
          />
        </Field>
        <Field label="Last Name" labelAr="اسم العائلة" isAr={isAr} required>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder={isAr ? "اسم العائلة" : "Last name"}
            className={inputCls}
            autoComplete="family-name"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Email" labelAr="البريد الإلكتروني" isAr={isAr} required>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="example@email.com"
            className={inputCls}
            autoComplete="email"
            dir="ltr"
          />
        </Field>
        <Field label="Phone" labelAr="رقم الجوال" isAr={isAr} required>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+966 5X XXX XXXX"
            className={inputCls}
            autoComplete="tel"
            dir="ltr"
          />
        </Field>
      </div>

      <Field label="Address Line 1" labelAr="العنوان" isAr={isAr} required>
        <input
          type="text"
          value={form.address1}
          onChange={(e) => onChange("address1", e.target.value)}
          placeholder={isAr ? "الشارع، رقم المبنى" : "Street address, building number"}
          className={inputCls}
          autoComplete="address-line1"
        />
      </Field>

      <Field label="Address Line 2" labelAr="العنوان (اختياري)" isAr={isAr}>
        <input
          type="text"
          value={form.address2}
          onChange={(e) => onChange("address2", e.target.value)}
          placeholder={isAr ? "الشقة، الطابق، إلخ (اختياري)" : "Apartment, floor, etc. (optional)"}
          className={inputCls}
          autoComplete="address-line2"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="City" labelAr="المدينة" isAr={isAr} required>
          <input
            type="text"
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder={isAr ? "المدينة" : "City"}
            className={inputCls}
            autoComplete="address-level2"
          />
        </Field>
        <Field label="Region" labelAr="المنطقة" isAr={isAr} required>
          <select
            value={form.region}
            onChange={(e) => onChange("region", e.target.value)}
            className={inputCls + " cursor-pointer"}
            aria-label={isAr ? "المنطقة" : "Region"}
          >
            <option value="" disabled>
              {isAr ? "اختر المنطقة" : "Select region"}
            </option>
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {isAr ? r.ar : r.en}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Special Instructions" labelAr="تعليمات خاصة" isAr={isAr}>
        <textarea
          value={form.instructions}
          onChange={(e) => onChange("instructions", e.target.value)}
          placeholder={
            isAr
              ? "أي تعليمات خاصة للتوصيل (اختياري)"
              : "Any special delivery instructions (optional)"
          }
          className={inputCls + " resize-none h-24"}
          autoComplete="off"
        />
      </Field>

      <button
        onClick={onContinue}
        className="btn-press w-full bg-[#0c0c0c] text-white py-4 font-semibold text-sm rounded-sm hover:bg-[#333] transition-colors mt-2"
      >
        {isAr ? "المتابعة إلى الدفع" : "Continue to Payment"}
      </button>
    </div>
  );
}

interface PaymentTabProps {
  method: PaymentMethod;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function PaymentTab({ active, onClick, children }: PaymentTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "w-full text-start p-4 rounded-sm transition-colors",
        active
          ? "border-2 border-[#0c0c0c]"
          : "border border-[rgba(0,0,0,0.21)] hover:border-[rgba(0,0,0,0.4)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function StepPayment({
  form,
  onChange,
  onPlace,
  onBack,
  isAr,
}: {
  form: FormState;
  onChange: (k: keyof FormState, v: string) => void;
  onPlace: () => void;
  onBack: () => void;
  isAr: boolean;
}) {
  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;
  const installment4 = Math.ceil(total / 4);
  const installment3 = Math.ceil(total / 3);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-[#0c0c0c]">
        {isAr ? "طريقة الدفع" : "Payment Method"}
      </h2>

      <div className="flex flex-col gap-3">
        <PaymentTab
          method="card"
          active={form.paymentMethod === "card"}
          onClick={() => onChange("paymentMethod", "card")}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#0c0c0c]">
              {isAr ? "بطاقة ائتمان / مدى" : "Credit / Debit Card"}
            </span>
            <div className="flex items-center gap-1.5">
              {["Visa", "Mastercard", "mada"].map((brand) => (
                <span
                  key={brand}
                  className="text-[10px] font-bold border border-[rgba(0,0,0,0.15)] rounded-sm px-1.5 py-0.5 text-[#484848] bg-[#fafafa]"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </PaymentTab>

        {form.paymentMethod === "card" && (
          <div className="border border-[rgba(0,0,0,0.1)] rounded-sm p-4 flex flex-col gap-4 -mt-1 bg-[#fafafa]">
            <Field label="Card Number" labelAr="رقم البطاقة" isAr={isAr} required>
              <input
                type="text"
                inputMode="numeric"
                value={form.cardNumber}
                onChange={(e) => onChange("cardNumber", e.target.value)}
                placeholder="**** **** **** ****"
                maxLength={19}
                className={inputCls + " bg-white font-mono"}
                autoComplete="cc-number"
                dir="ltr"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry (MM/YY)" labelAr="تاريخ الانتهاء" isAr={isAr} required>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.expiry}
                  onChange={(e) => onChange("expiry", e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={inputCls + " bg-white font-mono"}
                  autoComplete="cc-exp"
                  dir="ltr"
                />
              </Field>
              <Field label="CVV" labelAr="CVV" isAr={isAr} required>
                <input
                  type="password"
                  inputMode="numeric"
                  value={form.cvv}
                  onChange={(e) => onChange("cvv", e.target.value)}
                  placeholder="***"
                  maxLength={4}
                  className={inputCls + " bg-white font-mono"}
                  autoComplete="cc-csc"
                  dir="ltr"
                />
              </Field>
            </div>
            <Field label="Cardholder Name" labelAr="اسم حامل البطاقة" isAr={isAr} required>
              <input
                type="text"
                value={form.cardName}
                onChange={(e) => onChange("cardName", e.target.value)}
                placeholder={isAr ? "الاسم كما هو على البطاقة" : "Name as shown on card"}
                className={inputCls + " bg-white"}
                autoComplete="cc-name"
              />
            </Field>
          </div>
        )}

        <PaymentTab
          method="applepay"
          active={form.paymentMethod === "applepay"}
          onClick={() => onChange("paymentMethod", "applepay")}
        >
          <div className="flex items-center gap-3">
            <div className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1">
              <span className="text-base leading-none"></span>
              <span>Pay</span>
            </div>
            <span className="text-sm text-[#484848]">
              {isAr ? "ادفع بسرعة وأمان" : "Fast and secure checkout"}
            </span>
          </div>
        </PaymentTab>

        <PaymentTab
          method="tabby"
          active={form.paymentMethod === "tabby"}
          onClick={() => onChange("paymentMethod", "tabby")}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#3d9970] bg-[#e8f5ee] px-2 py-0.5 rounded-sm">
                tabby
              </span>
              <span className="text-sm text-[#0c0c0c] font-medium">
                {isAr ? "اشترِ الآن، ادفع لاحقاً" : "Buy now, pay later"}
              </span>
            </div>
            <span className="text-xs text-[#484848]">
              {isAr
                ? `4 دفعات × ${fmt(installment4)}`
                : `4 payments of ${fmt(installment4)}`}
            </span>
          </div>
        </PaymentTab>

        <PaymentTab
          method="tamara"
          active={form.paymentMethod === "tamara"}
          onClick={() => onChange("paymentMethod", "tamara")}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#ff6b35] bg-[#fff1ec] px-2 py-0.5 rounded-sm">
                tamara
              </span>
              <span className="text-sm text-[#0c0c0c] font-medium">
                {isAr ? "قسّم على 3 أشهر" : "Split into 3 months"}
              </span>
            </div>
            <span className="text-xs text-[#484848]">
              {isAr
                ? `3 دفعات × ${fmt(installment3)}`
                : `3 payments of ${fmt(installment3)}`}
            </span>
          </div>
        </PaymentTab>
      </div>

      <p className="text-xs text-[#484848] flex items-center gap-1.5">
        <ShieldCheck size={13} className="flex-shrink-0" />
        {isAr
          ? "مؤمّن بـ SSL. معلومات الدفع مشفّرة بالكامل."
          : "Secured by SSL. Your payment info is encrypted."}
      </p>

      <button
        onClick={onPlace}
        className="btn-press w-full bg-[#0c0c0c] text-white py-4 font-semibold text-sm rounded-sm hover:bg-[#333] transition-colors"
      >
        {isAr ? "تأكيد الطلب" : "Place Order"}
      </button>

      <button
        onClick={onBack}
        type="button"
        className="flex items-center gap-1 text-sm text-[#484848] hover:text-[#0c0c0c] transition-colors mx-auto"
      >
        <ChevronLeft size={14} />
        {isAr ? "العودة إلى العنوان" : "Back to Address"}
      </button>
    </div>
  );
}

function StepConfirmation({
  email,
  orderNumber,
  isAr,
}: {
  email: string;
  orderNumber: string;
  isAr: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-4 gap-6 max-w-lg mx-auto">
      <div className="w-16 h-16 bg-[#0c0c0c] rounded-full flex items-center justify-center text-white">
        <Check size={28} strokeWidth={2.5} />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0c0c0c] tracking-tight">
          {isAr ? "تم تأكيد طلبك" : "Order Confirmed"}
        </h1>
        <p className="text-[#484848] text-sm">
          {isAr
            ? `سيصلك بريد إلكتروني على ${email || "بريدك الإلكتروني"}`
            : `You will receive a confirmation email at ${email || "your email address"}`}
        </p>
      </div>

      <div className="w-full border border-[rgba(0,0,0,0.21)] rounded-sm p-5 text-start">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#484848]">
              {isAr ? "رقم الطلب" : "Order number"}
            </span>
            <span className="font-bold text-[#0c0c0c] font-mono">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#484848]">
              {isAr ? "التوصيل المتوقع" : "Estimated delivery"}
            </span>
            <span className="font-medium text-[#0c0c0c]">
              {isAr ? "5–7 أيام عمل" : "5–7 business days"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link
          href="/shop"
          className="btn-press flex-1 text-center border border-[rgba(0,0,0,0.21)] text-[#0c0c0c] py-3.5 font-semibold text-sm rounded-sm hover:bg-[#fafafa] transition-colors"
        >
          {isAr ? "متابعة التسوق" : "Continue Shopping"}
        </Link>
        <Link
          href="/track-order"
          className="btn-press flex-1 text-center bg-[#0c0c0c] text-white py-3.5 font-semibold text-sm rounded-sm hover:bg-[#333] transition-colors"
        >
          {isAr ? "تتبع طلبك" : "Track Your Order"}
        </Link>
      </div>
    </div>
  );
}

export function CheckoutClient() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const orderNumber = useRef(
    `MAJ-${String(Math.floor(10000 + Math.random() * 90000))}`
  );

  const updateField = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleContinueToPayment = () => setStep(2);
  const handleBackToAddress = () => setStep(1);
  const handlePlaceOrder = () => setStep(3);

  const isConfirmation = step === 3;

  return (
    <main id="main-content" className="bg-white min-h-screen py-10 md:py-14">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0c0c0c] tracking-tight">
            {isAr ? "إتمام الطلب" : "Checkout"}
          </h1>
        </div>

        <StepIndicator step={step} isAr={isAr} />

        {isConfirmation ? (
          <StepConfirmation
            email={form.email}
            orderNumber={orderNumber.current}
            isAr={isAr}
          />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <section
              aria-label={
                isAr
                  ? step === 1
                    ? "نموذج العنوان"
                    : "نموذج الدفع"
                  : step === 1
                  ? "Address form"
                  : "Payment form"
              }
              className="w-full lg:w-[60%]"
            >
              {step === 1 && (
                <StepAddress
                  form={form}
                  onChange={updateField}
                  onContinue={handleContinueToPayment}
                  isAr={isAr}
                />
              )}
              {step === 2 && (
                <StepPayment
                  form={form}
                  onChange={updateField}
                  onPlace={handlePlaceOrder}
                  onBack={handleBackToAddress}
                  isAr={isAr}
                />
              )}
            </section>

            <OrderSummary isAr={isAr} />
          </div>
        )}
      </div>
    </main>
  );
}
