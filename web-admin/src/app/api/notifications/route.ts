import { NextResponse } from "next/server";
import { isMockMode } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";

export async function GET() {
  if (isMockMode()) {
    return NextResponse.json({ data: MOCK_NOTIFICATIONS });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] });
  } catch {
    return NextResponse.json({ data: MOCK_NOTIFICATIONS });
  }
}

export async function PATCH(request: Request) {
  if (isMockMode()) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await request.json();
    const id = body?.id as string | undefined;
    if (!id?.trim()) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
