"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/features/products/types";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (product: Product, variant?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product: Product, variant?: string) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedVariant === variant,
          );

          if (existingIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + 1,
            };
            return { items: updatedItems, isDrawerOpen: true };
          }

          return {
            items: [
              ...state.items,
              { product, quantity: 1, selectedVariant: variant },
            ],
            isDrawerOpen: true,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, qty: number) => {
        if (qty <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity: qty } : item,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    {
      name: "turath-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

// Computed selectors (used externally to access derived state)
export const selectTotalItems = (state: CartStore) =>
  state.items.reduce((acc, item) => acc + item.quantity, 0);

export const selectSubtotal = (state: CartStore) =>
  state.items.reduce(
    (acc, item) =>
      acc +
      (item.product.discountedPrice > 0
        ? item.product.discountedPrice
        : item.product.price) *
        item.quantity,
    0,
  );
