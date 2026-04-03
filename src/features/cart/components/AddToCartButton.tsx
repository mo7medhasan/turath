"use client";

import { useCartStore } from "@/features/cart/store/useCartStore";
import { ShoppingCart, Plus } from "lucide-react";
import type { Product } from "@/features/products/types";
import { cn } from "@/shared/lib/cn";

interface AddToCartButtonProps {
  product: Product;
  variant?: string;
  locale?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AddToCartButton({
  product,
  variant,
  locale = "ar",
  className,
  size = "md",
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const isDisabled = !product.inStock;

  const handleClick = () => {
    if (!isDisabled) {
      addItem(product, variant);
    }
  };

  const label =
    locale === "ar"
      ? isDisabled
        ? "نفد المخزون"
        : "أضف للسلة"
      : isDisabled
        ? "Out of Stock"
        : "Add to Cart";

  return (
    <button
      id={`add-to-cart-${product.id}`}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={label}
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:ring-offset-2",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-6 text-base w-full",
        isDisabled
          ? "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
          : "bg-(--primary) text-white hover:bg-(--primary-dark) active:scale-95 shadow-sm hover:shadow-md",
        className,
      )}
    >
      {size === "lg" ? (
        <ShoppingCart className="h-5 w-5"  fill="currentColor"/>
      ) : (
        <Plus className="h-4 w-4"   fill="currentColor"/>
      )}
      <span>{label}</span>
    </button>
  );
}
