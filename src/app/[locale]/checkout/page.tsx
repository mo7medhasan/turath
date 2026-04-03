"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCartStore, selectSubtotal } from "@/features/cart/store/useCartStore";
import { formatPrice } from "@/shared/lib/formatPrice";
import { ShoppingBag, CreditCard, Banknote, Truck } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useParams();
  const locale = (params["locale"] as string) ?? "ar";
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectSubtotal);
  const isAr = locale === "ar";
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate order placement
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    alert(isAr ? "تم تأكيد طلبك بنجاح! 🎉" : "Order placed successfully! 🎉");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h1 className="text-2xl font-bold text-(--text)">
          {tCart("empty")}
        </h1>
        <p className="mt-2 text-(--text-muted)">{tCart("emptyDescription")}</p>
        <a
          href={`/${locale}`}
          className="mt-6 inline-block rounded-xl bg-(--primary) px-8 py-3 font-bold text-white hover:bg-(--primary-dark) transition-colors"
        >
          {tCart("continueShopping")}
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-black text-(--text)">{t("title")}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ─ Left: Form ─ */}
          <div className="space-y-6 lg:col-span-2">
            {/* Shipping info */}
            <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-(--text)">
                <Truck className="h-5 w-5 text-(--primary)" />
                {t("shippingInfo")}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { id: "name", label: t("name"), type: "text", placeholder: isAr ? "محمد أحمد" : "John Doe" },
                  { id: "phone", label: t("phone"), type: "tel", placeholder: isAr ? "01000000000" : "+1234567890" },
                  { id: "address", label: t("address"), type: "text", placeholder: isAr ? "١٢ شارع التحرير" : "123 Main St", colSpan: true },
                  { id: "city", label: t("city"), type: "text", placeholder: isAr ? "القاهرة" : "Cairo" },
                ].map((field) => (
                  <div key={field.id} className={field.colSpan ? "sm:col-span-2" : ""}>
                    <label
                      htmlFor={`checkout-${field.id}`}
                      className="mb-1.5 block text-sm font-semibold text-(--text-muted)"
                    >
                      {field.label}
                    </label>
                    <input
                      id={`checkout-${field.id}`}
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-(--border) bg-(--surface-2) px-4 py-3 text-sm text-(--text) placeholder:text-gray-400 focus:border-(--primary) focus:outline-none focus:ring-2 focus:ring-(--primary)/20 transition-all"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Payment method */}
            <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-(--text)">
                <CreditCard className="h-5 w-5 text-(--primary)" />
                {t("paymentMethod")}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "cash" as const, label: t("cash"), icon: Banknote },
                  { value: "card" as const, label: t("card"), icon: CreditCard },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    id={`payment-${value}`}
                    type="button"
                    onClick={() => setPaymentMethod(value)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition-all ${paymentMethod === value
                      ? "border-(--primary) bg-red-50 dark:bg-red-950 text-(--primary)"
                      : "border-(--border) bg-(--surface-2) text-(--text) hover:border-(--primary)"
                      }`}
                  >
                    <Icon className="h-6 w-6" />
                    {label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* ─ Right: Order Summary ─ */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-(--border) bg-(--surface) p-5">
              <h2 className="mb-4 text-lg font-bold text-(--text)">
                {t("orderSummary")}
              </h2>

              {/* Items */}
              <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={product.images[0] ?? ""}
                        alt={isAr ? product.nameAr : product.nameEn}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-1 text-xs font-semibold text-(--text)">
                        {isAr ? product.nameAr : product.nameEn}
                      </p>
                      <p className="text-xs text-(--text-muted)">
                        {quantity} ×{" "}
                        {formatPrice(
                          product.discountedPrice > 0
                            ? product.discountedPrice
                            : product.price,
                          locale,
                        )}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-(--text)">
                      {formatPrice(
                        (product.discountedPrice > 0
                          ? product.discountedPrice
                          : product.price) * quantity,
                        locale,
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t border-(--border) pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-(--text-muted)">{tCart("subtotal")}</span>
                  <span className="font-semibold">{formatPrice(subtotal, locale)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-(--text-muted)">
                    {isAr ? "الشحن" : "Shipping"}
                  </span>
                  <span className={`font-semibold ${shipping === 0 ? "text-(--success)" : ""}`}>
                    {shipping === 0
                      ? isAr ? "مجاني" : "Free"
                      : formatPrice(shipping, locale)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-(--border) pt-2 text-base font-black">
                  <span>{tCart("total")}</span>
                  <span className="text-(--primary)">
                    {formatPrice(total, locale)}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                id="place-order-button"
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full rounded-xl bg-(--primary) py-3.5 text-base font-bold text-white transition-all hover:bg-(--primary-dark) disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
              >
                {isSubmitting
                  ? isAr ? "جاري الطلب..." : "Placing order..."
                  : t("placeOrder")}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
