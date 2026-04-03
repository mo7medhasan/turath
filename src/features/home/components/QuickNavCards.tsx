import Link from "next/link";
import { Button } from "@/shared/ui/Button";

interface QuickNavCardsProps {
  locale: string;
  isRtl: boolean;
}

const categoryTags = {
  ar: ["حوامل المصحف", "هدايا إسلامية", "ديكورات رمضان", "فخار مرسوم يدوياً"],
  en: ["Quran Stands", "Islamic Gifts", "Ramadan Decor", "Hand-painted Pottery"],
};

// Single card base using CSS design tokens so dark mode is automatic
function PromoCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex flex-col items-start gap-5 rounded-3xl p-6 sm:p-8
        bg-(--surface) border border-(--border) shadow-(--shadow-card)
        hover:shadow-(--shadow-hover) transition-shadow duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

export function QuickNavCards({ locale, isRtl }: QuickNavCardsProps) {
  const tags = isRtl ? categoryTags.ar : categoryTags.en;

  return (
    <section
      aria-label={isRtl ? "روابط سريعة" : "Quick navigation"}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {/* Card 1 — Offers */}
      <PromoCard>
        <div className="flex-1 space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-(--text)">
            {isRtl ? "عروض اليوم" : "Today's Offers"}
          </h3>
          <p className="text-sm leading-relaxed text-(--text-muted)">
            {isRtl
              ? "خصومات قوية على أفضل المنتجات التراثية من كبار التجار."
              : "Strong discounts on the best heritage products from top merchants."}
          </p>
        </div>
        <Button asChild variant="default" className="rounded-full font-bold px-6">
          <Link href={`/${locale}/offers`}>
            {isRtl ? "تسوق العروض" : "Shop Offers"}
          </Link>
        </Button>
      </PromoCard>

      {/* Card 2 — Categories */}
      <PromoCard>
        <div className="flex-1 w-full space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-(--text)">
            {isRtl ? "تسوق حسب الفئة" : "Shop by Category"}
          </h3>
          <p className="text-sm leading-relaxed text-(--text-muted)">
            {isRtl
              ? "اكتشف الأقسام الأكثر طلباً وابدأ التسوق بسرعة."
              : "Discover the most requested sections and start shopping quickly."}
          </p>
          <div className="flex flex-wrap gap-2 pt-3">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/categories`}
                className="rounded-full border border-(--border) bg-(--surface-2) hover:bg-(--surface-3) text-(--text) px-4 py-1.5 text-xs font-semibold transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </PromoCard>

      {/* Card 3 — Social */}
      <PromoCard>
        <div className="flex-1 space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-(--text)">
            {isRtl ? "تراث فيسبوك" : "Turath on Facebook"}
          </h3>
          <p className="text-sm leading-relaxed text-(--text-muted)">
            {isRtl
              ? "تابع أحدث منشورات التجار وتفاعل مع المنتجات مباشرة."
              : "Follow the latest merchant posts and interact with products directly."}
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-full font-bold px-6">
          <Link href="#">{isRtl ? "تابعنا الآن" : "Follow Us Now"}</Link>
        </Button>
      </PromoCard>
    </section>
  );
}
