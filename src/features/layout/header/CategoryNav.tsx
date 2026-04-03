import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import type { Category } from "@/features/products/types";
import { CarouselItems } from "@/shared/ui/CarouselItems";
import { Button } from "@/shared/ui/Button";

interface CategoryNavProps {
  locale: string;
  isRtl: boolean;
  categoriesLabel: string;
  categories: Category[];
}

/**
 * CategoryNav — full-width scrollable category strip below main header
 */
export function CategoryNav({ locale, isRtl, categoriesLabel, categories }: CategoryNavProps) {
  return (
    <nav
      aria-label={isRtl ? "تصفح الأقسام" : "Browse categories"}
      className="border-t border-(--primary-dark)/20 bg-(--primary-dark)/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-2">
        <CarouselItems locale={locale} containerClassName="items-center">
          {/* All Categories link */}
          <Button variant="ghost" size="sm" asChild className="rounded-full h-7 px-3 text-white/80 hover:text-white hover:bg-white/10 shrink-0">
            <Link href={`/${locale}/categories`} className="flex items-center gap-1.5 text-xs font-semibold">
              <LayoutGrid className="h-3.5 w-3.5" />
              {categoriesLabel}
            </Link>
          </Button>

          {/* Divider */}
          <span className="h-4 w-px bg-white/20 shrink-0 self-center" />

          {/* Popular categories */}
          {categories.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/categories/${cat.slug}`}
              className="shrink-0 text-xs text-white/70 hover:text-white transition-colors whitespace-nowrap py-1 px-2 rounded-md hover:bg-white/10"
            >
              {isRtl ? cat.nameAr : cat.nameEn}
            </Link>
          ))}
        </CarouselItems>
      </div>
    </nav>
  );
}
