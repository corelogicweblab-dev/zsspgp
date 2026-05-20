import type { UserRole } from "@/types";
import {
  findDepartmentPortalByCode,
  findDepartmentPortalBySlug,
  getDepartmentSlugFromCode,
  type DepartmentPortal,
} from "@/lib/department-portals";
import { getDepartmentAllowedAdminPaths } from "@/lib/department-dashboard-config";
import {
  isProvincialStaffRole,
  PUBLIC_POST_LOGIN_PATHS,
  resolvePostLoginPath,
  type AuthProfile,
} from "@/lib/auth-redirect";

function pathAllowed(pathname: string, allowedPrefixes: string[]): boolean {
  const p = pathname.split("?")[0];
  return allowedPrefixes.some((prefix) => p === prefix || p.startsWith(`${prefix}/`) || p.startsWith(prefix));
}

function getStaffDepartmentSlug(departmentCode?: string | null): DepartmentPortal["slug"] | null {
  const slug = getDepartmentSlugFromCode(departmentCode);
  if (slug && findDepartmentPortalBySlug(slug)) return slug as DepartmentPortal["slug"];
  return null;
}

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
    if (p.startsWith("/admin/governor")) return false;
    const deptMatch = p.match(/^\/admin\/department(?:\/([^/]+))?/);
    if (deptMatch) {
      const requested = deptMatch[1];
      if (!requested) return false;
      return requested === "ict";
    }
    return pathAllowed(p, getDepartmentAllowedAdminPaths("ict"));
  }

  if (role === "information_office") {
    const deptSlug = getDepartmentSlugFromCode(departmentCode);
    const deptMatch = p.match(/^\/admin\/department(?:\/([^/]+))?/);
    if (deptMatch) {
      const requested = deptMatch[1];
      return requested === "information" || requested === deptSlug;
    }
    return pathAllowed(p, getDepartmentAllowedAdminPaths("information"));
  }

  if (role === "department_admin" || role === "staff") {
    const userSlug = getStaffDepartmentSlug(departmentCode);
    const deptMatch = p.match(/^\/admin\/department(?:\/([^/]+))?/);

    if (deptMatch) {
      const requestedSlug = deptMatch[1];
      if (!requestedSlug) return false;
      if (!userSlug) return false;
      return requestedSlug === userSlug;
    }

    if (!userSlug) {
      return ["/admin/complaints", "/admin/incidents", "/admin/notifications"].some((prefix) =>
        p.startsWith(prefix)
      );
    }

    return pathAllowed(p, getDepartmentAllowedAdminPaths(userSlug));
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

  if (isProvincialStaffRole(profile.role)) {
    if (PUBLIC_POST_LOGIN_PATHS.has(pathOnly)) return null;
    if (!pathOnly.startsWith("/admin") && !pathOnly.startsWith("/governor")) {
      return null;
    }
  }

  if (pathOnly.startsWith("/admin") && !canAccessAdminPath(profile.role, pathOnly, profile.departmentCode)) {
    return null;
  }

  return redirect;
}

export function getUnauthorizedAdminFallback(profile: AuthProfile): string {
  return resolvePostLoginPath(profile);
}
