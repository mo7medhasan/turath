import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { mockCategories } from "@/shared/lib/mockData";

interface FooterProps {
  locale: string;
}

// Server Component — no "use client"
export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations("footer");
  const isAr = locale === "ar";

  const helpLinks = [
    { href: `/${locale}/help/shipping`, label: isAr ? "الشحن والتوصيل" : "Shipping & Delivery" },
    { href: `/${locale}/help/returns`, label: isAr ? "سياسة الإرجاع" : "Return Policy" },
    { href: `/${locale}/help/track`, label: t("trackOrder") },
    { href: `/${locale}/help`, label: t("helpCenter") },
    { href: `/${locale}/contact`, label: t("contactUs") },
  ];

  const aboutLinks = [
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/privacy`, label: t("privacyPolicy") },
    { href: `/${locale}/terms`, label: t("termsOfService") },
  ];

  return (
    <footer
      className="border-t border-(--border) bg-[#0f172a] dark:bg-[#050a14] text-gray-300"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--primary) text-white font-black text-xl">
                ت
              </div>
              <span className="text-xl font-bold text-white">
                {isAr ? "تراث مارت" : "Turath Mart"}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {t("description")}
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Facebook, label: "Facebook", href: "#" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Twitter, label: "Twitter", href: "#" },
                { icon: Youtube, label: "YouTube", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-400 hover:bg-(--primary) hover:text-white transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              {t("categories")}
            </h3>
            <ul className="space-y-2.5">
              {mockCategories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/${locale}/categories/${cat.slug}`}
                    className="text-sm text-gray-400 hover:text-(--primary) transition-colors"
                  >
                    {isAr ? cat.nameAr : cat.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              {isAr ? "المساعدة" : "Help"}
            </h3>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-(--primary) transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About + Payment */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              {isAr ? "عن الشركة" : "Company"}
            </h3>
            <ul className="space-y-2.5 mb-6">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-(--primary) transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payment methods */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                {t("paymentMethods")}
              </p>
              <div className="flex flex-wrap gap-2">
                {["Visa", "Mastercard", "Meeza", "Fawry"].map((method) => (
                  <span
                    key={method}
                    className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-gray-300"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-sm text-gray-500">{t("copyright")}</p>
          <p className="text-xs text-gray-600">
            {isAr
              ? "المنتجات والسعر عرضة للتغيير"
              : "Products and prices subject to change"}
          </p>
        </div>
      </div>
    </footer>
  );
}
