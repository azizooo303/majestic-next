"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Check, ShieldCheck, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { useRouter } from "@/i18n/navigation";
import type { CartItem } from "@/lib/cart";

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
};

const VAT_RATE = 0.15;

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
                  "w-8 h-8 rounded-none flex items-center justify-center text-sm font-bold transition-colors",
                  isActive
                    ? "bg-[#2C2C2C] text-white"
                    : isComplete
                    ? "bg-[#3A3A3A] text-white"
                    : "border border-[#D4D4D4] text-[#3A3A3A]",
                ].join(" ")}
                aria-current={isActive ? "step" : undefined}
              >
                {isComplete ? <Check size={14} strokeWidth={2.5} /> : s.num}
              </div>
              <span
                className={[
                  "text-xs whitespace-nowrap",
                  isActive
                    ? "font-bold text-[#2C2C2C]"
                    : isComplete
                    ? "font-medium text-[#3A3A3A]"
                    : "text-[#3A3A3A]",
                ].join(" ")}
              >
                {isAr ? s.ar : s.en}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={[
                  "h-px w-16 md:w-24 mx-2 mb-5 transition-colors",
                  step > s.num ? "bg-[#3A3A3A]" : "bg-[#D4D4D4]",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

function OrderSummary({ isAr, items }: { isAr: boolean; items: CartItem[] }) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  return (
    <aside
      aria-label={isAr ? "ملخص الطلب" : "Order summary"}
      className="w-full lg:w-[40%] lg:sticky lg:top-[176px]"
    >
      <div className="border border-[#D4D4D4] rounded-sm p-6 bg-white">
        <h2 className="text-base font-bold text-[#2C2C2C] mb-5 pb-4 border-b border-[#D4D4D4]">
          {isAr ? "ملخص الطلب" : "Order Summary"}
        </h2>

        <div className="flex flex-col gap-4 mb-5 pb-5 border-b border-[#D4D4D4]">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 flex-shrink-0 border border-[#D4D4D4] rounded-sm overflow-hidden">
                <Image
                  src={item.image || "/images/hero-desks.jpg"}
                  alt={isAr ? item.nameAr : item.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2C2C2C] leading-snug truncate">
                  {isAr ? item.nameAr : item.name}
                </p>
                {item.quantity > 1 && (
                  <p className="text-xs text-[#3A3A3A]">x{item.quantity}</p>
                )}
              </div>
              <p className="text-sm font-semibold text-[#2C2C2C] flex-shrink-0">
                {fmt(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between text-[#3A3A3A]">
            <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#3A3A3A]">
            <span>{isAr ? "الشحن" : "Shipping"}</span>
            <span className="text-[#2C2C2C] font-medium">
              {isAr ? "مجاناً" : "Free"}
            </span>
          </div>
          <div className="flex justify-between text-[#3A3A3A]">
            <span>{isAr ? "ضريبة القيمة المضافة (15%)" : "VAT (15%)"}</span>
            <span>{fmt(vat)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#2C2C2C] pt-3 border-t border-[#D4D4D4]">
            <span>{isAr ? "الإجمالي" : "Total"}</span>
            <span>{fmt(total)}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-[#D4D4D4] flex items-center gap-2 justify-center">
          <ShieldCheck size={13} className="text-[#3A3A3A] flex-shrink-0" />
          <span className="text-xs text-[#3A3A3A]">
            {isAr ? "مؤمّن بـ SSL" : "Secured by SSL"}
          </span>
        </div>
      </div>
    </aside>
  );
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+?966|05)\d{8,}$/;

function validateAddress(form: FormState, isAr: boolean): FormErrors {
  const errors: FormErrors = {};
  if (!form.firstName.trim()) errors.firstName = isAr ? "الاسم الأول مطلوب" : "First name is required";
  if (!form.lastName.trim()) errors.lastName = isAr ? "اسم العائلة مطلوب" : "Last name is required";
  if (!form.email.trim()) errors.email = isAr ? "البريد الإلكتروني مطلوب" : "Email is required";
  else if (!EMAIL_RE.test(form.email)) errors.email = isAr ? "بريد إلكتروني غير صحيح" : "Invalid email address";
  if (!form.phone.trim()) errors.phone = isAr ? "رقم الجوال مطلوب" : "Phone number is required";
  else if (!PHONE_RE.test(form.phone.replace(/[\s-]/g, ""))) errors.phone = isAr ? "رقم جوال غير صحيح" : "Invalid phone number";
  if (!form.address1.trim()) errors.address1 = isAr ? "العنوان مطلوب" : "Address is required";
  if (!form.city.trim()) errors.city = isAr ? "المدينة مطلوبة" : "City is required";
  if (!form.region) errors.region = isAr ? "المنطقة مطلوبة" : "Region is required";
  return errors;
}

// Payment validation is deferred until the payment gateway (Moyasar) is integrated.
// No card data is collected client-side — see PCI-DSS compliance note in StepPayment.
function validatePayment(_form: FormState, _isAr: boolean): FormErrors {
  return {};
}

function Field({
  label,
  labelAr,
  isAr,
  required,
  error,
  children,
}: {
  label: string;
  labelAr: string;
  isAr: boolean;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#3A3A3A] uppercase tracking-wide">
        {isAr ? labelAr : label}
        {required && (
          <span className="text-[#2C2C2C] font-medium ms-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 font-medium mt-0.5" role="alert">{error}</p>}
    </div>
  );
}

const inputCls =
  "border border-[#D4D4D4] rounded-sm px-4 py-3 w-full text-sm text-[#2C2C2C] bg-white placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#2C2C2C] focus:ring-1 focus:ring-[#2C2C2C] transition-colors";

function StepAddress({
  form,
  onChange,
  onContinue,
  errors,
  isAr,
}: {
  form: FormState;
  onChange: (k: keyof FormState, v: string) => void;
  onContinue: () => void;
  errors: FormErrors;
  isAr: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-[#2C2C2C]">
        {isAr ? "عنوان التوصيل" : "Delivery Address"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name" labelAr="الاسم الأول" isAr={isAr} required error={errors.firstName}>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder={isAr ? "الاسم الأول" : "First name"}
            className={inputCls}
            autoComplete="given-name"
          />
        </Field>
        <Field label="Last Name" labelAr="اسم العائلة" isAr={isAr} required error={errors.lastName}>
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
        <Field label="Email" labelAr="البريد الإلكتروني" isAr={isAr} required error={errors.email}>
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
        <Field label="Phone" labelAr="رقم الجوال" isAr={isAr} required error={errors.phone}>
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

      <Field label="Address Line 1" labelAr="العنوان" isAr={isAr} required error={errors.address1}>
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
        <Field label="City" labelAr="المدينة" isAr={isAr} required error={errors.city}>
          <input
            type="text"
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder={isAr ? "المدينة" : "City"}
            className={inputCls}
            autoComplete="address-level2"
          />
        </Field>
        <Field label="Region" labelAr="المنطقة" isAr={isAr} required error={errors.region}>
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
        className="btn-press w-full bg-[#2C2C2C] text-white py-4 font-semibold text-sm rounded-sm hover:bg-[#3A3A3A] transition-colors mt-2"
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
          ? "border-2 border-[#2C2C2C]"
          : "border border-[#D4D4D4] hover:border-[#3A3A3A]",
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
  errors,
  isAr,
  items,
  submitting,
}: {
  form: FormState;
  onChange: (k: keyof FormState, v: string) => void;
  onPlace: () => void;
  onBack: () => void;
  errors: FormErrors;
  isAr: boolean;
  items: CartItem[];
  submitting: boolean;
}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;
  const installment4 = Math.ceil(total / 4);
  const installment3 = Math.ceil(total / 3);

  return (
    <fieldset disabled={submitting} className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-[#2C2C2C]">
        {isAr ? "طريقة الدفع" : "Payment Method"}
      </h2>

      <div className="flex flex-col gap-3">
        <PaymentTab
          method="card"
          active={form.paymentMethod === "card"}
          onClick={() => onChange("paymentMethod", "card")}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#2C2C2C]">
              {isAr ? "بطاقة ائتمان / مدى" : "Credit / Debit Card"}
            </span>
            <div className="flex items-center gap-1.5">
              {["Visa", "Mastercard", "mada"].map((brand) => (
                <span
                  key={brand}
                  className="text-[10px] font-bold border border-[#D4D4D4] rounded-sm px-1.5 py-0.5 text-[#3A3A3A] bg-[#FFFFFF]"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </PaymentTab>

        {form.paymentMethod === "card" && (
          <div
            className="border border-[#C1B167] rounded-sm p-4 -mt-1 bg-[#FDFBF3]"
            role="note"
            aria-label={isAr ? "تنبيه: بوابة الدفع قيد التطوير" : "Notice: Payment gateway in development"}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="text-[#C1B167] flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-[#2C2C2C]">
                  {isAr ? "تكامل الدفع قيد الإعداد" : "Payment Integration Coming Soon"}
                </p>
                <p className="text-xs text-[#3A3A3A] leading-relaxed">
                  {isAr
                    ? "سيتم تفعيل الدفع عبر مدى وفيزا وماستركارد عند اكتمال تكامل بوابة الدفع. في الوقت الحالي، سيتواصل معك فريقنا لإتمام الطلب."
                    : "Secure card payments via mada, Visa, and Mastercard will be available once our payment gateway integration is complete. Our team will contact you to finalize your order."}
                </p>
              </div>
            </div>
          </div>
        )}

        <PaymentTab
          method="applepay"
          active={form.paymentMethod === "applepay"}
          onClick={() => onChange("paymentMethod", "applepay")}
        >
          <div className="flex items-center gap-3">
            <div className="bg-[#2C2C2C] text-white text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1">
              <span className="text-base leading-none"></span>
              <span>Pay</span>
            </div>
            <span className="text-sm text-[#3A3A3A]">
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
              <span className="text-sm font-bold text-[#2C2C2C] bg-[#F5F5F5] border border-[#D4D4D4] px-2 py-0.5 rounded-sm">
                tabby
              </span>
              <span className="text-sm text-[#2C2C2C] font-medium">
                {isAr ? "اشترِ الآن، ادفع لاحقاً" : "Buy now, pay later"}
              </span>
            </div>
            <span className="text-xs text-[#3A3A3A]">
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
              <span className="text-sm font-bold text-[#2C2C2C] bg-[#F5F5F5] border border-[#D4D4D4] px-2 py-0.5 rounded-sm">
                tamara
              </span>
              <span className="text-sm text-[#2C2C2C] font-medium">
                {isAr ? "قسّم على 3 أشهر" : "Split into 3 months"}
              </span>
            </div>
            <span className="text-xs text-[#3A3A3A]">
              {isAr
                ? `3 دفعات × ${fmt(installment3)}`
                : `3 payments of ${fmt(installment3)}`}
            </span>
          </div>
        </PaymentTab>
      </div>

      <p className="text-xs text-[#3A3A3A] flex items-center gap-1.5">
        <ShieldCheck size={13} className="flex-shrink-0" />
        {isAr
          ? "مؤمّن بـ SSL. معلومات الدفع مشفّرة بالكامل."
          : "Secured by SSL. Your payment info is encrypted."}
      </p>

      <button
        onClick={onPlace}
        disabled={submitting}
        className="btn-press w-full bg-[#2C2C2C] text-white py-4 font-semibold text-sm rounded-sm hover:bg-[#3A3A3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting
          ? (isAr ? "جارٍ تقديم الطلب..." : "Placing Order...")
          : (isAr ? "تأكيد الطلب" : "Place Order")}
      </button>

      <button
        onClick={onBack}
        type="button"
        className="flex items-center gap-1 text-sm text-[#3A3A3A] hover:text-[#2C2C2C] transition-colors mx-auto"
      >
        <ChevronLeft size={14} />
        {isAr ? "العودة إلى العنوان" : "Back to Address"}
      </button>
    </fieldset>
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
      <div className="w-16 h-16 bg-[#2C2C2C] rounded-none flex items-center justify-center text-white">
        <Check size={28} strokeWidth={2.5} />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight">
          {isAr ? "تم تأكيد طلبك" : "Order Confirmed"}
        </h1>
        <p className="text-[#3A3A3A] text-sm">
          {isAr
            ? `سيصلك بريد إلكتروني على ${email || "بريدك الإلكتروني"}`
            : `You will receive a confirmation email at ${email || "your email address"}`}
        </p>
      </div>

      <div className="w-full border border-[#D4D4D4] rounded-sm p-5 text-start">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#3A3A3A]">
              {isAr ? "رقم الطلب" : "Order number"}
            </span>
            <span className="font-bold text-[#2C2C2C] font-mono">
              {orderNumber || (isAr ? "جاري المعالجة..." : "Processing...")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#3A3A3A]">
              {isAr ? "التوصيل المتوقع" : "Estimated delivery"}
            </span>
            <span className="font-medium text-[#2C2C2C]">
              {isAr ? "5–7 أيام عمل" : "5–7 business days"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link
          href="/shop"
          className="btn-press flex-1 text-center border border-[#D4D4D4] text-[#2C2C2C] py-3.5 font-semibold text-sm rounded-sm hover:bg-[#FFFFFF] transition-colors"
        >
          {isAr ? "متابعة التسوق" : "Continue Shopping"}
        </Link>
        <Link
          href="/track-order"
          className="btn-press flex-1 text-center bg-[#2C2C2C] text-white py-3.5 font-semibold text-sm rounded-sm hover:bg-[#3A3A3A] transition-colors"
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
  const router = useRouter();
  const { items, clearCart, itemCount, hydrated } = useCart();

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderError, setOrderError] = useState("");

  // Redirect to cart if empty (only after hydration)
  useEffect(() => {
    if (hydrated && itemCount === 0 && step !== 3) {
      router.push("/cart");
    }
  }, [hydrated, itemCount, step, router]);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const handleContinueToPayment = () => {
    const errs = validateAddress(form, isAr);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep(2);
  };
  const handleBackToAddress = () => { setErrors({}); setStep(1); };

  const handlePlaceOrder = async () => {
    const errs = validatePayment(form, isAr);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setOrderError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing: {
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            phone: form.phone,
            address_1: form.address1,
            address_2: form.address2,
            city: form.city,
            state: form.region,
            country: "SA",
          },
          line_items: items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
          payment_method: form.paymentMethod,
          customer_note: form.instructions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order creation failed");
      }

      setOrderNumber(data.number || `MAJ-${data.id}`);
      clearCart();
      setStep(3);
    } catch (err) {
      setOrderError(
        err instanceof Error
          ? err.message
          : (isAr ? "حدث خطأ. يرجى المحاولة مرة أخرى." : "Something went wrong. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Show nothing while redirecting (hydrated + empty cart + not confirmation)
  if (hydrated && itemCount === 0 && step !== 3) {
    return null;
  }

  const isConfirmation = step === 3;

  return (
    <main id="main-content" className="bg-white min-h-screen py-10 md:py-14">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight">
            {isAr ? "إتمام الطلب" : "Checkout"}
          </h1>
        </div>

        <StepIndicator step={step} isAr={isAr} />

        {isConfirmation ? (
          <StepConfirmation
            email={form.email}
            orderNumber={orderNumber}
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
                  errors={errors}
                  isAr={isAr}
                />
              )}
              {step === 2 && (
                <>
                  <StepPayment
                    form={form}
                    onChange={updateField}
                    onPlace={handlePlaceOrder}
                    onBack={handleBackToAddress}
                    errors={errors}
                    isAr={isAr}
                    items={items}
                    submitting={submitting}
                  />
                  {orderError && (
                    <div className="mt-4 p-4 border border-red-300 bg-red-50 rounded-sm" role="alert">
                      <p className="text-sm text-red-700 font-medium text-center">
                        {orderError}
                      </p>
                    </div>
                  )}
                </>
              )}
            </section>

            <OrderSummary isAr={isAr} items={items} />
          </div>
        )}
      </div>
    </main>
  );
}
