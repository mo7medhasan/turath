"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/features/products/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";

interface HeroBannerCarouselProps {
  banners: Banner[];
  locale: string;
}

export function HeroBannerCarousel({ banners, locale }: HeroBannerCarouselProps) {
  const isRtl = locale === "ar";
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: isRtl ? "rtl" : "ltr" },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="group relative overflow-hidden rounded-2xl">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex" style={{ touchAction: "pan-y" }}>
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="relative min-w-0 flex-[0_0_100%]"
              style={{ backgroundColor: banner.bgColor }}
            >
              {/* Background Image */}
              <div className="relative h-[280px] sm:h-[380px] lg:h-[480px]">
                <Image
                  src={banner.image}
                  alt={isRtl ? banner.titleAr : banner.titleEn}
                  fill
                  sizes="100vw"
                  className="object-cover opacity-50"
                  priority={index === 0}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-e from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center ps-8 pe-4 sm:ps-16">
                  <h2 className="text-2xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl max-w-lg">
                    {isRtl ? banner.titleAr : banner.titleEn}
                  </h2>
                  <p className="mt-3 text-sm text-white/80 sm:text-lg max-w-md">
                    {isRtl ? banner.subtitleAr : banner.subtitleEn}
                  </p>
                  <Button  size={"default"} asChild>
                    <Link
                      href={`/${locale}${banner.ctaLink}`}
                      className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-(--primary)/50 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-(--primary-dark)/80 hover:shadow-lg active:scale-95 sm:text-base"
                    >
                      {isRtl ? banner.ctaTextAr : banner.ctaTextEn}
                    </Link> 
                    </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        id="hero-carousel-prev"
        onClick={scrollPrev}
        aria-label="السابق"
        className="absolute inset-s-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-white/40 group-hover:opacity-100"
      >
        {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
      <button
        id="hero-carousel-next"
        onClick={scrollNext}
        aria-label="التالي"
        className="absolute inset-e-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-white/40 group-hover:opacity-100"
      >
        {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4  inset-x-0 flex justify-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            id={`hero-dot-${index}`}
            onClick={() => scrollTo(index)}
            aria-label={`الشريحة ${index + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              selectedIndex === index
                ? "w-6 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75",
            )}
          />
        ))}
      </div>
    </div>
  );
}
