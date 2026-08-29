import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "./cn";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background hover:opacity-90 disabled:bg-neutral-bg disabled:text-muted-foreground disabled:opacity-100",
  secondary:
    "border border-border text-foreground disabled:text-muted-foreground",
};

const baseClasses =
  "w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors disabled:cursor-not-allowed";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

type LinkButtonProps = {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

export function LinkButton({
  href,
  variant = "primary",
  className,
  children,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </Link>
  );
}
