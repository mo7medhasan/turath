import type { Product } from "@/features/products/types";
import { mockProducts } from "@/shared/lib/mockData";

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 0));
  return mockProducts.find((p) => p.slug === slug);
}

export async function getAllProductSlugs(): Promise<string[]> {
  return mockProducts.map((p) => p.slug);
}
