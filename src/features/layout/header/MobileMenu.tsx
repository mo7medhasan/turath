"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { Category } from "@/features/products/types";
import { Button } from "@/shared/ui/Button";

interface MobileMenuProps {
  locale: string;
  categories: Category[];
}

export function MobileMenu({ locale, categories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isAr = locale === "ar";

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { href: `/${locale}/categories`, label: isAr ? "الأقسام" : "Categories" },
   
  ];

  return (
    <>
      <Button variant="surface" size="icon" 
        id="mobile-menu-toggle"
        onClick={() => setIsOpen(true)}
        aria-label={isAr ? "فتح القائمة" : "Open menu"}
        className="flex lg:hidden h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Menu className="h-5 w-5 text-(--surface)" />
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-label={isAr ? "القائمة الرئيسية" : "Main menu"}
        aria-modal="true"
        className={`fixed top-0 inset-s-0 z-50 flex h-full w-72 flex-col bg-(--surface) shadow-xl transition-transform duration-300 lg:hidden
          ${isOpen ? "translate-x-0" : !isAr ? " ltr:-translate-x-[100vw]" : "translate-x-[100vw]"} `}
        style={isOpen ? { transform: "translateX(0)" } : undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-4">
          <span className="text-lg font-bold text-(--text)">
            {isAr ? "تراث مارت" : "Turath Mart"}
          </span>
          <button
            id="mobile-menu-close"
            onClick={() => setIsOpen(false)}
            aria-label={isAr ? "إغلاق القائمة" : "Close menu"}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-semibold text-(--text) hover:bg-(--surface-2) hover:text-(--primary) transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              {isAr ? "الأقسام" : "Categories"}
            </p>
            <ul className="space-y-1">
              {categories.slice(0, 8).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/${locale}/categories/${cat.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-(--text) hover:bg-(--surface-2) hover:text-(--primary) transition-colors"
                  >
                    <span>{isAr ? cat.nameAr : cat.nameEn}</span>
                    <span className="text-xs text-(--text-muted)">
                      {cat.productCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}
