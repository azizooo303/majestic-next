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
      <div className="aspect-square bg-light rounded-xl flex items-center justify-center text-disabled">
        No image available
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-xl overflow-hidden">
        <Image
          src={activeImage.src}
          alt={activeImage.alt || name}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer",
                i === activeIndex ? "border-gold" : "border-transparent hover:border-border"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt || `${name} view ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
