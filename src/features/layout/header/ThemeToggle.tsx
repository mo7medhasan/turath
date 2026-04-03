"use client";

import { useLayoutEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/Button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    (async () => {
      setMounted(true);
      const stored = localStorage.getItem("turath-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const dark = stored === "dark" || (!stored && prefersDark);
      setIsDark(dark);
      document.documentElement.classList.toggle("dark", dark);
    })();
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("turath-theme", next ? "dark" : "light");
  };

  if (!mounted) {
    // Render a placeholder to avoid hydration mismatch
    return (
      <div className="h-10 w-10 rounded-full" aria-hidden="true" />
    );
  }

  return (
    <Button variant="surface" size="icon"
      id="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
      className="flex h-10 w-10 items-center justify-center rounded-md  transition-all duration-200"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-white"  fill="currentColor" />
      ) : (
        <Moon className="h-5 w-5 text-white"  fill="currentColor" />
      )}
    </Button>
  );
}
