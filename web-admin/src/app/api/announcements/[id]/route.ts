import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { canManageInfoAnnouncements } from "@/lib/announcement-banner";
import { findDepartmentPortalByEmail } from "@/lib/department-portals";
import type { AnnouncementCategory } from "@/types";

const VALID_CATEGORIES = new Set<AnnouncementCategory>([
  "general",
  "hiring",
  "advisory",
  "event",
  "emergency",
  "procurement",
  "holiday",
]);

async function resolveManager(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row } = await supabase
    .from("users")
    .select("id, role, email, department_id, departments:department_id (code)")
    .eq("id", user.id)
    .single();

  if (!row) return null;

  const deptRaw = row.departments as { code?: string } | { code?: string }[] | null;
  const departmentCode = Array.isArray(deptRaw) ? deptRaw[0]?.code : deptRaw?.code;

  if (
    !canManageInfoAnnouncements(row.role as string, departmentCode ?? null) &&
    !canManageInfoAnnouncements(
      row.role as string,
      findDepartmentPortalByEmail(row.email)?.code ?? null
    )
  ) {
    return null;
  }

  return { userId: user.id };
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const manager = await resolveManager(supabase);
  if (!manager) {
    return NextResponse.json({ error: "Information Office admin access required." }, { status: 403 });
  }

  const body = await request.json();
  const patch: Record<string, unknown> = {};

  if (body.title !== undefined) patch.title = String(body.title).trim();
  if (body.content !== undefined) patch.content = String(body.content).trim();
  if (body.category !== undefined) {
    const c = String(body.category).toLowerCase();
    patch.category = VALID_CATEGORIES.has(c as AnnouncementCategory) ? c : "general";
  }
  if (body.link_url !== undefined) patch.link_url = body.link_url ? String(body.link_url).trim() : null;
  if (body.is_published !== undefined) patch.is_published = Boolean(body.is_published);
  if (body.published_at !== undefined) patch.published_at = body.published_at;
  if (body.expires_at !== undefined) patch.expires_at = body.expires_at;

  const db = createAdminClient() ?? supabase;
  const { data, error } = await db.from("announcements").update(patch).eq("id", id).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: statusFromError(error) });
  }

  return NextResponse.json({ announcement: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const manager = await resolveManager(supabase);
  if (!manager) {
    return NextResponse.json({ error: "Information Office admin access required." }, { status: 403 });
  }

  const db = createAdminClient() ?? supabase;
  const { error } = await db.from("announcements").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function statusFromError(error: { code?: string }): number {
  return error.code === "PGRST116" ? 404 : 500;
}
