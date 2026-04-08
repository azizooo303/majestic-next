"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { X, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/cart-context";

const VAT_RATE = 0.15;

function QuantityControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center border border-[rgba(0,0,0,0.21)] rounded-sm">
      <button
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-8 h-8 flex items-center justify-center text-[#484848] hover:text-gray-900 hover:bg-[#fafafa] transition-colors text-lg leading-none select-none"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-semibold text-gray-900 select-none">
        {value}
      </span>
      <button
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center text-[#484848] hover:text-gray-900 hover:bg-[#fafafa] transition-colors text-lg leading-none select-none"
      >
        +
      </button>
    </div>
  );
}

export function CartClient() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { items, removeItem, updateQuantity, hydrated } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  const fmt = (n: number) =>
    `SAR ${n.toLocaleString("en-SA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  const isEmpty = items.length === 0;
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  // While Supabase session is loading, show a neutral skeleton to avoid flash
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

        {/* Page heading */}
        <div className="mb-8 flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            {isAr ? "سلة التسوق" : "Shopping Cart"}
          </h1>
          {!isEmpty && (
            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-sm bg-[#0c0c0c] text-white text-xs font-semibold">
              {totalQty}
            </span>
          )}
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <p className="text-lg text-[#484848]">
              {isAr ? "سلة التسوق فارغة" : "Your cart is empty"}
            </p>
            <Link
              href="/shop"
              className="btn-press inline-block bg-[#0c0c0c] text-white px-8 py-3 text-sm font-semibold rounded-sm hover:bg-[#333] transition-colors"
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
              <div className="border border-[rgba(0,0,0,0.21)] rounded-sm divide-y divide-[rgba(0,0,0,0.1)]">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-5">
                    <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-sm border border-[rgba(0,0,0,0.1)]">
                      <Image
                        src={item.image}
                        alt={isAr ? item.nameAr : item.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex flex-1 min-w-0 flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm leading-snug">
                            {isAr ? item.nameAr : item.name}
                          </p>
                          <p className="text-xs text-[#484848] mt-0.5">
                            {isAr ? item.categoryAr : item.category}
                          </p>
                        </div>
                        <button
                          aria-label={isAr ? "إزالة العنصر" : "Remove item"}
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 text-[#484848] hover:text-red-600 transition-colors p-0.5 -mt-0.5"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-2">
                        <QuantityControl
                          value={item.quantity}
                          onChange={(v) => updateQuantity(item.id, v)}
                        />
                        <p className="font-bold text-gray-900 text-sm">
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
                  className="text-sm text-[#484848] hover:text-gray-900 border-b border-[#484848] pb-0.5 transition-colors"
                >
                  {isAr ? "متابعة التسوق" : "Continue Shopping"}
                </Link>
              </div>
            </section>

            <aside
              aria-label={isAr ? "ملخص الطلب" : "Order summary"}
              className="w-full lg:w-[35%] lg:sticky lg:top-[176px]"
            >
              <div className="border border-[rgba(0,0,0,0.21)] rounded-sm p-6 bg-white">
                <h2 className="text-base font-bold text-gray-900 mb-5 pb-4 border-b border-[rgba(0,0,0,0.1)]">
                  {isAr ? "ملخص الطلب" : "Order Summary"}
                </h2>

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between text-[#484848]">
                    <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#484848]">
                    <span>{isAr ? "الشحن" : "Shipping"}</span>
                    <span className="text-gray-900 font-medium">
                      {isAr ? "مجاناً" : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#484848]">
                    <span>
                      {isAr ? "ضريبة القيمة المضافة (15%)" : "VAT (15%)"}
                    </span>
                    <span>{fmt(vat)}</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-[rgba(0,0,0,0.1)]">
                    <span>{isAr ? "الإجمالي" : "Total"}</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>

                <button className="btn-press w-full mt-6 bg-[#0c0c0c] text-white py-4 font-semibold text-sm rounded-sm hover:bg-[#333] transition-colors">
                  {isAr ? "المتابعة إلى الدفع" : "Proceed to Checkout"}
                </button>

                <button className="btn-press w-full mt-3 border border-[rgba(0,0,0,0.21)] text-gray-900 py-3.5 font-semibold text-sm rounded-sm hover:bg-[#fafafa] transition-colors">
                  {isAr ? "طلب عرض سعر" : "Request a Quote instead"}
                </button>

                <div className="mt-5 pt-4 border-t border-[rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <ShieldCheck size={14} className="text-[#484848]" />
                    <span className="text-xs text-[#484848]">
                      {isAr ? "مؤمّن بـ SSL" : "Secured by SSL"}
                    </span>
                  </div>
                  <p className="text-center text-xs text-[#9ca3af]">
                    mada&nbsp;·&nbsp;Visa&nbsp;·&nbsp;Mastercard&nbsp;·&nbsp;Apple Pay
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
