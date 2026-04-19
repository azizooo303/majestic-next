/**
 * LivePrice — computes and displays variant total as picker state changes.
 *
 * Math:
 *   total = basePrice + sum(extra_price[each selection])
 *
 * Drop in: src/components/shop/live-price.tsx
 */

"use client";

type LivePriceProps = {
  basePrice: number;
  selections: Record<string, string>; // axis -> selected value
  extraPriceLookup: Record<string, number>; // key: "axis:value", value: extra_price
  locale: "en" | "ar";
  currency?: "SAR";
  showBreakdown?: boolean;
  isCustomQuote?: boolean; // true when CUSTOM selected on any axis
};

export function LivePrice({
  basePrice,
  selections,
  extraPriceLookup,
  locale,
  currency = "SAR",
  showBreakdown = false,
  isCustomQuote = false,
}: LivePriceProps) {
  const isAr = locale === "ar";

  if (isCustomQuote) {
    return (
      <div className="border-t border-[#D4D4D4] pt-6 mt-6">
        <div className="text-[#2C2C2C] font-medium">
          {isAr ? "سعر مخصص — اطلب عرض أسعار" : "Custom Quote — request pricing"}
        </div>
        <div className="text-sm text-[#3A3A3A] mt-1">
          {isAr
            ? "سيقوم فريق المبيعات بالرد خلال يوم عمل"
            : "Our sales team will respond within 1 business day"}
        </div>
      </div>
    );
  }

  const extras: Array<{axis: string; value: string; price: number}> = [];
  let extraTotal = 0;
  for (const [axis, value] of Object.entries(selections)) {
    if (!value) continue;
    const key = `${axis}:${value}`;
    const price = extraPriceLookup[key] || 0;
    if (price !== 0) {
      extras.push({axis, value, price});
      extraTotal += price;
    }
  }

  const total = basePrice + extraTotal;
  const formatted = total.toLocaleString(isAr ? "ar-SA" : "en-US");

  return (
    <div className="border-t border-[#D4D4D4] pt-6 mt-6">
      {showBreakdown && (
        <div className="text-xs text-[#3A3A3A] mb-3 space-y-1">
          <div className="flex justify-between">
            <span>{isAr ? "السعر الأساسي" : "Base"}</span>
            <span>{basePrice.toLocaleString()}</span>
          </div>
          {extras.map(e => (
            <div key={`${e.axis}:${e.value}`} className="flex justify-between">
              <span>{e.axis} — {e.value}</span>
              <span>{e.price > 0 ? "+" : ""}{e.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-baseline justify-between">
        <div className="text-xs text-[#3A3A3A] uppercase tracking-wide">
          {isAr ? "السعر الإجمالي" : "Total"}
        </div>
        <div
          className="text-[#2C2C2C] text-2xl font-medium"
          aria-live="polite"
          aria-atomic="true"
        >
          {formatted} <span className="text-base">{isAr ? "ريال" : currency}</span>
        </div>
      </div>
      <div className="text-xs text-[#3A3A3A] mt-1">
        {isAr
          ? "يضاف عليها ضريبة القيمة المضافة 15%"
          : "+ 15% VAT at checkout"}
      </div>
    </div>
  );
}
