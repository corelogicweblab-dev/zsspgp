import { createClient } from "@/lib/supabase/server";
import { findDepartmentPortalByEmail } from "@/lib/department-portals";
import type { UserRole } from "@/types";

export type NewsManagerProfile = {
  userId: string;
  role: UserRole;
  email: string | null;
  fullName: string;
  departmentCode: string | null;
};

const MANAGER_ROLES: UserRole[] = [
  "information_office",
  "governor_super_admin",
  "ict_admin",
];

/** Matches middleware + department portal email (e.g. information@…). */
export function canManageProvincialNews(
  role: UserRole,
  departmentCode?: string | null,
  email?: string | null
): boolean {
  if (MANAGER_ROLES.includes(role)) return true;

  if (role !== "department_admin") return false;

  if (departmentCode?.toUpperCase() === "INFO") return true;

  const portal = findDepartmentPortalByEmail(email);
  return portal?.code === "INFO";
}

function parseDepartmentCode(departments: unknown): string | null {
  if (!departments) return null;
  if (Array.isArray(departments)) {
    const first = departments[0] as { code?: string } | undefined;
    return first?.code?.toUpperCase() ?? null;
  }
  return (departments as { code?: string }).code?.toUpperCase() ?? null;
}

async function resolveDepartmentCode(
  supabase: Awaited<ReturnType<typeof createClient>>,
  row: {
    department_id: string | null;
    departments: unknown;
    email: string | null;
  }
): Promise<string | null> {
  const fromJoin = parseDepartmentCode(row.departments);
  if (fromJoin) return fromJoin;

  if (row.department_id) {
    const { data: dept } = await supabase
      .from("departments")
      .select("code")
      .eq("id", row.department_id)
      .maybeSingle();
    if (dept?.code) return dept.code.toUpperCase();
  }

  const portal = findDepartmentPortalByEmail(row.email);
  return portal?.code ?? null;
}

export async function requireNewsManager(): Promise<
  | { ok: true; profile: NewsManagerProfile; supabase: Awaited<ReturnType<typeof createClient>> }
  | { ok: false; status: number; message: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401, message: "Authentication required." };
  }

  const { data: row, error } = await supabase
    .from("users")
    .select("id, role, email, full_name, department_id, departments:department_id (code)")
    .eq("id", user.id)
    .single();

  if (error || !row) {
    return { ok: false, status: 403, message: "User profile not found." };
  }

  const role = row.role as UserRole;
  const email = row.email ?? user.email ?? null;
  const departmentCode = await resolveDepartmentCode(supabase, {
    department_id: row.department_id,
    departments: row.departments,
    email,
  });

  if (!canManageProvincialNews(role, departmentCode, email)) {
    return {
      ok: false,
      status: 403,
      message: "Information Office admin access required.",
    };
  }

  return {
    ok: true,
    supabase,
    profile: {
      userId: row.id,
      role,
      email,
      fullName: row.full_name,
      departmentCode,
    },
  };
}
