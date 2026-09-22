import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export function TechTag({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
