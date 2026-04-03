import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getProductsByCategory } from "@/features/products/api/getProducts";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { FilterSidebar } from "@/features/products/components/FilterSidebar";
import { ProductGridSkeleton } from "@/shared/ui/Skeleton";
import { mockCategories } from "@/shared/lib/mockData";
import type { Product } from "@/features/products/types";

export const revalidate = 300;

export async function generateStaticParams() {
  return mockCategories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = mockCategories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: locale === "ar" ? category.nameAr : category.nameEn,
    description:
      locale === "ar"
        ? `تسوق ${category.nameAr} بأفضل الأسعار`
        : `Shop ${category.nameEn} at the best prices`,
  };
}

// Helper: filter & sort products server-side based on searchParams
function applyFilters(
  products: Product[],
  searchParams: Record<string, string | undefined>,
): Product[] {
  let filtered = [...products];

  const minPrice = searchParams["minPrice"]
    ? Number(searchParams["minPrice"])
    : 0;
  const maxPrice = searchParams["maxPrice"]
    ? Number(searchParams["maxPrice"])
    : Infinity;
  const minRating = searchParams["rating"] ? Number(searchParams["rating"]) : 0;
  const inStockOnly = searchParams["inStock"] === "true";
  const sort = searchParams["sort"] ?? "newest";

  if (minPrice > 0) {
    filtered = filtered.filter((p) => {
      const price = p.discountedPrice > 0 ? p.discountedPrice : p.price;
      return price >= minPrice;
    });
  }

  if (maxPrice < Infinity) {
    filtered = filtered.filter((p) => {
      const price = p.discountedPrice > 0 ? p.discountedPrice : p.price;
      return price <= maxPrice;
    });
  }

  if (minRating > 0) {
    filtered = filtered.filter((p) => p.rating >= minRating);
  }

  if (inStockOnly) {
    filtered = filtered.filter((p) => p.inStock);
  }

  switch (sort) {
    case "price-asc":
      filtered.sort(
        (a, b) =>
          (a.discountedPrice || a.price) - (b.discountedPrice || b.price),
      );
      break;
    case "price-desc":
      filtered.sort(
        (a, b) =>
          (b.discountedPrice || b.price) - (a.discountedPrice || a.price),
      );
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "bestselling":
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default: // newest
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  return filtered;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ locale, slug }, resolvedSearch] = await Promise.all([
    params,
    searchParams,
  ]);

  const isAr = locale === "ar";
  const category = mockCategories.find((c) => c.slug === slug);
  if (!category) notFound();

  const t = await getTranslations("filter");

  const allProducts = await getProductsByCategory(slug);
  const products = applyFilters(allProducts, resolvedSearch);

  const categoryName = isAr ? category.nameAr : category.nameEn;
  const currentPage = Number(resolvedSearch["page"] ?? "1");
  const pageSize = 12;
  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav
        aria-label="breadcrumb"
        className="mb-6 flex items-center gap-2 text-sm text-(--text-muted)"
      >
        <a
          href={`/${locale}`}
          className="hover:text-(--primary) transition-colors"
        >
          {isAr ? "الرئيسية" : "Home"}
        </a>
        <span>/</span>
        <span className="font-semibold text-(--text)">{categoryName}</span>
      </nav>

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-(--text) sm:text-3xl">
          {categoryName}
        </h1>
        <p className="mt-1 text-sm text-(--text-muted)">
          {products.length}{" "}
          {isAr ? "منتج" : "products"}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Filters — client island, hidden on mobile */}
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow-card)">
            <Suspense fallback={null}>
              <FilterSidebar locale={locale} />
            </Suspense>
          </div>
        </div>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {/* Mobile filters row */}
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <p className="text-sm text-(--text-muted)">
              {products.length} {isAr ? "منتج" : "products"}
            </p>
            <Suspense fallback={null}>
              <FilterSidebar locale={locale} />
            </Suspense>
          </div>

          <Suspense fallback={<ProductGridSkeleton count={12} />}>
            <ProductGrid products={paginatedProducts} locale={locale} />
          </Suspense>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label={isAr ? "تصفح الصفحات" : "Page navigation"}
              className="mt-8 flex items-center justify-center gap-2"
            >
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const params = new URLSearchParams(
                  Object.fromEntries(
                    Object.entries(resolvedSearch).filter(
                      ([, v]) => v !== undefined,
                    ) as [string, string][],
                  ),
                );
                params.set("page", String(page));
                return (
                  <a
                    key={page}
                    id={`page-link-${page}`}
                    href={`/${locale}/categories/${slug}?${params.toString()}`}
                    aria-label={`${isAr ? "صفحة" : "Page"} ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all ${currentPage === page
                      ? "bg-(--primary) text-white"
                      : "border border-(--border) bg-(--surface) text-(--text) hover:border-(--primary) hover:text-(--primary)"
                      }`}
                  >
                    {page}
                  </a>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
