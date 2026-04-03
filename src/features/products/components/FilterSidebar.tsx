"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";

interface FilterSidebarProps {
  locale: string;
}

export function FilterSidebar({ locale }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAr = locale === "ar";

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 on filter change
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const currentSort = searchParams.get("sort") ?? "newest";
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";
  const inStockOnly = searchParams.get("inStock") === "true";

  const sortOptions = [
    { value: "newest", label: isAr ? "الأحدث" : "Newest" },
    { value: "price-asc", label: isAr ? "السعر: من الأقل" : "Price: Low to High" },
    { value: "price-desc", label: isAr ? "السعر: من الأعلى" : "Price: High to Low" },
    { value: "rating", label: isAr ? "الأعلى تقييماً" : "Top Rated" },
    { value: "bestselling", label: isAr ? "الأكثر مبيعاً" : "Best Selling" },
  ];

  return (
    <aside
      aria-label={isAr ? "تصفية المنتجات" : "Filter products"}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-(--primary)" />
        <h2 className="font-bold text-(--text)">
          {isAr ? "تصفية النتائج" : "Filter Results"}
        </h2>
      </div>

      {/* Sort */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-(--text-muted)">
          {isAr ? "ترتيب حسب" : "Sort By"}
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm text-(--text) focus:border-(--primary) focus:outline-none focus:ring-2 focus:ring-(--primary)/20"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <p className="mb-2 text-sm font-semibold text-(--text-muted)">
          {isAr ? "نطاق السعر (جنيه)" : "Price Range (EGP)"}
        </p>
        <div className="flex items-center gap-2">
          <input
            id="min-price"
            type="number"
            placeholder={isAr ? "من" : "Min"}
            value={currentMinPrice}
            onChange={(e) => setParam("minPrice", e.target.value || null)}
            className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm text-(--text) focus:border-(--primary) focus:outline-none"
          />
          <span className="text-(--text-muted)">–</span>
          <input
            id="max-price"
            type="number"
            placeholder={isAr ? "إلى" : "Max"}
            value={currentMaxPrice}
            onChange={(e) => setParam("maxPrice", e.target.value || null)}
            className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm text-(--text) focus:border-(--primary) focus:outline-none"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="mb-2 text-sm font-semibold text-(--text-muted)">
          {isAr ? "الحد الأدنى للتقييم" : "Minimum Rating"}
        </p>
        <div className="space-y-1.5">
          {[4, 3, 2].map((rating) => (
            <button
              key={rating}
              id={`rating-filter-${rating}`}
              onClick={() =>
                setParam(
                  "rating",
                  searchParams.get("rating") === String(rating)
                    ? null
                    : String(rating),
                )
              }
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all ${searchParams.get("rating") === String(rating)
                ? "bg-(--primary) text-white"
                : "border border-(--border) bg-(--surface) text-(--text) hover:border-(--primary)"
                }`}
            >
              {"★".repeat(rating)}{"☆".repeat(5 - rating)}
              <span>{isAr ? "وأعلى" : "& up"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* In stock toggle */}
      <div>
        <label className="flex cursor-pointer items-center gap-3">
          <div className="relative">
            <input
              id="in-stock-toggle"
              type="checkbox"
              className="sr-only"
              checked={inStockOnly}
              onChange={(e) =>
                setParam("inStock", e.target.checked ? "true" : null)
              }
            />
            <div
              className={`h-5 w-9 rounded-full transition-colors ${inStockOnly ? "bg-(--primary)" : "bg-gray-300 dark:bg-gray-600"}`}
            >
              <div
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${inStockOnly ? "translate-x-4 rtl:-translate-x-4" : "translate-x-0.5"}`}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-(--text)">
            {isAr ? "متوفر فقط" : "In Stock Only"}
          </span>
        </label>
      </div>

      {/* Reset */}
      <button
        id="reset-filters"
        onClick={() => router.push(pathname)}
        className="w-full rounded-lg border border-(--border) bg-(--surface) py-2 text-sm font-semibold text-(--text) hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        {isAr ? "إعادة تعيين الفلاتر" : "Reset Filters"}
      </button>
    </aside>
  );
}
