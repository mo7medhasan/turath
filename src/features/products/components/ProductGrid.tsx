import { ProductCard } from "./ProductCard";
import type { Product } from "@/features/products/types";

interface ProductGridProps {
  products: Product[];
  locale: string;
  columns?: 2 | 3 | 4;
}

// Server Component — no "use client"
export function ProductGrid({
  products,
  locale,
  columns = 4,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-semibold text-(--text)">
          {locale === "ar" ? "لا توجد منتجات" : "No products found"}
        </p>
        <p className="mt-2 text-sm text-(--text-muted)">
          {locale === "ar"
            ? "حاول تغيير الفلتر أو التصفية"
            : "Try changing your filters"}
        </p>
      </div>
    );
  }

  const gridClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={`grid ${gridClass} gap-3 sm:gap-4`}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
