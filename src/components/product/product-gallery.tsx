"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: { id: number; src: string; alt: string }[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square bg-[#FFFFFF] rounded-none border border-[#D4D4D4] flex items-center justify-center text-[#3A3A3A] text-sm">
        No image available
      </div>
    );
  }

  const activeImage = images[activeIndex];
  const showThumbnails = images.length > 1;

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/3] bg-[#F5F5F5] rounded-none overflow-hidden border border-[#D4D4D4]">
        <Image
          src={activeImage.src}
          alt={activeImage.alt || name}
          fill
          priority
          className="object-contain p-4"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </div>

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="flex gap-2 flex-wrap" role="group" aria-label={`${name} views`}>
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              aria-label={img.alt || `${name} view ${i + 1}`}
              aria-current={i === activeIndex ? true : undefined}
              className={cn(
                "relative w-16 h-16 shrink-0 rounded-none overflow-hidden border-2 bg-[#F5F5F5] cursor-pointer transition-colors",
                i === activeIndex
                  ? "border-[#2C2C2C]"
                  : "border-transparent hover:border-[rgba(0,0,0,0.21)]"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt || `${name} ${i + 1}`}
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
