import type { ReactNode } from "react";
import { cn } from "./cn";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  size?: "medium" | "large";
  children: ReactNode;
};

const sizeClasses = {
  medium: "max-w-md",
  large: "max-w-3xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  footer,
  size = "medium",
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="閉じる"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40"
      />
      <div
        className={cn(
          "relative flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-lg",
          sizeClasses[size],
        )}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">{title}</h2>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {children}

        {footer ? <div className="flex justify-end gap-3 pt-2">{footer}</div> : null}
      </div>
    </div>
  );
}
