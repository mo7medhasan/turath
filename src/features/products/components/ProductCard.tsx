import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/features/products/types";
import { formatPrice, getDisplayPrice } from "@/shared/lib/formatPrice";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { cn } from "@/shared/lib/cn";

interface ProductCardProps {
  product: Product;
  locale: string;
  priority?: boolean;
}

// Server Component — no "use client"
export function ProductCard({ product, locale, priority = false }: ProductCardProps) {
  const isAr = locale === "ar";
  const name = isAr ? product.nameAr : product.nameEn;
  const displayPrice = getDisplayPrice(product.price, product.discountedPrice);
  const hasDiscount = product.discountedPrice > 0 && product.discountedPrice < product.price;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-(--surface) shadow-(--shadow-card) transition-all duration-200 hover:shadow-(--shadow-hover) hover:-translate-y-0.5">
      {/* Image */}
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900"
        aria-label={name}
      >
        <Image
          src={product.images[0] ?? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
        />

        {/* Badges */}
        <div className="absolute start-2 top-2 flex flex-col gap-1">
          {hasDiscount && (
            <span className="rounded-md bg-(--primary) px-1.5 py-0.5 text-xs font-bold text-white">
              {product.discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-md bg-(--success) px-1.5 py-0.5 text-xs font-bold text-white">
              {isAr ? "جديد" : "New"}
            </span>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-lg bg-white/90 px-3 py-1 text-sm font-bold text-gray-700">
              {isAr ? "نفد المخزون" : "Out of Stock"}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        {/* Brand */}
        <p className="mb-1 text-xs font-medium text-(--text-muted) uppercase tracking-wide">
          {product.brand}
        </p>

        {/* Name */}
        <Link href={`/${locale}/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-(--text) hover:text-(--primary) transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(product.rating)
                    ? "fill-(--warning) text-(--warning)"
                    : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700",
                )}
              />
            ))}
          </div>
          <span className="text-xs text-(--text-muted)">
            ({product.reviewCount.toLocaleString(isAr ? "ar-EG" : "en-US")})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-2">
          <div className="flex flex-wrap items-baseline gap-1">
            <span className="text-base font-bold text-(--primary)">
              {formatPrice(displayPrice, locale)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-(--text-muted) line-through">
                {formatPrice(product.price, locale)}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <div className="mt-2">
            <AddToCartButton product={product} locale={locale} size="sm" className="w-full" />
          </div>
        </div>
      </div>
    </article>
  );
}
