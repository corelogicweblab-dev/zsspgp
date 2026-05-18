import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";
import {
  isProvincialStaffRole,
  resolvePostLoginPath,
  type AuthProfile,
} from "@/lib/auth-redirect";
import {
  canAccessAdminPath,
  getUnauthorizedAdminFallback,
  resolveSafeRedirectPath,
} from "@/lib/admin-access";
import { getDepartmentDashboardPath } from "@/lib/department-portals";
import type { UserRole } from "@/types";

type SessionProfile = AuthProfile & { role: UserRole };

async function loadSessionProfile(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  email?: string | null
): Promise<SessionProfile> {
  const { data: profile } = await supabase
    .from("users")
    .select("role, email, department_id, departments:department_id (code)")
    .eq("id", userId)
    .maybeSingle();

  const deptRow = profile?.departments as { code?: string } | { code?: string }[] | null;
  const departmentCode = Array.isArray(deptRow) ? deptRow[0]?.code : deptRow?.code;

  return {
    role: (profile?.role as UserRole) ?? "citizen",
    email: profile?.email ?? email ?? null,
    departmentCode: departmentCode ?? null,
  };
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let session: SessionProfile = { role: "citizen", email: null, departmentCode: null };
  if (user) {
    session = await loadSessionProfile(supabase, user.id, user.email);
  }

  const path = request.nextUrl.pathname;
  const isAuthPage = path.startsWith("/login") || path.startsWith("/register");

  if (!user && path.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  if (user && path.startsWith("/admin") && !canAccessAdminPath(session.role, path, session.departmentCode)) {
    const url = request.nextUrl.clone();
    url.pathname = getUnauthorizedAdminFallback(session);
    url.searchParams.delete("redirect");
    return NextResponse.redirect(url);
  }

  if (user && path === "/admin/department") {
    const deptPath = getDepartmentDashboardPath(session.role, {
      email: session.email,
      departmentCode: session.departmentCode,
    });
    if (deptPath && deptPath !== "/admin/department") {
      const url = request.nextUrl.clone();
      url.pathname = deptPath;
      return NextResponse.redirect(url);
    }
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    const redirectParam = url.searchParams.get("redirect");
    url.pathname =
      resolveSafeRedirectPath(redirectParam, session) ?? resolvePostLoginPath(session);
    url.searchParams.delete("redirect");
    return NextResponse.redirect(url);
  }

  if (user && isProvincialStaffRole(session.role) && (path === "/" || path === "/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = resolvePostLoginPath(session);
    return NextResponse.redirect(url);
  }

  if (!user && path.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
