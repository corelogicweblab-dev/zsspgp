import { createClient } from "@/lib/supabase/server";
import { canManageProvincialNews } from "@/lib/news-auth";
import { findDepartmentPortalByEmail } from "@/lib/department-portals";
import type { UserRole } from "@/types";

function parseDepartmentCode(departments: unknown): string | null {
  if (!departments) return null;
  if (Array.isArray(departments)) {
    const first = departments[0] as { code?: string } | undefined;
    return first?.code?.toUpperCase() ?? null;
  }
  return (departments as { code?: string }).code?.toUpperCase() ?? null;
}

export async function requirePioManager() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401, message: "Sign in required." };

  const { data: row, error } = await supabase
    .from("users")
    .select("id, role, email, department_id, departments:department_id (code)")
    .eq("id", user.id)
    .single();

  if (error || !row) return { ok: false as const, status: 403, message: "Profile not found." };

  const email = row.email ?? user.email ?? null;
  let departmentCode = parseDepartmentCode(row.departments);

  if (!departmentCode && row.department_id) {
    const { data: dept } = await supabase
      .from("departments")
      .select("code")
      .eq("id", row.department_id)
      .maybeSingle();
    departmentCode = dept?.code?.toUpperCase() ?? null;
  }

  if (!departmentCode) {
    departmentCode = findDepartmentPortalByEmail(email)?.code ?? null;
  }

  const role = row.role as UserRole;
  if (!canManageProvincialNews(role, departmentCode, email)) {
    return { ok: false as const, status: 403, message: "Information Office admin access required." };
  }

  return { ok: true as const, supabase, userId: user.id };
}
