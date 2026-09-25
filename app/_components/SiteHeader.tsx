"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PageContainer } from "@/components/ui";
import { cn } from "@/components/ui/cn";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/works" },
  { label: "Skills", href: "/skills" },
  { label: "Profile", href: "/profile" },
  { label: "Contact", href: "/contact" },
];

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
      <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="size-5" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <PageContainer className="flex-none flex-row items-center justify-between gap-6 bg-card py-0">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <Image
            src="/images/codebeaver-icon.png"
            alt="Code Beaver"
            width={64}
            height={64}
            className="rounded-lg"
          />
          <span className="text-base font-bold tracking-wide uppercase">
            Code Beaver <span className="font-normal text-muted-foreground">{"// PORTAL"}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const className = cn(
              "flex items-center gap-1.5 text-sm transition-colors",
              active ? "font-semibold text-accent" : "text-muted-foreground hover:text-foreground",
            );

            return (
              <Link key={item.label} href={item.href} className={className}>
                {active ? <span className="size-1.5 rounded-full bg-accent" aria-hidden /> : null}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isMenuOpen}
          className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-neutral-bg md:hidden"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </PageContainer>

      {isMenuOpen ? (
        <div className="border-t border-border bg-card md:hidden">
          <PageContainer className="flex-none flex-col gap-1 bg-card py-4">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const className = cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active ? "font-semibold text-accent" : "text-muted-foreground hover:bg-neutral-bg hover:text-foreground",
              );

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={className}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {active ? <span className="size-1.5 rounded-full bg-accent" aria-hidden /> : null}
                  {item.label}
                </Link>
              );
            })}
          </PageContainer>
        </div>
      ) : null}
    </header>
  );
}
