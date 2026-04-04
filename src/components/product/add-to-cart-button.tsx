"use client";

import { useState } from "react";
import { ShoppingBag, Loader2, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/cart-context";
import type { CartItem } from "@/lib/cart";

interface AddToCartButtonProps {
  productId: number;
  locale: string;
  /** Product details needed to populate the cart item */
  product?: {
    name: string;
    nameAr: string;
    price: number;
    image: string;
    category: string;
    categoryAr: string;
  };
}

export function AddToCartButton({ productId, locale, product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const isAr = locale === "ar";
  const { addItem } = useCart();

  function handleAddToCart() {
    const item: Omit<CartItem, "quantity"> = {
      id: productId,
      name: product?.name ?? `Product ${productId}`,
      nameAr: product?.nameAr ?? `منتج ${productId}`,
      price: product?.price ?? 0,
      image: product?.image ?? "",
      category: product?.category ?? "",
      categoryAr: product?.categoryAr ?? "",
    };
    addItem({ ...item, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-800 me-2">
          {isAr ? "الكمية" : "Quantity"}
        </span>
        <div className="flex items-center border border-border rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2.5 text-gray-800 hover:text-gray-900 transition-colors cursor-pointer"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="p-2.5 text-gray-800 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={added}
        className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5
          bg-gray-900 text-white font-semibold text-sm sm:text-base rounded-sm
          transition-all duration-200 hover:opacity-90 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-gray-400
          disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5" />
        {added
          ? isAr ? "تمت الإضافة ✓" : "Added ✓"
          : isAr ? "أضف إلى السلة" : "Add to Cart"}
      </button>

      {/* Wishlist */}
      <button className="w-full px-4 py-2 text-sm font-medium text-gray-800 hover:text-gray-900 border border-gray-300 rounded-sm
        transition-all duration-200 hover:border-gray-900 cursor-pointer">
        {isAr ? "أضف إلى المفضلة" : "Add to Wishlist"}
      </button>
    </div>
  );
}
