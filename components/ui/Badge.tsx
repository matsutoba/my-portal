import type { HTMLAttributes } from "react";
import { cn } from "./cn";

type BadgeVariant = "success" | "neutral";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success-bg text-success",
  neutral: "bg-neutral-bg text-muted-foreground",
};

const dotClasses: Record<BadgeVariant, string> = {
  success: "bg-success",
  neutral: "bg-muted-foreground",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ variant = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      <span className={cn("size-1.5 rounded-full", dotClasses[variant])} aria-hidden />
      {children}
    </span>
  );
}
