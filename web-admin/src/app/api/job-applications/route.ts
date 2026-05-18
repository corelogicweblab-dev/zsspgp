import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createPublicBroadcast } from "@/lib/public-broadcasts";
import { isDemoAnnouncementId } from "@/services/announcements.service";

const RESUME_BUCKET = "job-resumes";
const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

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
      "id, announcement_id, full_name, email, phone, municipality, barangay, position_applied, cover_letter, resume_url, status, created_at, announcements(title, category)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const withSigned = await Promise.all(
    (data ?? []).map(async (row) => {
      const raw = row.resume_url as string | null;
      if (!raw?.startsWith(`${RESUME_BUCKET}/`)) return row;
      const path = raw.slice(`${RESUME_BUCKET}/`.length);
      const { data: signed } = await db.storage.from(RESUME_BUCKET).createSignedUrl(path, 3600);
      return { ...row, resume_url: signed?.signedUrl ?? raw };
    })
  );

  return NextResponse.json({ applications: withSigned });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let announcement_id: string;
  let full_name: string;
  let email: string;
  let phone: string | null = null;
  let municipality: string | null = null;
  let barangay: string | null = null;
  let position_applied: string | null = null;
  let cover_letter: string | null = null;
  let resumeFile: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    announcement_id = String(form.get("announcement_id") ?? "").trim();
    full_name = String(form.get("full_name") ?? "").trim();
    email = String(form.get("email") ?? "").trim();
    phone = form.get("phone") ? String(form.get("phone")).trim() : null;
    municipality = form.get("municipality") ? String(form.get("municipality")).trim() : null;
    barangay = form.get("barangay") ? String(form.get("barangay")).trim() : null;
    position_applied = form.get("position_applied")
      ? String(form.get("position_applied")).trim()
      : null;
    cover_letter = form.get("cover_letter") ? String(form.get("cover_letter")).trim() : null;
    const file = form.get("resume");
    resumeFile = file instanceof File && file.size > 0 ? file : null;
  } else {
    const body = await request.json();
    announcement_id = String(body.announcement_id ?? "").trim();
    full_name = String(body.full_name ?? "").trim();
    email = String(body.email ?? "").trim();
    phone = body.phone ? String(body.phone).trim() : null;
    municipality = body.municipality ? String(body.municipality).trim() : null;
    barangay = body.barangay ? String(body.barangay).trim() : null;
    position_applied = body.position_applied ? String(body.position_applied).trim() : null;
    cover_letter = body.cover_letter ? String(body.cover_letter).trim() : null;
  }

  if (!announcement_id || !full_name || !email) {
    return NextResponse.json({ error: "Name, email, and posting are required." }, { status: 400 });
  }

  if (!resumeFile) {
    return NextResponse.json({ error: "Resume upload is required (PDF or Word)." }, { status: 400 });
  }

  if (resumeFile.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Resume must be 10 MB or smaller." }, { status: 400 });
  }

  if (resumeFile.type && !ALLOWED_RESUME_TYPES.has(resumeFile.type)) {
    return NextResponse.json(
      { error: "Resume must be PDF or Word (.pdf, .doc, .docx)." },
      { status: 400 }
    );
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

  const ext = resumeFile.name.split(".").pop()?.toLowerCase() || "pdf";
  const resumePath = `${announcement_id}/${Date.now()}-${full_name.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}.${ext}`;
  const buffer = await resumeFile.arrayBuffer();

  const { error: uploadError } = await db.storage.from(RESUME_BUCKET).upload(resumePath, buffer, {
    contentType: resumeFile.type || "application/pdf",
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const resume_url = `${RESUME_BUCKET}/${resumePath}`;

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
      resume_url,
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
