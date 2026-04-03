import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/features/products/types";

interface CategoryGridProps {
  categories: Category[];
  locale: string;
  isRtl: boolean;
}

export function CategoryGrid({ categories, locale, isRtl }: CategoryGridProps) {
  return (
    <section aria-labelledby="popular-cats-heading">
      <h2
        id="popular-cats-heading"
        className="mb-4 text-xl font-bold text-(--text)"
      >
        {isRtl ? "تسوق حسب الفئة" : "Shop by Category"}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {categories.slice(0, 6).map((cat, index) => {
          const isFeatured = index === 0;
          return (
            <Link
              key={cat.id}
              href={`/${locale}/categories/${cat.slug}`}
              className={`group relative overflow-hidden rounded-2xl ${isFeatured ? "sm:col-span-2 sm:row-span-2" : ""}`}
            >
              <div className={`relative ${isFeatured ? "h-40 sm:h-full sm:min-h-64" : "h-36"}`}>
                <Image
                  src={cat.image}
                  alt={isRtl ? cat.nameAr : cat.nameEn}
                  fill
                  sizes={isFeatured ? "66vw" : "33vw"}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                {/* Text overlay */}
                <div className="absolute bottom-3 start-3 end-3">
                  <p className="text-sm font-bold text-white drop-shadow-sm">
                    {isRtl ? cat.nameAr : cat.nameEn}
                  </p>
                  <p className="text-xs text-white/70">
                    {cat.productCount} {isRtl ? "منتج" : "products"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
