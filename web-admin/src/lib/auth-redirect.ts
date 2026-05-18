import type { UserRole } from "@/types";
import { getDepartmentDashboardPath, getDepartmentSlugFromCode } from "@/lib/department-portals";
import { getAuthRedirectPath } from "@/lib/auth";

export type AuthProfile = {
  role: UserRole;
  email?: string | null;
  departmentCode?: string | null;
};

/** Provincial staff and executives — not public citizens. */
export function isProvincialStaffRole(role: UserRole): boolean {
  return role !== "citizen";
}

export const PUBLIC_POST_LOGIN_PATHS = new Set(["/", "/login", "/register", "/dashboard"]);

export function resolvePostLoginPath(
  profile: AuthProfile,
  redirectParam?: string | null
): string {
  const deptPath = getDepartmentDashboardPath(profile.role, {
    email: profile.email,
    departmentCode: profile.departmentCode,
  });

  if (deptPath) return deptPath;

  if (profile.role === "department_admin" || profile.role === "staff") {
    const slug = getDepartmentSlugFromCode(profile.departmentCode);
    if (slug) return `/admin/department/${slug}`;
    return "/admin/department";
  }

  return getAuthRedirectPath(profile.role);
}
