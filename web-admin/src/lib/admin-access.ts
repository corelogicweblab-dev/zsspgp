import type { UserRole } from "@/types";
import { getAuthRedirectPath } from "@/lib/auth";

/** Whether this role may open this admin path (pathname without query). */
export function canAccessAdminPath(role: UserRole, pathname: string): boolean {
  const p = pathname.split("?")[0];

  if (!p.startsWith("/admin")) return true;
  if (role === "citizen") return false;
  if (role === "governor_super_admin") return true;

  if (role === "ict_admin") {
    return !p.startsWith("/admin/governor");
  }

  if (role === "information_office") {
    return (
      p.startsWith("/admin/news") ||
      p.startsWith("/admin/notifications") ||
      p.startsWith("/admin/complaints") ||
      p.startsWith("/admin/incidents")
    );
  }

  if (role === "department_admin" || role === "staff") {
    return (
      p.startsWith("/admin/department") ||
      p.startsWith("/admin/complaints") ||
      p.startsWith("/admin/incidents") ||
      p.startsWith("/admin/notifications")
    );
  }

  return false;
}

/**
 * Safe internal redirect after login. Returns null if redirect must be ignored.
 */
export function resolveSafeRedirectPath(redirect: string | null, role: UserRole): string | null {
  if (!redirect?.startsWith("/")) return null;
  if (redirect.startsWith("//") || redirect.includes("://")) return null;

  const pathOnly = redirect.split("?")[0];
  if (pathOnly.startsWith("/admin") && !canAccessAdminPath(role, pathOnly)) {
    return null;
  }

  return redirect;
}

export function getUnauthorizedAdminFallback(role: UserRole): string {
  return getAuthRedirectPath(role);
}
