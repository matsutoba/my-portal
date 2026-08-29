import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/ui";
import { cn } from "@/components/ui/cn";

const navItems = [
  { label: "Dashboard", active: true },
  { label: "Projects", active: false },
  { label: "Technology Stack", active: false },
  { label: "Profile", active: false },
];

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.114 20.452H3.558V9h3.556v11.452Z" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-white shadow-sm">
      <PageContainer className="flex-none flex-row items-center justify-between gap-6 bg-white py-0">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/codebeaver-icon.png"
            alt="Code Beaver"
            width={64}
            height={64}
            className="rounded-lg"
          />
          <span className="text-sm font-bold tracking-wide uppercase">
            Code Beaver <span className="font-normal text-muted-foreground">{"// PORTAL"}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <span
              key={item.label}
              className={cn(
                "flex items-center gap-1.5 text-sm",
                item.active ? "font-semibold text-accent" : "text-muted-foreground",
              )}
            >
              {item.active ? <span className="size-1.5 rounded-full bg-accent" aria-hidden /> : null}
              {item.label}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/matsutoba/my-portal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground"
          >
            <GitHubIcon />
          </a>
          <span className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground">
            <LinkedInIcon />
          </span>
        </div>
      </PageContainer>
    </header>
  );
}
