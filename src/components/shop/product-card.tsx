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
    <div className="group bg-white border border-transparent rounded-none overflow-hidden transition-[border-color] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-[#D4D4D4]">
      {/* Clickable image + info area */}
      <Link href={`/shop/${id}`} className="block">
        <div className="relative aspect-[4/5] bg-[#FFFFFF] overflow-hidden border border-[#E7E7E7] group-hover:border-[#D4D4D4] transition-colors">
          {discount && (
            <span className="absolute top-3 start-3 z-10 bg-[#2C2C2C] text-white text-[11px] font-semibold px-2 py-1 rounded-none tracking-[0.04em]">
              -{discount}%
            </span>
          )}
          <div className="absolute inset-2">
            <Image
              src={image || "https://lightyellow-mallard-240169.hostingersite.com/wp-content/uploads/2026/03/hero_office_desktop_en-1.png"}
              alt={name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://lightyellow-mallard-240169.hostingersite.com/wp-content/uploads/2026/03/hero_office_desktop_en-1.png"; }}
            />
          </div>
        </div>
        <div className="pt-4 pb-2 px-0">
          <p className="overline mb-1">{parseCategory(category)}</p>
          <h3 className="text-[15px] font-medium text-[#2C2C2C] leading-[1.25] line-clamp-2 [dir=rtl]:text-[16px] [dir=rtl]:font-normal">{name}</h3>
          {brand && <p className="text-[12px] text-[#6B6B6B] mt-1">{brand}</p>}
          <div className="flex items-baseline gap-2 mt-2">
            {price > 0 ? (
              <>
                <span className="text-[15px] font-medium text-[#2C2C2C]">
                  {isAr ? `${price.toLocaleString("ar-SA")} ر.س` : `SAR ${price.toLocaleString()}`}
                </span>
                {originalPrice && (
                  <span className="text-[12px] text-[#6B6B6B] line-through">
                    {isAr ? `${originalPrice.toLocaleString("ar-SA")} ر.س` : `SAR ${originalPrice.toLocaleString()}`}
                  </span>
                )}
              </>
            ) : (
              <span className="text-[13px] text-[#6B6B6B]">
                {isAr ? "اتصل للسعر" : "Contact for price"}
              </span>
            )}
          </div>
        </div>
      </Link>
      {/* Add to Cart — outside the Link */}
      <div className="px-0 pb-0 pt-2">
        <button
          className="w-full bg-[#2C2C2C] text-white h-11 text-[13px] font-semibold
            rounded-none hover:bg-[#3A3A3A] transition-colors cursor-pointer active:scale-[0.98]
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
