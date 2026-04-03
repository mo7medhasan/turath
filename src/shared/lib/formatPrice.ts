/**
 * Formats a price in EGP with Arabic-friendly number formatting.
 * @param price - The price in smallest currency unit (EGP)
 * @param locale - The locale for formatting ('ar' | 'en')
 */
export function formatPrice(
  price: number,
  locale: string = "ar",
): string {
  const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(price);
}

/**
 * Calculates the savings amount between original and discounted price.
 */
export function calculateSavings(original: number, discounted: number): number {
  return Math.max(original - discounted, 0);
}

/**
 * Returns the effective display price (discounted if applicable, otherwise original).
 */
export function getDisplayPrice(
  price: number,
  discountedPrice: number,
): number {
  return discountedPrice > 0 && discountedPrice < price
    ? discountedPrice
    : price;
}
