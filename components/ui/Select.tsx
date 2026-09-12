import type { ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "./cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  children: ReactNode;
};

export function Select({ label, error, className, id, children, ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={id}>
      {label ? <span className="font-medium">{label}</span> : null}
      <select
        id={id}
        className={cn(
          "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60",
          error ? "border-danger" : undefined,
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}
