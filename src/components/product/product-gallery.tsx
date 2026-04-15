"use client";

import { useState } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductViewer3D } from "@/components/product/product-viewer-3d";
import type { Model3D } from "@/lib/products-3d";

interface ProductGalleryProps {
  images: { id: number; src: string; alt: string }[];
  name: string;
  /** When provided, adds a 3D thumbnail that swaps in the 360° viewer */
  model3d?: Model3D;
}

// Sentinel value used in activeIndex to indicate "3D viewer is active"
const VIEW_3D = -1;

export function ProductGallery({ images, name, model3d }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square bg-[#FFFFFF] rounded-none border border-[#D4D4D4] flex items-center justify-center text-[#3A3A3A] text-sm">
        No image available
      </div>
    );
  }

  const is3DActive = activeIndex === VIEW_3D;
  const activeImage = is3DActive ? null : images[activeIndex];
  const showThumbnails = images.length > 1 || model3d;

  return (
    <div className="space-y-3">
      {/* Main area — image or 3D viewer */}
      {is3DActive && model3d ? (
        <ProductViewer3D model={model3d} name={name} />
      ) : (
        <div className="relative aspect-[4/3] bg-[#FFFFFF] rounded-none overflow-hidden border border-[#D4D4D4]">
          {activeImage && (
            <Image
              src={activeImage.src}
              alt={activeImage.alt || name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          )}
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="flex gap-2 flex-wrap" role="group" aria-label={`${name} views`}>
          {/* Image thumbnails */}
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              aria-label={img.alt || `${name} view ${i + 1}`}
              aria-current={i === activeIndex ? true : undefined}
              className={cn(
                "relative w-16 h-16 shrink-0 rounded-none overflow-hidden border-2 bg-[#FFFFFF] cursor-pointer transition-colors",
                i === activeIndex
                  ? "border-[#2C2C2C]"
                  : "border-transparent hover:border-[rgba(0,0,0,0.21)]"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt || `${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}

          {/* 3D thumbnail — only shown when a model is available */}
          {model3d && (
            <button
              onClick={() => setActiveIndex(VIEW_3D)}
              aria-label={`View ${name} in 360°`}
              aria-current={is3DActive ? true : undefined}
              className={cn(
                "relative w-16 h-16 shrink-0 rounded-none overflow-hidden border-2 bg-[#F5F5F5] cursor-pointer transition-colors",
                "flex flex-col items-center justify-center gap-0.5",
                is3DActive
                  ? "border-[#2C2C2C]"
                  : "border-transparent hover:border-[rgba(0,0,0,0.21)]"
              )}
            >
              <RotateCcw
                size={16}
                className="text-[#2C2C2C] shrink-0"
                aria-hidden="true"
              />
              <span className="text-[9px] font-semibold text-[#2C2C2C] leading-none tracking-wider uppercase">
                3D
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
