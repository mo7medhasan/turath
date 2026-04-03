"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/features/cart/store/useCartStore";
import { X, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { formatPrice } from "@/shared/lib/formatPrice";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";

interface CartDrawerProps {
  locale: string;
}

export function CartDrawer({ locale }: CartDrawerProps) {
  const t = useTranslations("cart");
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const items = useCartStore((s) => s.items);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalItems = useCartStore(selectTotalItems);
  const subtotal = useCartStore(selectSubtotal);

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeDrawer();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeDrawer]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isRtl = locale === "ar";

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label={t("title")}
        aria-modal="true"
        className={cn(
          "fixed top-0 z-50 flex h-full w-full max-w-sm flex-col bg-(--surface) ",
          "transition-transform duration-300 ease-in-out",
          "shadow-(--shadow-drawer)",
          isOpen ? "translate-x-0" : isRtl ? "translate-x-[100vw]" : "-translate-x-[100vw]",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-(--primary)"   fill="currentColor"/>
            <h2 className="text-lg font-bold text-(--text)">
              {t("title")}
            </h2>
            {totalItems > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </div>
          <button
            id="close-cart-drawer"
            onClick={closeDrawer}
            aria-label={locale === "ar" ? "إغلاق السلة" : "Close cart"}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <ShoppingCart className="h-10 w-10 text-gray-400"   fill="currentColor"/>
              </div>
              <div>
                <p className="font-semibold text-(--text)">{t("empty")}</p>
                <p className="mt-1 text-sm text-(--text-muted)">
                  {t("emptyDescription")}
                </p>
              </div>
              <button
                onClick={closeDrawer}
                className="rounded-lg bg-(--primary) px-6 py-2.5 text-sm font-semibold text-white hover:bg-(--primary-dark) transition-colors"
              >
                {t("continueShopping")}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-xl border border-(--border) bg-(--surface-2) p-3"
                >
                  {/* Product Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={product.images[0] ?? "/placeholder.jpg"}
                      alt={locale === "ar" ? product.nameAr : product.nameEn}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="line-clamp-2 text-sm font-semibold leading-tight text-(--text)">
                        {locale === "ar" ? product.nameAr : product.nameEn}
                      </p>
                      <p className="mt-1 text-sm font-bold text-(--primary)">
                        {formatPrice(
                          product.discountedPrice > 0
                            ? product.discountedPrice
                            : product.price,
                          locale,
                        )}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-lg border border-(--border) bg-(--surface) ">
                        <button
                          id={`decrease-qty-${product.id}`}
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                          aria-label="تقليل الكمية"
                          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {quantity}
                        </span>
                        <button
                          id={`increase-qty-${product.id}`}
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                          aria-label="زيادة الكمية"
                          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        id={`remove-item-${product.id}`}
                        onClick={() => removeItem(product.id)}
                        aria-label={locale === "ar" ? "إزالة المنتج" : "Remove item"}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5"  fill="currentColor"/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-(--border) bg-(--surface) px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-(--text-muted)">{t("subtotal")}</span>
              <span className="text-lg font-bold text-(--text)">
                {formatPrice(subtotal, locale)}
              </span>
            </div>
            <p className="text-xs text-(--text-muted)">
              {t("shippingNote")}
            </p>
            <Link
              href={`/${locale}/checkout`}
              onClick={closeDrawer}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) py-3 text-base font-bold text-white hover:bg-(--primary-dark) transition-all duration-200 active:scale-95"
            >
              {t("checkout")}
            </Link>
            <button
              onClick={closeDrawer}
              className="w-full rounded-xl border border-(--border) py-2.5 text-sm font-semibold text-(--text) hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {t("continueShopping")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
