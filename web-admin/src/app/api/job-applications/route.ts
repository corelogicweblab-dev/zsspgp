import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createPublicBroadcast } from "@/lib/public-broadcasts";
import { isDemoAnnouncementId } from "@/services/announcements.service";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as string;
  if (!["governor_super_admin", "ict_admin", "information_office", "department_admin"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = createAdminClient() ?? supabase;
  const { data, error } = await db
    .from("job_applications")
    .select(
      "id, announcement_id, full_name, email, phone, municipality, barangay, position_applied, cover_letter, status, created_at, announcements(title, category)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ applications: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const announcement_id = String(body.announcement_id ?? "").trim();
  const full_name = String(body.full_name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = body.phone ? String(body.phone).trim() : null;
  const municipality = body.municipality ? String(body.municipality).trim() : null;
  const barangay = body.barangay ? String(body.barangay).trim() : null;
  const position_applied = body.position_applied ? String(body.position_applied).trim() : null;
  const cover_letter = body.cover_letter ? String(body.cover_letter).trim() : null;

  if (!announcement_id || !full_name || !email) {
    return NextResponse.json({ error: "Name, email, and posting are required." }, { status: 400 });
  }

  if (isDemoAnnouncementId(announcement_id)) {
    return NextResponse.json(
      {
        error:
          "This posting is a demo listing. Apply in person at the Provincial HRMO, Capitol Compound, Ipil, or wait for a live PIO hiring post.",
      },
      { status: 400 }
    );
  }

  const db = createAdminClient();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const { data: posting } = await db
    .from("announcements")
    .select("id, title, category, is_published")
    .eq("id", announcement_id)
    .eq("is_published", true)
    .maybeSingle();

  if (!posting) {
    return NextResponse.json({ error: "This posting is not available." }, { status: 404 });
  }

  const { data, error } = await db
    .from("job_applications")
    .insert({
      announcement_id,
      full_name,
      email,
      phone,
      municipality,
      barangay,
      position_applied,
      cover_letter,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await createPublicBroadcast(db, {
    title: "Application received",
    message: `${full_name} submitted an application for ${posting.title}.`,
    link_url: "/admin/governor",
    source: "hiring",
  });

  return NextResponse.json({ id: data.id, message: "Application submitted successfully." }, { status: 201 });
}
