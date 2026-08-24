import { cn } from "./cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-2", className)}>
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
      {description ? (
        <p className="text-sm text-foreground/70">{description}</p>
      ) : null}
    </header>
  );
}
