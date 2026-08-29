import { PageContainer } from "@/components/ui";

const stack = ["Next.js", "TypeScript", "Tailwind CSS"];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <PageContainer className="flex-none flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} Personal Developer Portal. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="text-xs font-bold tracking-widest text-foreground uppercase">STACK //</span>
          {stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </PageContainer>
    </footer>
  );
}
