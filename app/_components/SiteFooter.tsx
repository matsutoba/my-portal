import { PageContainer } from "@/components/ui";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <PageContainer className="flex-none flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} CodeBeaver All rights reserved.
        </p>
      </PageContainer>
    </footer>
  );
}
