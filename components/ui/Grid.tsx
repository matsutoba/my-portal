import type { HTMLAttributes } from "react";
import { cn } from "./cn";

type GridColumns = 2 | 3 | 4;

type GridProps = HTMLAttributes<HTMLDivElement> & {
  columns?: GridColumns;
};

const columnClasses: Record<GridColumns, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function Grid({ columns = 3, className, ...props }: GridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6",
        columnClasses[columns],
        className,
      )}
      {...props}
    />
  );
}
