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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAr = locale === "ar";
  const { addItem } = useCart();

  async function handleAddToCart() {
    // Clear previous error
    setError(null);
    setLoading(true);

    try {
      // Make API call to add to cart
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to add to cart" }));
        throw new Error(errorData.error || "Failed to add to cart");
      }

      const data = await response.json();

      // Update local cart context with response data
      if (data.success && data.cart) {
        // If cart endpoint returns updated cart, we can use it
        // Otherwise fall back to local context update
        if (data.cart.items && Array.isArray(data.cart.items)) {
          // Clear and repopulate cart with server response
          // For now, just update the local item
          const item: CartItem = {
            id: productId,
            name: product?.name ?? `Product ${productId}`,
            nameAr: product?.nameAr ?? `منتج ${productId}`,
            price: product?.price ?? 0,
            image: product?.image ?? "",
            category: product?.category ?? "",
            categoryAr: product?.categoryAr ?? "",
            quantity,
          };
          addItem(item);
        }
      }

      // Show success feedback
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(errorMessage);
      console.error("Add to cart error:", err);
      // Keep button clickable for retry
      setLoading(false);
      return;
    }

    setLoading(false);
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

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-sm">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={added || loading}
        className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5
          bg-gray-900 text-white font-semibold text-sm sm:text-base rounded-sm
          transition-all duration-200 hover:opacity-90 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-gray-400
          disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {isAr ? "جاري الإضافة..." : "Adding..."}
          </>
        ) : added ? (
          <>
            <ShoppingBag className="w-5 h-5" />
            {isAr ? "تمت الإضافة ✓" : "Added ✓"}
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            {isAr ? "أضف إلى السلة" : "Add to Cart"}
          </>
        )}
      </button>

      {/* Wishlist */}
      <button className="w-full px-4 py-2 text-sm font-medium text-gray-800 hover:text-gray-900 border border-gray-300 rounded-sm
        transition-all duration-200 hover:border-gray-900 cursor-pointer">
        {isAr ? "أضف إلى المفضلة" : "Add to Wishlist"}
      </button>
    </div>
  );
}
