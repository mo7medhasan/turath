import type { Product } from "@/features/products/types";
import { mockProducts } from "@/shared/lib/mockData";

export async function getProducts(
  options: {
    category?: string;
    featured?: boolean;
    isNew?: boolean;
    limit?: number;
    offset?: number;
  } = {},
): Promise<Product[]> {
  // Simulate async data fetching
  await new Promise((resolve) => setTimeout(resolve, 0));

  let products = [...mockProducts];

  if (options.category) {
    products = products.filter((p) => p.category === options.category);
  }

  if (options.featured !== undefined) {
    products = products.filter((p) => p.isFeatured === options.featured);
  }

  if (options.isNew !== undefined) {
    products = products.filter((p) => p.isNew === options.isNew);
  }

  if (options.offset) {
    products = products.slice(options.offset);
  }

  if (options.limit) {
    products = products.slice(0, options.limit);
  }

  return products;
}

export async function getNewArrivals(limit: number = 8): Promise<Product[]> {
  return getProducts({ isNew: true, limit });
}

export async function getFeaturedProducts(
  limit: number = 10,
): Promise<Product[]> {
  return getProducts({ featured: true, limit });
}

export async function getProductsByCategory(
  slug: string,
  limit?: number,
): Promise<Product[]> {
  return getProducts({ category: slug, limit });
}
