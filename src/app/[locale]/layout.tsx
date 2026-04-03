import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/features/layout/header/Header";
import { Footer } from "@/features/layout/footer/Footer";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import "@/app/globals.css";
import { notFound } from "next/navigation";

const locales = ["ar", "en"] as const;
type Locale = (typeof locales)[number];

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  display: "swap",
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: {
      default: locale === "ar" ? "تراث مارت - تسوق بذكاء" : "Turath Mart - Shop Smart",
      template: locale === "ar" ? "%s | تراث مارت" : "%s | Turath Mart",
    },
    description:
      locale === "ar"
        ? "وجهتك الأولى للتسوق الإلكتروني في مصر. أفضل المنتجات بأفضل الأسعار مع شحن سريع."
        : "Your top online shopping destination in Egypt. Best products at the best prices with fast delivery.",
    keywords:
      locale === "ar"
        ? ["تسوق اونلاين", "إلكترونيات", "ملابس", "عروض"]
        : ["online shopping", "electronics", "clothing", "deals"],
    metadataBase: new URL("https://turath.com"),
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${cairo.variable} ${tajawal.variable} min-h-screen bg-(--surface-2) text-(--text) antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          {/* App Shell */}
          <div className="flex min-h-screen flex-col">
            <Header locale={locale} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer locale={locale} />
          </div>
          {/* Cart Drawer — rendered outside main content flow */}
          <CartDrawer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
