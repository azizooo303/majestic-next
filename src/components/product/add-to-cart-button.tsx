"use client";

import { useState } from "react";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/cart-context";
import type { CartItem } from "@/lib/cart";

interface ProductMeta {
  name: string;
  nameAr: string;
  price: number;
  image: string;
  category: string;
  categoryAr: string;
}

interface AddToCartButtonProps {
  productId: number;
  locale: string;
  product: ProductMeta;
}

export function AddToCartButton({
  productId,
  locale,
  product,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const isAr = locale === "ar";
  const { addItem } = useCart();

  function handleAddToCart() {
    const item: CartItem = {
      id: productId,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.image,
      category: product.category,
      categoryAr: product.categoryAr,
      quantity,
    };

    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-800 me-2">
          {isAr ? "\u0627\u0644\u0643\u0645\u064a\u0629" : "Quantity"}
        </span>
        <div className="flex items-center border border-border rounded-none">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2.5 text-gray-800 hover:text-[#2C2C2C] transition-colors cursor-pointer"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="p-2.5 text-gray-800 hover:text-[#2C2C2C] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={added}
        className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 bg-[#2C2C2C] text-white font-semibold text-sm sm:text-base rounded-none transition-all duration-200 hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {added ? (
          <>
            <ShoppingBag className="w-5 h-5" />
            {isAr ? "\u062a\u0645\u062a \u0627\u0644\u0625\u0636\u0627\u0641\u0629" : "Added"}
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            {isAr
              ? "\u0623\u0636\u0641 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629"
              : "Add to Cart"}
          </>
        )}
      </button>

      {/* Wishlist */}
      <button className="w-full px-4 py-2 text-sm font-medium text-gray-800 hover:text-[#2C2C2C] border border-gray-300 rounded-none transition-all duration-200 hover:border-[#2C2C2C] cursor-pointer">
        {isAr
          ? "\u0623\u0636\u0641 \u0625\u0644\u0649 \u0627\u0644\u0645\u0641\u0636\u0644\u0629"
          : "Add to Wishlist"}
      </button>
    </div>
  );
}
