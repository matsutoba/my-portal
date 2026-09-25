import type { HTMLAttributes } from "react";
import { cn } from "./cn";

type BadgeVariant = "success" | "neutral" | "warning" | "accent";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success-bg text-success",
  neutral: "bg-neutral-bg text-muted-foreground",
  warning: "bg-warning-bg text-warning",
  accent: "bg-accent-bg text-accent",
};

const dotClasses: Record<BadgeVariant, string> = {
  success: "bg-success",
  neutral: "bg-muted-foreground",
  warning: "bg-warning",
  accent: "bg-accent",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  dot?: boolean;
};

export function Badge({ variant = "neutral", dot = true, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {dot && <span className={cn("size-1.5 rounded-full", dotClasses[variant])} aria-hidden />}
      {children}
    </span>
  );
}
