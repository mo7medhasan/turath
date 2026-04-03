/**
 * AnnouncementBar — top scrolling promo strip
 * Server Component (no state, pure markup)
 */
interface AnnouncementBarProps {
  isRtl: boolean;
}

export function AnnouncementBar({ isRtl }: AnnouncementBarProps) {
  return (
    <div className="bg-(--primary-dark) py-2 px-4 overflow-hidden">
      <div className="mask-[linear-gradient(to_right,transparent,black_40px,black_calc(100%-40px),transparent)]">
        <p className="slide-text w-fit whitespace-nowrap text-xs font-medium text-white/80 tracking-wide">
          {isRtl
            ? "🌿 تجربة تسوق احترافية بمنتجات تراثية أصيلة"
            : "🌿 Professional shopping experience with authentic heritage products"}
        </p>
      </div>
    </div>
  );
}
