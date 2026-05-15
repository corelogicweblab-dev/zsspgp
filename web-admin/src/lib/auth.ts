import type { UserRole } from "@/types";
import { getRoleDashboardPath } from "@/lib/utils";

export function getAuthRedirectPath(role: UserRole | string): string {
  if (role === "information_office") return "/admin/news";
  return getRoleDashboardPath(role);
}

export function getOAuthRedirectUrl(): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? "https://zsspgp.onrender.com";
  return `${base}/auth/callback`;
}
