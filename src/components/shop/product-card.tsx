"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";

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
  return (
    <div className="group bg-white border border-[rgba(0,0,0,0.21)] rounded-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Clickable image + info area */}
      <Link href={`/shop/${id}`} className="block">
        <div className="relative aspect-square bg-[#fafafa] overflow-hidden">
          {discount && (
            <span className="absolute top-2 start-2 z-10 bg-[#e53e3e] text-white text-xs font-bold px-2 py-0.5 rounded-sm">
              -{discount}%
            </span>
          )}
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
        <div className="p-3 pb-2">
          <p className="text-xs text-[#484848] uppercase tracking-wide">{category}</p>
          <h3 className="text-sm font-bold text-gray-900] mt-1 leading-tight">{name}</h3>
          {brand && <p className="text-xs text-[#484848] mt-0.5">{brand}</p>}
          <div className="flex items-center gap-2 mt-2">
            {price > 0 ? (
              <>
                <span className="font-bold text-gray-900] text-sm">
                  {isAr ? `${price.toLocaleString("ar-SA")} ر.س` : `SAR ${price.toLocaleString()}`}
                </span>
                {originalPrice && (
                  <span className="text-xs text-[#484848] line-through">
                    {isAr ? `${originalPrice.toLocaleString("ar-SA")} ر.س` : `SAR ${originalPrice.toLocaleString()}`}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs text-[#484848]">
                {isAr ? "اتصل للسعر" : "Contact for price"}
              </span>
            )}
          </div>
        </div>
      </Link>
      {/* Add to Cart — outside the Link */}
      <div className="px-3 pb-3">
        <button
          className="btn-press w-full bg-white] text-white py-2 text-xs font-semibold
            rounded-sm hover:bg-[#333] transition-colors cursor-pointer"
          onClick={() => {/* cart integration coming */}}
        >
          {isAr ? "أضف إلى السلة" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
