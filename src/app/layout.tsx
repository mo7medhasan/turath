import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تراث مارت",
  description: "وجهتك الأولى للتسوق الإلكتروني",
};

// Minimal root layout — the [locale]/layout.tsx handles the full <html> shell.
// This exists to satisfy Next.js's requirement for a root layout.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
