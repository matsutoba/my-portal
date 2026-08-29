import type { HTMLAttributes } from "react";
import { cn } from "./cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  highlighted?: boolean;
};

export function Card({ className, highlighted, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 rounded-xl border bg-card p-6 shadow-sm",
        highlighted ? "border-2 border-accent shadow-md" : "border-border",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-bold", className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}
