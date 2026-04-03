import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Star, Package, ShieldCheck, Truck } from "lucide-react";
import { getProductBySlug, getAllProductSlugs } from "@/features/products/api/getProductBySlug";
import { getProductsByCategory } from "@/features/products/api/getProducts";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { ProductCarousel } from "@/features/products/components/ProductCarousel";
import { ProductGridSkeleton } from "@/shared/ui/Skeleton";
import { ProductImageGallery } from "@/features/products/components/ProductImageGallery";
import { formatPrice, calculateSavings } from "@/shared/lib/formatPrice";
import { cn } from "@/shared/lib/cn";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  // Pre-render top 20 products at build time
  return slugs.slice(0, 20).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: locale === "ar" ? product.nameAr : product.nameEn,
    description: product.descriptionAr,
    openGraph: {
      images: [product.images[0] ?? ""],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("product");
  const isAr = locale === "ar";

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getProductsByCategory(product.category, 8);
  const related = relatedProducts.filter((p) => p.id !== product.id);

  const name = isAr ? product.nameAr : product.nameEn;
  const displayPrice =
    product.discountedPrice > 0 ? product.discountedPrice : product.price;
  const hasDiscount =
    product.discountedPrice > 0 && product.discountedPrice < product.price;
  const savings = calculateSavings(product.price, product.discountedPrice);

  const specs = [
    { label: isAr ? "الماركة" : "Brand", value: product.brand },
    { label: isAr ? "الفئة" : "Category", value: isAr ? product.category : product.category },
    { label: isAr ? "الحالة" : "Condition", value: isAr ? "جديد" : "New" },
    { label: isAr ? "المخزون" : "Stock", value: product.inStock ? (isAr ? "متوفر" : "In Stock") : (isAr ? "غير متوفر" : "Out of Stock") },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-10">
      {/* ─── Breadcrumb ─── */}
      <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-(--text-muted)">
        <a href={`/${locale}`} className="hover:text-(--primary) transition-colors">
          {isAr ? "الرئيسية" : "Home"}
        </a>
        <span>/</span>
        <a href={`/${locale}/categories/${product.category}`} className="hover:text-(--primary) transition-colors capitalize">
          {product.category}
        </a>
        <span>/</span>
        <span className="text-(--text) font-medium line-clamp-1 max-w-48">{name}</span>
      </nav>

      {/* ─── Product Main Section ─── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Gallery — client island */}
        <ProductImageGallery images={product.images} name={name} />

        {/* Product Info — Server */}
        <div className="flex flex-col gap-4">
          {/* Brand */}
          <p className="text-sm font-semibold uppercase tracking-wider text-(--text-muted)">
            {product.brand}
          </p>

          {/* Name */}
          <h1 className="text-2xl font-bold leading-snug text-(--text) sm:text-3xl">
            {name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating)
                      ? "fill-(--warning) text-(--warning)"
                      : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700",
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-(--text)">
              {product.rating}
            </span>
            <span className="text-sm text-(--text-muted)">
              ({product.reviewCount.toLocaleString(isAr ? "ar-EG" : "en-US")}{" "}
              {t("reviews")})
            </span>
          </div>

          {/* Price Block */}
          <div className="rounded-2xl bg-(--surface-2) p-4 space-y-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-black text-(--primary)">
                {formatPrice(displayPrice, locale)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-(--text-muted) line-through">
                    {formatPrice(product.price, locale)}
                  </span>
                  <span className="rounded-lg bg-(--primary) px-2 py-0.5 text-sm font-bold text-white">
                    {product.discountPercent}% {t("discount")}
                  </span>
                </>
              )}
            </div>
            {hasDiscount && (
              <p className="text-sm font-semibold text-(--success)">
                {t("savings")}: {formatPrice(savings, locale)}
              </p>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                product.inStock ? "bg-(--success)" : "bg-red-500",
              )}
            />
            <span
              className={cn(
                "text-sm font-semibold",
                product.inStock ? "text-(--success)" : "text-red-500",
              )}
            >
              {product.inStock ? t("inStock") : t("outOfStockLabel")}
            </span>
          </div>

          {/* Add to Cart — client island */}
          <div className="pt-2">
            <AddToCartButton
              product={product}
              locale={locale}
              size="lg"
            />
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { icon: Truck, label: isAr ? "شحن سريع" : "Fast Shipping" },
              { icon: ShieldCheck, label: isAr ? "ضمان سنة" : "1yr Warranty" },
              { icon: Package, label: isAr ? "إرجاع 30 يوم" : "30d Returns" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 rounded-xl border border-(--border) bg-(--surface) p-2.5 text-center"
              >
                <Icon className="h-5 w-5 text-(--primary)" />
                <span className="text-xs font-semibold text-(--text-muted)">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="border-t border-(--border) pt-4">
            <h2 className="mb-2 text-base font-bold text-(--text)">
              {t("description")}
            </h2>
            <p className="text-sm leading-relaxed text-(--text-muted)">
              {product.descriptionAr}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="border-t border-(--border) pt-4">
            <h2 className="mb-3 text-base font-bold text-(--text)">
              {t("specifications")}
            </h2>
            <div className="overflow-hidden rounded-xl border border-(--border)">
              {specs.map(({ label, value }, i) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center",
                    i % 2 === 0
                      ? "bg-(--surface-2)"
                      : "bg-(--surface) ",
                  )}
                >
                  <dt className="w-1/3 px-4 py-2.5 text-sm font-semibold text-(--text-muted)">
                    {label}
                  </dt>
                  <dd className="flex-1 border-s border-(--border) px-4 py-2.5 text-sm font-medium text-(--text)">
                    {value}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Related Products ─── */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="mb-4 text-xl font-bold text-(--text)"
          >
            {t("relatedProducts")}
          </h2>
          <Suspense fallback={<ProductGridSkeleton count={4} />}>
            <ProductCarousel products={related} locale={locale} />
          </Suspense>
        </section>
      )}
    </div>
  );
}
