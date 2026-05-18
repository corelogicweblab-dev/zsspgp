import type { UserRole } from "@/types";
import {
  findDepartmentPortalByCode,
  findDepartmentPortalBySlug,
  getDepartmentSlugFromCode,
} from "@/lib/department-portals";
import { resolvePostLoginPath, type AuthProfile } from "@/lib/auth-redirect";

/** Whether this role may open this admin path (pathname without query). */
export function canAccessAdminPath(
  role: UserRole,
  pathname: string,
  departmentCode?: string | null
): boolean {
  const p = pathname.split("?")[0];

  if (!p.startsWith("/admin")) return true;
  if (role === "citizen") return false;
  if (role === "governor_super_admin") return true;

  if (role === "ict_admin") {
    return !p.startsWith("/admin/governor");
  }

  if (role === "information_office") {
    const deptSlug = getDepartmentSlugFromCode(departmentCode);
    if (p.match(/^\/admin\/department\/([^/]+)/)) {
      const requested = p.split("/")[3];
      return requested === "information" || requested === deptSlug;
    }
    return (
      p.startsWith("/admin/news") ||
      p.startsWith("/admin/notifications") ||
      p.startsWith("/admin/complaints") ||
      p.startsWith("/admin/incidents") ||
      p.startsWith("/admin/department")
    );
  }

  if (role === "department_admin" || role === "staff") {
    const allowedPrefixes = [
      "/admin/complaints",
      "/admin/incidents",
      "/admin/notifications",
    ];

    const deptMatch = p.match(/^\/admin\/department(?:\/([^/]+))?/);
    if (deptMatch) {
      const requestedSlug = deptMatch[1];
      const userSlug = getDepartmentSlugFromCode(departmentCode);
      if (!requestedSlug) return true;
      if (!userSlug) return true;
      return requestedSlug === userSlug;
    }

    return allowedPrefixes.some((prefix) => p.startsWith(prefix));
  }

  return false;
}

/**
 * Safe internal redirect after login. Returns null if redirect must be ignored.
 */
export function resolveSafeRedirectPath(
  redirect: string | null,
  profile: AuthProfile
): string | null {
  if (!redirect?.startsWith("/")) return null;
  if (redirect.startsWith("//") || redirect.includes("://")) return null;

  const pathOnly = redirect.split("?")[0];
  if (pathOnly.startsWith("/admin") && !canAccessAdminPath(profile.role, pathOnly, profile.departmentCode)) {
    return null;
  }

  return redirect;
}

export function getUnauthorizedAdminFallback(profile: AuthProfile): string {
  return resolvePostLoginPath(profile);
}
