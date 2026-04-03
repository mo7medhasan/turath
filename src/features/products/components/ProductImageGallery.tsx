"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/cn";
import { ZoomIn } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

export function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const validImages =
    images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-900 cursor-zoom-in"
        role="img"
        aria-label={name}
      >
        <Image
          src={validImages[activeIndex] ?? validImages[0] ?? ""}
          alt={`${name} - صورة ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <div className="absolute bottom-3 end-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-4 w-4" />
        </div>
      </div>

      {/* Thumbnail strip — only shown when multiple images */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {validImages.map((src, i) => (
            <button
              key={i}
              id={`gallery-thumb-${i}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`صورة ${i + 1}`}
              aria-pressed={activeIndex === i}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl transition-all duration-200",
                activeIndex === i
                  ? "ring-2 ring-(--primary) ring-offset-2"
                  : "ring-1 ring-(--border) hover:ring-(--primary) opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={src}
                alt={`${name} - مصغرة ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
