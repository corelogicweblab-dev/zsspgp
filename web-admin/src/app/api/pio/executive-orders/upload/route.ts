import { NextResponse } from "next/server";
import { getNewsDataClient } from "@/lib/news-db";
import { requirePioManager } from "@/lib/pio-api-auth";
import { friendlyPioDbError } from "@/lib/fetch-json";

const BUCKET = "executive-order-covers";

export async function POST(request: Request) {
  try {
    const auth = await requirePioManager();
    if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file." }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${auth.userId}/${Date.now()}.${ext}`;
    const db = getNewsDataClient(auth.supabase);
    const buffer = await file.arrayBuffer();

    const { error: uploadError } = await db.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type || undefined,
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      return NextResponse.json({ error: friendlyPioDbError(uploadError.message) }, { status: 500 });
    }

    const { data } = db.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    console.error("[executive-orders upload]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 500 }
    );
  }
}
