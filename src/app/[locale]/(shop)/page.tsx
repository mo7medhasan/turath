import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Truck, ShieldCheck, Headphones, RefreshCw } from "lucide-react";
import type { Metadata } from "next";

import { getOffers } from "@/features/offers/api/getOffers";
import { getFeaturedProducts, getNewArrivals } from "@/features/products/api/getProducts";
import { HeroBannerCarousel } from "@/features/offers/components/HeroBanner";
import { ProductCarousel } from "@/features/products/components/ProductCarousel";
import { ProductGridSkeleton } from "@/shared/ui/Skeleton";
import { Card } from "@/shared/ui/Card";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { mockCategories } from "@/shared/lib/mockData";

import { QuickNavCards } from "@/features/home/components/QuickNavCards";
import { TrustFeatures } from "@/features/home/components/TrustFeatures";
import { CategoryGrid } from "@/features/home/components/CategoryGrid";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "ar"
        ? "الرئيسية - أفضل العروض والمنتجات"
        : "Home - Best Deals & Products",
  };
}

// Server Component — no "use client"
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("offers");
  const tTrust = await getTranslations("trust");
  const isRtl = locale === "ar";

  // Parallel data fetching
  const [banners, featuredProducts, newArrivals] = await Promise.all([
    getOffers(),
    getFeaturedProducts(10),
    getNewArrivals(8),
  ]);

  const trustFeatures = [
    { icon: Truck,        title: tTrust("fastShipping"),  desc: tTrust("fastShippingDesc") },
    { icon: ShieldCheck,  title: tTrust("guarantee"),     desc: tTrust("guaranteeDesc")    },
    { icon: Headphones,   title: tTrust("support"),       desc: tTrust("supportDesc")      },
    { icon: RefreshCw,    title: tTrust("returns"),       desc: tTrust("returnsDesc")      },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 space-y-8 py-6">
      {/* ─── Hero Carousel ─── */}
      <section aria-label={isRtl ? "العروض المميزة" : "Featured Offers"}>
        <HeroBannerCarousel banners={banners} locale={locale} />
      </section>

      {/* ─── Quick Navigation Cards ─── */}
      <QuickNavCards locale={locale} isRtl={isRtl} />

      {/* ─── Trust Features ─── */}
      <TrustFeatures isRtl={isRtl} features={trustFeatures} />

      {/* ─── Today's Deals ─── */}
      <Card className="p-4 sm:p-6">
        <SectionHeader
          id="today-deals-heading"
          title={t("todayDeals")}
          viewAllHref={`/${locale}/offers`}
          viewAllLabel={t("viewAll")}
          isRtl={isRtl}
        />
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <ProductCarousel products={featuredProducts} locale={locale} />
        </Suspense>
      </Card>

      {/* ─── New Arrivals ─── */}
      <Card className="p-4 sm:p-6">
        <SectionHeader
          id="new-arrivals-heading"
          title={t("newArrivals")}
          viewAllHref={`/${locale}/categories`}
          viewAllLabel={t("viewAll")}
          isRtl={isRtl}
        />
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <ProductCarousel products={newArrivals} locale={locale} />
        </Suspense>
      </Card>

      {/* ─── Popular Categories Grid ─── */}
      <CategoryGrid categories={mockCategories} locale={locale} isRtl={isRtl} />
    </main>
  );
}
