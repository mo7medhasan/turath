"use client";

import { useCartStore, selectTotalItems } from "@/features/cart/store/useCartStore";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/ui/Button";

export function CartCount() {
  const itemCount = useCartStore(selectTotalItems);
  const openDrawer = useCartStore((s) => s.openDrawer);

  return (
    <Button variant="surface" size="icon"
      id="cart-button"
      onClick={openDrawer}
      aria-label={`سلة التسوق - ${itemCount} منتج`}
      className="relative flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200"
    >
      <ShoppingCart className="w-5 h-5 text-white" fill="currentColor" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -inset-e-1 flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-[10px] font-bold text-white animate-bounce-in">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Button>
  );
}
