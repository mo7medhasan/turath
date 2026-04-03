import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Package, Headphones, User } from "lucide-react";

import { SearchInput } from "@/features/search/components/SearchInput";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { CartCount } from "@/features/cart/components/CartCount";
import { MobileMenu } from "./MobileMenu";
import { mockCategories } from "@/shared/lib/mockData";
import { Button } from "@/shared/ui/Button";
import { CarouselItems } from "@/shared/ui/CarouselItems";

import { AnnouncementBar } from "./AnnouncementBar";
import { PolicyNav } from "./PolicyNav";
import { CategoryNav } from "./CategoryNav";

interface HeaderProps {
  locale: string;
}

// Server Component shell — no "use client"
export async function Header({ locale }: HeaderProps) {
  const t = await getTranslations("nav");
  const isRtl = locale === "ar";

  const policyLinks = [
    { href: `/${locale}/return-policy`, label: isRtl ? "سياسة الاسترجاع" : "Return Policy" },
    { href: `/${locale}/support`,       label: isRtl ? "الدعم الفني"       : "Support"        },
    { href: `/${locale}/contact-us`,    label: isRtl ? "اتصل بنا"         : "Contact Us"     },
  ];

  const utilityIconLinks = [
    { href: `/${locale}/return-policy`, label: isRtl ? "سياسة الاسترجاع" : "Return Policy", icon: Package   },
    { href: `/${locale}/support`,       label: isRtl ? "الدعم الفني"       : "Support",        icon: Headphones },
    { href: `/${locale}/contact-us`,    label: isRtl ? "اتصل بنا"         : "Contact Us",     icon: User       },
  ];

  return (
    <header
      className="sticky top-0 z-30 w-full bg-(--primary) shadow-md text-white"
      role="banner"
    >
      {/* 1. Scrolling announcement strip */}
      <AnnouncementBar isRtl={isRtl} />

      {/* 2. Policy links bar — desktop only */}
      <PolicyNav links={policyLinks} isRtl={isRtl} />

      {/* 3. Main header row */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row items-center gap-3 py-3">

          {/* Logo + mobile menu toggle */}
          <div className="flex items-center justify-between w-full md:w-auto md:flex-1">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2.5 shrink-0"
              aria-label={isRtl ? "تراث مارت – الصفحة الرئيسية" : "Turath Mart – Home"}
            >
              {/* Logo mark */}
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 border border-whbg-white/20 text-white font-black text-lg select-none">
                ت
              </span>
              {/* Wordmark */}
              <span className="text-base font-bold text-white tracking-wide">
                {isRtl ? "تراث" : "Turath"}
              </span>
            </Link>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <MobileMenu locale={locale} categories={mockCategories} />
            </div>
          </div>

          {/* Search bar */}
          <div className="w-full md:flex-2 max-w-2xl">
            <SearchInput locale={locale} />
          </div>

          {/* Right utilities */}
          <div className="flex w-full md:w-auto md:flex-1 md:justify-end">
            <div className="flex items-center rounded-2xl bg-white/10 border border-white/15 p-1  px-2 overflow-hidden w-full md:w-auto">
              <CarouselItems locale={locale} containerClassName="justify-center md:justify-end items-center">
                {/* Theme + Locale */}
                <ThemeToggle />
                <LocaleSwitcher locale={locale} />

                {/* Divider */}
                <span className="h-5 w-px bg-white/20 shrink-0" />

                {/* Icon links */}
                {utilityIconLinks.map(({ href, label, icon: Icon }) => (
                  <Button key={href} variant="surface" size="icon" asChild className="h-9 w-9 rounded-md ">
                    <Link href={href} aria-label={label}>
                      <Icon className="h-4.5 w-4.5" />
                    </Link>
                  </Button>
                ))}

                {/* Cart */}
                <CartCount />
              </CarouselItems>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Category nav strip */}
      <CategoryNav
        locale={locale}
        isRtl={isRtl}
        categoriesLabel={t("categories")}
        categories={mockCategories}
      />
    </header>
  );
}
