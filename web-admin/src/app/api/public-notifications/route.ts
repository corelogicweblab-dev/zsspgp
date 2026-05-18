import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const db = createAdminClient();
  if (!db) {
    return NextResponse.json({ notifications: [] });
  }

  const { data, error } = await db
    .from("public_broadcasts")
    .select("id, title, message, link_url, source, created_at")
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ notifications: data ?? [] });
}
