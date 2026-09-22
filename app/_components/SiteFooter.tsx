"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/ui";
import { adminLogout, checkIsAdminClient } from "@/app/_lib/adminApi";

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
      <PageContainer className="flex-none flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} CodeBeaver All rights reserved.
        </p>
        {isAdmin ? (
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="text-muted-foreground hover:text-foreground hover:underline disabled:opacity-60"
          >
            {isPending ? "..." : "ログアウト"}
          </button>
        ) : (
          <Link href="/login" className="text-muted-foreground hover:text-foreground hover:underline">
            ログイン
          </Link>
        )}
      </PageContainer>
    </footer>
  );
}
