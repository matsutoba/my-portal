import type { TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={id}>
      {label ? <span className="font-medium">{label}</span> : null}
      <textarea
        id={id}
        className={cn(
          "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60",
          error ? "border-danger" : undefined,
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}
