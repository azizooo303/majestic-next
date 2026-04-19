"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/context/cart-context";

function parseCategory(raw: string): string {
  return raw
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'");
}

export interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  isAr: boolean;
}

export function ProductCard({
  id,
  name,
  category,
  brand,
  price,
  originalPrice,
  discount,
  image,
  isAr,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      id,
      name,
      nameAr: name,
      price,
      image,
      category,
      categoryAr: category,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="group bg-white border border-[rgba(0,0,0,0.21)] rounded-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Clickable image + info area */}
      <Link href={`/shop/${id}`} className="block">
        <div className="relative aspect-square bg-[#fafafa] overflow-hidden">
          {discount && (
            <span className="absolute top-2 start-2 z-10 bg-[#2C2C2C] text-white text-xs font-bold px-2 py-0.5 rounded-sm">
              -{discount}%
            </span>
          )}
          <Image
            src={image || "https://lightyellow-mallard-240169.hostingersite.com/wp-content/uploads/2026/03/hero_office_desktop_en-1.png"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://lightyellow-mallard-240169.hostingersite.com/wp-content/uploads/2026/03/hero_office_desktop_en-1.png"; }}
          />
        </div>
        <div className="p-3 pb-2">
          <p className="text-xs text-[#3A3A3A] uppercase tracking-wide">{parseCategory(category)}</p>
          <h3 className="text-sm font-bold text-[#2C2C2C] mt-1 leading-tight">{name}</h3>
          {brand && <p className="text-xs text-[#3A3A3A] mt-0.5">{brand}</p>}
          <div className="flex items-center gap-2 mt-2">
            {price > 0 ? (
              <>
                <span className="font-bold text-[#2C2C2C] text-sm">
                  {isAr ? `${price.toLocaleString("ar-SA")} ر.س` : `SAR ${price.toLocaleString()}`}
                </span>
                {originalPrice && (
                  <span className="text-xs text-[#3A3A3A] line-through">
                    {isAr ? `${originalPrice.toLocaleString("ar-SA")} ر.س` : `SAR ${originalPrice.toLocaleString()}`}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs text-[#3A3A3A]">
                {isAr ? "اتصل للسعر" : "Contact for price"}
              </span>
            )}
          </div>
        </div>
      </Link>
      {/* Add to Cart — outside the Link */}
      <div className="px-3 pb-3">
        <button
          className="w-full bg-[#2C2C2C] text-white py-2 text-xs font-semibold
            rounded-none hover:bg-[#3A3A3A] transition-colors cursor-pointer
            disabled:bg-[#E7E7E7] disabled:text-[#3A3A3A] disabled:cursor-default"
          onClick={handleAddToCart}
          disabled={added}
          aria-label={
            added
              ? isAr ? "تمت الإضافة" : "Added to cart"
              : isAr ? "أضف إلى السلة" : "Add to cart"
          }
        >
          {added
            ? isAr ? "تمت الإضافة" : "Added"
            : isAr ? "أضف إلى السلة" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
