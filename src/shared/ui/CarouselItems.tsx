"use client";

import React, { ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/shared/lib/cn";

export interface CarouselItemsProps {
  /** The items/slides to be rendered in the carousel */
  children: ReactNode;
  /** Current locale for LTR/RTL support */
  locale: string;
  /** Custom class name for the wrapper */
  className?: string;
  /** Custom class name for each individual slide wrapper */
  itemClassName?: string;
  /** Custom class name for the container */
  containerClassName?: string;
}

export function CarouselItems({
  children,
  locale,
  className,
  itemClassName,
  containerClassName,
}: CarouselItemsProps) {
  const isRtl = locale === "ar";

  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: "start",
    direction: isRtl ? "rtl" : "ltr",
    dragFree: true, // "width is fit" works best with dragFree to smoothly scroll various sizes
  });

  return (
    <div className={cn("group relative w-full", className)}>
      <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
        <div className={cn("flex gap-3", containerClassName)}>
          {React.Children.map(children, (child) => (
            <div className={cn("min-w-0 flex-[0_0_auto]", itemClassName)}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
