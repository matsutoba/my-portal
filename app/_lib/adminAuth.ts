import { cookies } from "next/headers";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
}

// Server Componentから呼ぶ、ポートフォリオ共通の管理者判定。ブラウザから
// 来たCookieをGo APIへ中継し、管理者セッションの有効性を確認する。
// next/headersのcookies()はServer Component/Route Handler専用のため、
// このファイルもクライアントコンポーネント（"use client"）からは呼び出せない。
// 各featureはこれを呼ぶだけで、自分が管理者向けUIを出すかどうかを判断できる。
export async function checkIsAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader) return false;

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/session`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });
    if (!response.ok) return false;
    const data: { isAdmin: boolean } = await response.json();
    return data.isAdmin;
  } catch (error) {
    console.error("admin: failed to check admin session", error);
    return false;
  }
}
