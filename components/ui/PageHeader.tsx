import type { ReactNode } from "react";
import { cn } from "./cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  aside?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  aside,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col justify-between gap-6 sm:flex-row sm:items-start",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {aside}
    </header>
  );
}
