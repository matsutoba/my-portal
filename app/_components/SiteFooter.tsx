"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/ui";
import { adminLogout, checkIsAdminClient } from "@/app/_lib/adminApi";
import { contactInfo } from "@/app/_lib/profile";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231ZM17.083 19.77h1.833L7.084 4.126H5.117Z" />
    </svg>
  );
}

export function SiteFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    // ログインページはソフトナビゲーション（router.push）で遷移してくるため
    // マウントされ直さない。pathname依存にして遷移のたびに再判定する。
    checkIsAdminClient().then(setIsAdmin);
  }, [pathname]);

  async function handleLogout() {
    setIsPending(true);
    try {
      await adminLogout();
      setIsAdmin(false);
    } finally {
      setIsPending(false);
      // 各featureのServer Componentが管理者状態を再判定できるよう、
      // 現在のルートのキャッシュを破棄する。
      router.refresh();
    }
  }

  return (
    <footer className="border-t border-border">
      <PageContainer className="flex-none flex-col gap-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} CodeBeaver All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <a
            href={contactInfo.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-neutral-bg"
          >
            <XIcon />
          </a>
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-neutral-bg"
          >
            <GitHubIcon />
          </a>
        </div>
        {isAdmin ? (
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="text-muted-foreground transition-colors hover:text-foreground hover:underline disabled:opacity-60"
          >
            {isPending ? "..." : "ログアウト"}
          </button>
        ) : (
          <Link href="/login" className="text-muted-foreground transition-colors hover:text-foreground hover:underline">
            ログイン
          </Link>
        )}
      </PageContainer>
    </footer>
  );
}
