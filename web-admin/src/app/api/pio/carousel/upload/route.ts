import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requirePioManager } from "@/lib/pio-api-auth";

const BUCKET = "pio-carousel";

export async function POST(request: Request) {
  const auth = await requirePioManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${auth.userId}/${Date.now()}.${ext}`;
  const db = createAdminClient() ?? auth.supabase;
  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await db.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || undefined,
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data } = db.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
