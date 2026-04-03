"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/features/products/types";
import { ProductCard } from "@/features/products/components/ProductCard";

interface ProductCarouselProps {
  products: Product[];
  locale: string;
}

export function ProductCarousel({ products, locale }: ProductCarouselProps) {
  const isRtl = locale === "ar";

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    direction: isRtl ? "rtl" : "ltr",
    slidesToScroll: 2,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="group relative">
      {/* Navigation buttons */}
      <button
        id="product-carousel-prev"
        onClick={scrollPrev}
        aria-label="السابق"
        className="absolute -start-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-(--surface) text-(--text) shadow-(--shadow-hover) opacity-0 transition-all duration-200 hover:bg-(--primary) hover:text-white group-hover:opacity-100"
      >
        {isRtl ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-3">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_calc(50%-6px)] sm:flex-[0_0_calc(33.333%-8px)] lg:flex-[0_0_calc(25%-9px)]"
            >
              <ProductCard
                product={product}
                locale={locale}
                priority={index < 4}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        id="product-carousel-next"
        onClick={scrollNext}
        aria-label="التالي"
        className="absolute -inset-e-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-(--surface) text-(--text) shadow-(--shadow-hover) opacity-0 transition-all duration-200 hover:bg-(--primary) hover:text-white group-hover:opacity-100"
      >
        {isRtl ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
