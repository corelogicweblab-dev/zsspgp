import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { rateLimit, getClientIp, sanitizeInput, constantTimeEqual } from "@/lib/security";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`governor-login:${ip}`, 5, 15 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter ?? 60) } }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = sanitizeInput(body.email ?? "", 255).toLowerCase();
  const password = body.password ?? "";

  const execEmail = process.env.GOVERNOR_EXECUTIVE_EMAIL?.toLowerCase().trim();
  const execPassword = process.env.GOVERNOR_EXECUTIVE_PASSWORD ?? "";

  if (!execEmail || !execPassword) {
    return NextResponse.json(
      { error: "Executive access is not configured on this environment." },
      { status: 503 }
    );
  }

  if (!constantTimeEqual(email, execEmail) || !constantTimeEqual(password, execPassword)) {
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "Invalid executive credentials." }, { status: 401 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email: execEmail, password });

  if (error || !data.user) {
    return NextResponse.json(
      {
        error:
          "Governor account not found in Supabase. Create the user with governor_super_admin role using the executive email.",
      },
      { status: 401 }
    );
  }

  await supabase.from("users").upsert(
    {
      id: data.user.id,
      email: execEmail,
      full_name: "Provincial Governor",
      role: "governor_super_admin",
    },
    { onConflict: "id" }
  );

  return NextResponse.json({ success: true, redirect: "/admin/governor" });
}
