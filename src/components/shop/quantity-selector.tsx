"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  isAr: boolean;
  min?: number;
  max?: number;
}

export function QuantitySelector({ isAr, min = 1, max = 99 }: QuantitySelectorProps) {
  const [qty, setQty] = useState(1);

  const decrement = () => setQty((q) => Math.max(min, q - 1));
  const increment = () => setQty((q) => Math.min(max, q + 1));

  return (
    <div
      className="flex items-center border border-[rgba(0,0,0,0.21)] rounded-sm w-fit"
      role="group"
      aria-label={isAr ? "الكمية" : "Quantity"}
    >
      <button
        onClick={decrement}
        disabled={qty <= min}
        className="w-10 h-10 flex items-center justify-center text-gray-900
          hover:bg-[#fafafa] transition-colors disabled:opacity-30 disabled:cursor-not-allowed
          border-e border-[rgba(0,0,0,0.21)] cursor-pointer"
        aria-label={isAr ? "تقليل الكمية" : "Decrease quantity"}
      >
        <Minus size={14} aria-hidden="true" />
      </button>

      <input
        type="number"
        value={qty}
        min={min}
        max={max}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val)) setQty(Math.min(max, Math.max(min, val)));
        }}
        className="w-12 h-10 text-center text-sm font-semibold text-gray-900 bg-transparent
          focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none"
        aria-label={isAr ? "الكمية" : "Quantity"}
      />

      <button
        onClick={increment}
        disabled={qty >= max}
        className="w-10 h-10 flex items-center justify-center text-gray-900
          hover:bg-[#fafafa] transition-colors disabled:opacity-30 disabled:cursor-not-allowed
          border-s border-[rgba(0,0,0,0.21)] cursor-pointer"
        aria-label={isAr ? "زيادة الكمية" : "Increase quantity"}
      >
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
