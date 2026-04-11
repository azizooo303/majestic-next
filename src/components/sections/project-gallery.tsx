"use client";

import { useState } from "react";
import Image from "next/image";

export function ProjectGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm bg-[#F5F5F5] mb-4">
        <Image
          key={active}
          src={images[active]}
          alt={`${name} — image ${active + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 75vw"
          priority={active === 0}
          unoptimized
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-sm border-2 transition-colors ${
                i === active ? "border-[#2C2C2C]" : "border-transparent hover:border-[#D4D4D4]"
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
