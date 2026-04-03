import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  id: string;
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
  isRtl: boolean;
}

export function SectionHeader({ id, title, viewAllHref, viewAllLabel, isRtl }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 id={id} className="text-xl font-bold text-(--text)">
        {title}
      </h2>
      <Link
        href={viewAllHref}
        className="flex items-center gap-1 text-sm font-semibold text-(--primary) hover:underline transition-colors"
      >
        {viewAllLabel}
        {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Link>
    </div>
  );
}
