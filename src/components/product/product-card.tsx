import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/woocommerce";

interface ProductCardProps {
  product: {
    id: number;
    slug: string;
    name: string;
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
      className="group block bg-white rounded-xl overflow-hidden shadow-sm
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden bg-light relative">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || product.name}
            fill
            className="object-cover transition-transform duration-500
              group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-disabled">
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

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm md:text-base font-medium text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </h3>
        {product.categories[0] && (
          <p className="text-xs text-gray-800/70 mt-1">
            {product.categories[0].name}
          </p>
        )}
        {showPrice && product.price && (
          <p className="text-sm font-semibold text-gray-900 mt-2">
            {formatPrice(product.price, locale)}
          </p>
        )}
      </div>
    </Link>
  );
}
