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
    <Link
      href={`/shop/${id}`}
      className="group bg-white border border-[rgba(0,0,0,0.21)] rounded-sm overflow-hidden
        transition-all duration-200 hover:shadow-md block"
    >
      {/* Product image */}
      <div className="relative aspect-[281/356] bg-[#fafafa] overflow-hidden">
        {discount && (
          <span
            className="absolute top-2 start-2 z-10 bg-[#e53e3e] text-white
            text-xs font-bold px-2 py-0.5 rounded-sm"
          >
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
      {/* Product info */}
      <div className="p-3">
        <p className="text-xs text-[#484848] uppercase tracking-wide">
          {category}
        </p>
        <h3 className="text-sm font-bold text-[#0c0c0c] mt-1 leading-tight">
          {name}
        </h3>
        <p className="text-xs text-[#484848] mt-0.5">{brand}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-[#0c0c0c] text-sm">
            SAR {price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-xs text-[#484848] line-through">
              SAR {originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <button
          className="btn-press w-full mt-3 bg-[#0c0c0c] text-white py-2 text-xs font-semibold
          rounded-sm hover:bg-[#333] transition-colors cursor-pointer"
        >
          {isAr ? "أضف إلى السلة" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}
