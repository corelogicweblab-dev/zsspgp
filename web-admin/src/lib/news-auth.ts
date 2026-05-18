import { createClient } from "@/lib/supabase/server";
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

export function canManageProvincialNews(
  role: UserRole,
  departmentCode?: string | null
): boolean {
  if (MANAGER_ROLES.includes(role)) return true;
  return role === "department_admin" && departmentCode === "INFO";
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
    .select("id, role, email, full_name, department_id, departments(code)")
    .eq("id", user.id)
    .single();

  if (error || !row) {
    return { ok: false, status: 403, message: "User profile not found." };
  }

  const departmentCode =
    (row.departments as { code?: string } | null)?.code ?? null;
  const role = row.role as UserRole;

  if (!canManageProvincialNews(role, departmentCode)) {
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
      email: row.email,
      fullName: row.full_name,
      departmentCode,
    },
  };
}
