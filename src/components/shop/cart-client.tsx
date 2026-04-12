"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { X, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/cart-context";

function QuantityControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center border border-[#D4D4D4] rounded-sm">
      <button
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-11 h-11 flex items-center justify-center text-[#3A3A3A] hover:text-[#2C2C2C] hover:bg-[#FFFFFF] transition-colors text-lg leading-none select-none cursor-pointer"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-semibold text-[#2C2C2C] select-none">
        {value}
      </span>
      <button
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="w-11 h-11 flex items-center justify-center text-[#3A3A3A] hover:text-[#2C2C2C] hover:bg-[#FFFFFF] transition-colors text-lg leading-none select-none cursor-pointer"
      >
        +
      </button>
    </div>
  );
}

// Intentionally always "en-SA" locale: SAR amounts are always formatted in
// Western numerals regardless of UI locale (Arabic e-commerce convention).
function fmt(n: number) {
  return `SAR ${n.toLocaleString("en-SA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

const VAT_RATE = 0.15;

export function CartClient() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { items, subtotal, removeItem, updateQuantity, hydrated } = useCart();

  const isEmpty = items.length === 0;
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  if (!hydrated) {
    return (
      <main id="main-content" className="bg-white min-h-screen py-10 md:py-14">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-8 w-48 bg-[#f0f0f0] rounded-sm animate-pulse mb-8" />
          <div className="h-32 bg-[#f0f0f0] rounded-sm animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="bg-white min-h-screen py-10 md:py-14">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">

        <div className="mb-8 flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight">
            {isAr ? "سلة التسوق" : "Shopping Cart"}
          </h1>
          {!isEmpty && (
            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-sm bg-[#2C2C2C] text-white text-xs font-semibold">
              {totalQty}
            </span>
          )}
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <p className="text-lg text-[#3A3A3A]">
              {isAr ? "سلة التسوق فارغة" : "Your cart is empty"}
            </p>
            <Link
              href="/shop"
              className="btn-press inline-block bg-[#2C2C2C] text-white px-8 py-3 text-sm font-semibold rounded-sm hover:bg-[#3A3A3A] transition-colors"
            >
              {isAr ? "متابعة التسوق" : "Continue Shopping"}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            <section
              aria-label={isAr ? "عناصر السلة" : "Cart items"}
              className="w-full lg:w-[65%]"
            >
              <div className="border border-[#D4D4D4] rounded-sm divide-y divide-[#D4D4D4]">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-5">
                    <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-sm border border-[#D4D4D4]">
                      <Image
                        src={item.image || "/images/hero-desks.jpg"}
                        alt={isAr ? item.nameAr : item.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex flex-1 min-w-0 flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-[#2C2C2C] text-sm leading-snug">
                            {isAr ? item.nameAr : item.name}
                          </p>
                          <p className="text-xs text-[#3A3A3A] mt-0.5">
                            {fmt(item.price)}{" "}
                            {isAr ? "للقطعة" : "each"}
                          </p>
                        </div>
                        <button
                          aria-label={
                            isAr ? "إزالة العنصر" : "Remove item"
                          }
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 text-[#3A3A3A] hover:text-[#2C2C2C] transition-colors p-0.5 -mt-0.5"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-2">
                        <QuantityControl
                          value={item.quantity}
                          onChange={(v) => updateQuantity(item.id, v)}
                        />
                        <p className="font-bold text-[#2C2C2C] text-sm">
                          {fmt(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Link
                  href="/shop"
                  className="text-sm text-[#3A3A3A] hover:text-[#2C2C2C] border-b border-[#3A3A3A] pb-0.5 transition-colors"
                >
                  {isAr ? "متابعة التسوق" : "Continue Shopping"}
                </Link>
              </div>
            </section>

            <aside
              aria-label={isAr ? "ملخص الطلب" : "Order summary"}
              className="w-full lg:w-[35%] lg:sticky lg:top-[176px]"
            >
              <div className="border border-[#D4D4D4] rounded-sm p-6 bg-white">
                <h2 className="text-base font-bold text-[#2C2C2C] mb-5 pb-4 border-b border-[#D4D4D4]">
                  {isAr ? "ملخص الطلب" : "Order Summary"}
                </h2>

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between text-[#3A3A3A]">
                    <span>
                      {isAr ? "المجموع الفرعي" : "Subtotal"}
                    </span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#3A3A3A]">
                    <span>
                      {isAr ? "الشحن" : "Shipping"}
                    </span>
                    <span className="text-[#2C2C2C] font-medium">
                      {isAr ? "مجاناً" : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#3A3A3A]">
                    <span>
                      {isAr
                        ? "ضريبة القيمة المضافة (15%)"
                        : "VAT (15%)"}
                    </span>
                    <span>{fmt(vat)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#2C2C2C] pt-3 border-t border-[#D4D4D4]">
                    <span>
                      {isAr ? "الإجمالي" : "Total"}
                    </span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-press block w-full mt-6 bg-[#2C2C2C] text-white py-4 font-semibold text-sm rounded-sm hover:bg-[#3A3A3A] transition-colors text-center"
                >
                  {isAr
                    ? "المتابعة إلى الدفع"
                    : "Proceed to Checkout"}
                </Link>

                <Link
                  href="/quotation"
                  className="btn-press block w-full mt-3 border border-[#D4D4D4] text-[#2C2C2C] py-3.5 font-semibold text-sm rounded-sm hover:bg-[#FFFFFF] transition-colors text-center"
                >
                  {isAr
                    ? "طلب عرض سعر"
                    : "Request a Quote instead"}
                </Link>

                <div className="mt-5 pt-4 border-t border-[#D4D4D4]">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <ShieldCheck size={14} className="text-[#3A3A3A]" />
                    <span className="text-xs text-[#3A3A3A]">
                      {isAr ? "مؤمّن بـ SSL" : "Secured by SSL"}
                    </span>
                  </div>
                  <p className="text-center text-xs text-[#3A3A3A]">
                    mada · Visa · Mastercard · Apple Pay
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
