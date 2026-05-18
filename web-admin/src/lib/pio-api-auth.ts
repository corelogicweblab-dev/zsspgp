import { createClient } from "@/lib/supabase/server";
import { canManageInfoAnnouncements } from "@/lib/announcement-banner";
import { findDepartmentPortalByEmail } from "@/lib/department-portals";

export async function requirePioManager() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401, message: "Sign in required." };

  const { data: row } = await supabase
    .from("users")
    .select("id, role, email, department_id, departments:department_id (code)")
    .eq("id", user.id)
    .single();

  if (!row) return { ok: false as const, status: 403, message: "Profile not found." };

  const deptRaw = row.departments as { code?: string } | { code?: string }[] | null;
  const departmentCode = Array.isArray(deptRaw) ? deptRaw[0]?.code : deptRaw?.code;

  if (
    !canManageInfoAnnouncements(row.role as string, departmentCode ?? null) &&
    !canManageInfoAnnouncements(
      row.role as string,
      findDepartmentPortalByEmail(row.email)?.code ?? null
    )
  ) {
    return { ok: false as const, status: 403, message: "Information Office access required." };
  }

  return { ok: true as const, supabase, userId: user.id };
}
