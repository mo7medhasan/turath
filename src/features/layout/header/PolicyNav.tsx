import Link from "next/link";
import { Button } from "@/shared/ui/Button";

interface PolicyLink {
  href: string;
  label: string;
}

interface PolicyNavProps {
  links: PolicyLink[];
  isRtl: boolean;
}

/**
 * PolicyNav — desktop-only secondary nav bar (Return Policy / Support / Contact)
 * Hidden on mobile, appears below announcement bar on ≥md
 */
export function PolicyNav({ links, isRtl }: PolicyNavProps) {
  return (
    <nav
      aria-label={isRtl ? "روابط الدعم" : "Support links"}
      className="block border-b border-(--primary-dark)/20 bg-(--primary-dark)/30"
    >
      <ul className="mx-auto max-w-7xl px-4 flex items-center justify-center sm:justify-end gap-1 h-9">
        {links.map((link) => (
          <li key={link.href}>
            <Button variant="surface" size="sm" asChild className="rounded-md text-xs text-white/70 hover:text-white hover:bg-(--surface)/10 h-7 px-3">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
