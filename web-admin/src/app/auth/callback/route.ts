import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolvePostLoginPath } from "@/lib/auth-redirect";
import { getRedirectOriginFromRequest } from "@/lib/site-url";
import type { UserRole } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const roleParam = searchParams.get("role") as UserRole | null;
  const isSignup = searchParams.get("signup") === "true";

  const origin = getRedirectOriginFromRequest(request);

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const meta = data.user.user_metadata;
      const role = (meta?.role as UserRole) ?? roleParam ?? "citizen";

      if (isSignup || roleParam) {
        await supabase.from("users").upsert({
          id: data.user.id,
          email: data.user.email!,
          full_name: meta?.full_name ?? data.user.email?.split("@")[0] ?? "User",
          role,
          phone: meta?.phone ?? null,
          municipality: meta?.municipality ?? null,
          barangay: meta?.barangay ?? null,
          purok_or_street: meta?.purok_or_street ?? null,
        });
      }

      const { data: profile } = await supabase
        .from("users")
        .select("role, email, department_id, departments:department_id (code)")
        .eq("id", data.user.id)
        .maybeSingle();

      const deptRow = profile?.departments as { code?: string } | { code?: string }[] | null;
      const departmentCode = Array.isArray(deptRow) ? deptRow[0]?.code : deptRow?.code;

      const path = resolvePostLoginPath({
        role: (profile?.role as UserRole) ?? role,
        email: profile?.email ?? data.user.email,
        departmentCode: departmentCode ?? null,
      });

      return NextResponse.redirect(`${origin}${path}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
