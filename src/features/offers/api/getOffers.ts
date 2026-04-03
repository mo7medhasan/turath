import type { Banner } from "@/features/products/types";
import { mockBanners } from "@/shared/lib/mockData";

export async function getOffers(): Promise<Banner[]> {
  await new Promise((resolve) => setTimeout(resolve, 0));
  return mockBanners;
}
