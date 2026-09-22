function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
}

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  const body = await response.json().catch(() => null);
  return (body && typeof body.error === "string" && body.error) || fallback;
}

// ポートフォリオ共通の管理者ログイン/ログアウト。クライアントコンポーネント
// から呼ぶ想定（ログインフォームやログアウトボタン）。
export async function adminLogin(password: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/api/admin/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "ログインに失敗しました"));
  }
}

export async function adminLogout(): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/api/admin/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "ログアウトに失敗しました"));
  }
}

// ブラウザから管理者判定する版。フッターのようにポータル全体（静的生成される
// ページも含む）に置くコンポーネントは、これをクライアント側で呼んで判定する
// ことで、Server Componentでの判定（cookies()を使う checkIsAdmin）のように
// ページ全体を動的レンダリングに強制しない。
export async function checkIsAdminClient(): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/session`, {
      credentials: "include",
    });
    if (!response.ok) return false;
    const data: { isAdmin: boolean } = await response.json();
    return data.isAdmin;
  } catch (error) {
    console.error("admin: failed to check admin session", error);
    return false;
  }
}
