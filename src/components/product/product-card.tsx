import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/woocommerce";

interface ProductCardProps {
  product: {
    id: number;
    slug: string;
    name: string;
    nameAr?: string;
    price: string;
    images: { src: string; alt: string }[];
    categories: { name: string }[];
  };
  locale: string;
  showPrice?: boolean;
}

export function ProductCard({
  product,
  locale,
  showPrice = true,
}: ProductCardProps) {
  const image = product.images[0];

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block bg-white rounded-none overflow-hidden border border-transparent
        transition-[border-color] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:border-[#D4D4D4] cursor-pointer"
    >
      {/* Image — 4/5 aspect, zoom on hover, no shadow/translate */}
      <div className="aspect-[4/5] overflow-hidden bg-[#F5F5F5] relative">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#E7E7E7]">
            <svg
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Info — order: category eyebrow → name → price */}
      <div className="pt-4 pb-2 px-0">
        {product.categories[0] && (
          <p className="overline mb-1">
            {product.categories[0].name}
          </p>
        )}
        <h3
          className="text-[15px] font-medium leading-[1.25] text-[#2C2C2C] line-clamp-2
            [dir=rtl]:text-[16px] [dir=rtl]:font-normal"
        >
          {product.name}
        </h3>
        {showPrice && product.price && (
          <p className="text-[15px] font-medium text-[#2C2C2C] mt-2">
            {formatPrice(product.price, locale)}
          </p>
        )}
      </div>
    </Link>
  );
}
