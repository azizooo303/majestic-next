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
    <div className="win2k-window flex flex-col bg-[#D4D0C8]">
      {/* Win2K title bar for each product */}
      <div className="win2k-titlebar px-2 py-0.5 flex items-center gap-1 text-xs">
        <span className="text-[10px]">&#128196;</span>
        <span className="truncate text-[10px]">{name}</span>
        {discount && (
          <span
            className="ml-auto text-[9px] font-bold px-1 py-0.5 flex-shrink-0"
            style={{ background: '#FF0000', color: '#FFFFFF' }}
          >
            -{discount}%
          </span>
        )}
      </div>

      {/* Image area — sunken panel */}
      <Link href={`/shop/${id}`} className="block p-1">
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '281/280',
            background: '#ECE9D8',
            border: '2px solid #808080',
            boxShadow: 'inset 1px 1px 0 #404040',
          }}
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </Link>

      {/* Info panel */}
      <div className="px-2 pb-2 flex flex-col gap-1">
        {/* Category label */}
        <p
          className="text-[10px] font-bold text-[#555] uppercase tracking-wide"
          style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
        >
          {category}
        </p>

        {/* Product name */}
        <Link href={`/shop/${id}`} className="no-underline">
          <h3
            className="text-xs font-bold text-black leading-tight hover:text-[#0000FF] hover:underline"
            style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
          >
            {name}
          </h3>
        </Link>

        {/* Brand */}
        <p className="text-[10px] text-[#555]">{brand}</p>

        {/* Separator */}
        <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #FFFFFF', height: '2px' }} />

        {/* Price row */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold text-black"
            style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
          >
            SAR {price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-[10px] text-[#808080] line-through">
              SAR {originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          className="win2k-btn-primary w-full text-[10px] py-1 mt-1"
          style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
        >
          {isAr ? "أضف إلى السلة" : "Add to Cart"}
        </button>

        {/* Properties link */}
        <Link
          href={`/shop/${id}`}
          className="text-[10px] text-[#0000FF] underline text-center block"
          style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}
        >
          {isAr ? "عرض التفاصيل..." : "View Details..."}
        </Link>
      </div>
    </div>
  );
}
