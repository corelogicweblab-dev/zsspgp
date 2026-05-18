import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { canManageInfoAnnouncements } from "@/lib/announcement-banner";
import { findDepartmentPortalByEmail } from "@/lib/department-portals";
import { createPublicBroadcast } from "@/lib/public-broadcasts";
import type { AnnouncementCategory } from "@/types";

const SELECT_FIELDS =
  "id, title, content, category, link_url, is_published, published_at, expires_at, created_at, updated_at, department_id, departments(code)";

const VALID_CATEGORIES = new Set<AnnouncementCategory>([
  "general",
  "hiring",
  "advisory",
  "event",
  "emergency",
  "procurement",
  "holiday",
]);

function parseCategory(value: unknown): AnnouncementCategory {
  const c = String(value ?? "general").toLowerCase();
  return VALID_CATEGORIES.has(c as AnnouncementCategory) ? (c as AnnouncementCategory) : "general";
}

function isInfoRow(row: { departments?: unknown }): boolean {
  const dept = row.departments as { code?: string } | { code?: string }[] | null;
  const code = Array.isArray(dept) ? dept[0]?.code : dept?.code;
  return !code || code.toUpperCase() === "INFO";
}

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

  return { userId: user.id, departmentId: row.department_id as string | null };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "true";
  const category = searchParams.get("category");

  const supabaseClient = await createClient();
  const serviceAdmin = createAdminClient();
  const supabase = admin ? (serviceAdmin ?? supabaseClient) : (serviceAdmin ?? supabaseClient);

  if (admin) {
    const manager = await resolveManager(supabaseClient);
    if (!manager) {
      return NextResponse.json({ error: "Information Office admin access required." }, { status: 403 });
    }
  }

  let query = supabase.from("announcements").select(SELECT_FIELDS).order("published_at", { ascending: false });

  if (!admin) {
    query = query.eq("is_published", true);
  }

  if (category && VALID_CATEGORIES.has(category as AnnouncementCategory)) {
    query = query.eq("category", category);
  }

  const { data, error } = await query.limit(admin ? 100 : 50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data ?? []).filter(isInfoRow);
  return NextResponse.json({ announcements: items });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const manager = await resolveManager(supabase);
  if (!manager) {
    return NextResponse.json(
      { error: "Information Office admin access required." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();
  const category = parseCategory(body.category);
  const link_url = body.link_url ? String(body.link_url).trim() : null;
  const is_published = Boolean(body.is_published ?? true);
  const published_at = body.published_at ? String(body.published_at) : is_published ? new Date().toISOString() : null;
  const expires_at = body.expires_at ? String(body.expires_at) : null;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }

  let departmentId = manager.departmentId;
  if (!departmentId) {
    const { data: dept } = await supabase.from("departments").select("id").eq("code", "INFO").maybeSingle();
    departmentId = dept?.id ?? null;
  }

  const db = createAdminClient() ?? supabase;

  const { data, error } = await db
    .from("announcements")
    .insert({
      title,
      content,
      category,
      link_url,
      is_published,
      published_at,
      expires_at,
      author_id: manager.userId,
      department_id: departmentId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (is_published) {
    const link =
      category === "hiring" && data?.id
        ? `/announcements/${data.id}/apply`
        : "/announcements";
    await createPublicBroadcast(db, {
      title: category === "hiring" ? "New hiring announcement" : "Provincial announcement",
      message: title,
      link_url: link,
      source: category === "hiring" ? "hiring" : "pio",
    });
  }

  return NextResponse.json({ announcement: data }, { status: 201 });
}
