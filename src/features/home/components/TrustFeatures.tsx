import { type LucideIcon } from "lucide-react";
import { Card } from "@/shared/ui/Card";

interface TrustFeature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface TrustFeaturesProps {
  isRtl: boolean;
  features: TrustFeature[];
}

export function TrustFeatures({ isRtl, features }: TrustFeaturesProps) {
  return (
    <section
      aria-label={isRtl ? "مميزاتنا" : "Our features"}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {features.map(({ icon: Icon, title, desc }) => (
        <Card key={title} hoverable className="flex flex-col items-center gap-3 p-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--surface-2)">
            <Icon className="h-6 w-6 text-(--primary)" />
          </div>
          <div>
            <p className="text-sm font-bold text-(--text)">{title}</p>
            <p className="mt-0.5 text-xs text-(--text-muted)">{desc}</p>
          </div>
        </Card>
      ))}
    </section>
  );
}
