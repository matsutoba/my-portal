import type { ReactNode } from "react";
import { cn } from "./cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  aside?: ReactNode;
  className?: string;
  size?: "default" | "sm";
};

const titleSizeClasses: Record<NonNullable<PageHeaderProps["size"]>, string> = {
  default: "text-2xl sm:text-3xl",
  sm: "text-xl sm:text-2xl",
};

export function PageHeader({
  title,
  description,
  aside,
  className,
  size = "default",
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col justify-between gap-6 sm:flex-row sm:items-start",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <h2 className={cn("font-extrabold tracking-tight", titleSizeClasses[size])}>
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {aside}
    </header>
  );
}
