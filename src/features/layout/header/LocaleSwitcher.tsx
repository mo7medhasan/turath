"use client";

import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/shared/ui/Button";

interface LocaleSwitcherProps {
  locale: string;
}

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    // Replace the locale segment in the pathname
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <Button variant="surface" size="icon"
      id="locale-switcher"
      onClick={toggleLocale}
      aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className="flex items-center gap-1.5 rounded-md  px-2 w-fit"
    >
      <Globe className="h-4 w-4 hidden sm:block" />
      <span>{locale === "ar" ? "EN" : "AR"}</span>
    </Button>
  );
}
