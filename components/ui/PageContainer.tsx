import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export function PageContainer({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    />
  );
}
