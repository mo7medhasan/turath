"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface SearchInputProps {
  locale: string;
}

export function SearchInput({ locale }: SearchInputProps) {
  const t = useTranslations("common");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, locale, router],
  );

  const clearSearch = () => setQuery("");

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      className="flex w-full max-w-xl items-center gap-2 rounded-xl border border-(--border) bg-(--surface-2) px-3 py-2 transition-all duration-200 focus-within:border-(--primary) focus-within:ring-2 focus-within:ring-(--primary)/20"
    >
      <Search className="h-4 w-4 shrink-0 text-(--text-muted)" />
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("search")}
        className="flex-1 bg-transparent text-sm text-(--text) placeholder:text-(--text-muted) outline-none"
        dir={locale === "ar" ? "rtl" : "ltr"}
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="مسح البحث"
          className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="h-3 w-3 text-(--text-muted)" />
        </button>
      )}
    </form>
  );
}
