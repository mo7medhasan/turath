import { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Apply the hoverable elevated shadow on hover */
  hoverable?: boolean;
  /** Remove background / border  */
  flat?: boolean;
}

export function Card({ children, className, hoverable = false, flat = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        !flat && "bg-(--surface) border border-(--border) shadow-(--shadow-card)",
        hoverable && "transition-shadow duration-200 hover:shadow-(--shadow-hover)",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
