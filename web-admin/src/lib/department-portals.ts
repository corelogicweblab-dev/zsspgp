import type { UserRole } from "@/types";
import { DEPARTMENTS } from "@/lib/constants";

export type DepartmentPortal = (typeof DEPARTMENT_PORTALS)[number];

/** Official department portal accounts — one email per office, same /login page. */
export const DEPARTMENT_PORTALS = [
  {
    code: "DRRM",
    slug: "drrm",
    name: "Disaster Risk Reduction & Management",
    email: "drrm@zamboangasibugay.gov.ph",
    imagePath: "/zamboangasibugaylogo.png",
    roles: ["department_admin", "staff"] as UserRole[],
  },
  {
    code: "TOURISM",
    slug: "tourism",
    name: "Tourism Office",
    email: "tourism@zamboangasibugay.gov.ph",
    imagePath: "/zamboangasibugaylogo.png",
    roles: ["department_admin", "staff"] as UserRole[],
  },
  {
    code: "HEALTH",
    slug: "health",
    name: "Provincial Health Office",
    email: "health@zamboangasibugay.gov.ph",
    imagePath: "/zamboangasibugaylogo.png",
    roles: ["department_admin", "staff"] as UserRole[],
  },
  {
    code: "AGRI",
    slug: "agriculture",
    name: "Agriculture Office",
    email: "agriculture@zamboangasibugay.gov.ph",
    imagePath: "/zamboangasibugaylogo.png",
    roles: ["department_admin", "staff"] as UserRole[],
  },
  {
    code: "ICT",
    slug: "ict",
    name: "Information & Communications Technology",
    email: "ict@zamboangasibugay.gov.ph",
    imagePath: "/zamboangasibugaylogo.png",
    roles: ["department_admin", "staff", "ict_admin"] as UserRole[],
  },
  {
    code: "INFO",
    slug: "information",
    name: "Provincial Information Office",
    email: "information@zamboangasibugay.gov.ph",
    imagePath: "/zamboangasibugaylogo.png",
    roles: ["information_office", "department_admin", "staff"] as UserRole[],
  },
] as const;

export function findDepartmentPortalByEmail(email: string | null | undefined) {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  return DEPARTMENT_PORTALS.find((p) => p.email === normalized) ?? null;
}

export function findDepartmentPortalBySlug(slug: string | null | undefined) {
  if (!slug) return null;
  return DEPARTMENT_PORTALS.find((p) => p.slug === slug.toLowerCase()) ?? null;
}

export function findDepartmentPortalByCode(code: string | null | undefined) {
  if (!code) return null;
  return DEPARTMENT_PORTALS.find((p) => p.code === code.toUpperCase()) ?? null;
}

export function getDepartmentSlugFromCode(code: string | null | undefined): string | null {
  const portal = findDepartmentPortalByCode(code);
  if (portal) return portal.slug;
  const fromConstants = DEPARTMENTS.find((d) => d.code === code?.toUpperCase());
  return fromConstants?.slug ?? null;
}

export function getDepartmentDashboardPath(
  role: UserRole,
  opts?: { email?: string | null; departmentCode?: string | null }
): string | null {
  const portal =
    findDepartmentPortalByEmail(opts?.email) ??
    findDepartmentPortalByCode(opts?.departmentCode);

  if (!portal) return null;

  if (role === "information_office" && portal.code === "INFO") {
    return "/admin/news";
  }

  if (portal.roles.includes(role) || role === "ict_admin") {
    return `/admin/department/${portal.slug}`;
  }

  return null;
}

/** Env var name for department portal password (set in Render / .env.local). */
export function getDepartmentPasswordEnvKey(code: string): string {
  return `DEPT_${code}_PASSWORD`;
}
