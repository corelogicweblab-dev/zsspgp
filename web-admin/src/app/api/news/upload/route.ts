import { NextResponse } from "next/server";
import { requireNewsManager } from "@/lib/news-auth";
import { getNewsDataClient } from "@/lib/news-db";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "news-covers";

export async function POST(request: Request) {
  const auth = await requireNewsManager();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${auth.profile.userId}/${Date.now()}.${ext}`;

  const admin = createAdminClient();
  const db = admin ?? getNewsDataClient(auth.supabase);

  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await db.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || undefined,
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = db.storage.from(BUCKET).getPublicUrl(path);
  const mediaType = file.type.startsWith("video/") ? "video" : "image";

  return NextResponse.json({ url: data.publicUrl, mediaType });
}
