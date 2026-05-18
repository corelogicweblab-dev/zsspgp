import { NextResponse } from "next/server";
import { MOCK_INCIDENTS } from "@/lib/mock-data";
import { isMockMode } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Incident, IncidentCategory, IncidentSeverity } from "@/types";
import { enrichIncidentCoordinates } from "@/lib/zamboanga-sibugay-geo";

let mockStore = [...MOCK_INCIDENTS];

function generateReference() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `INC-${date}-${rand}`;
}

export async function GET() {
  if (isMockMode()) {
    return NextResponse.json({
      data: mockStore.map((i) => enrichIncidentCoordinates(i)),
    });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const enriched = (data ?? []).map((row) =>
      enrichIncidentCoordinates(row as Incident)
    );
    return NextResponse.json({ data: enriched });
  } catch {
    return NextResponse.json({
      data: mockStore.map((i) => enrichIncidentCoordinates(i)),
    });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    title,
    description,
    category,
    severity,
    municipality,
    barangay,
    is_emergency,
  } = body as {
    title?: string;
    description?: string;
    category?: IncidentCategory;
    severity?: IncidentSeverity;
    municipality?: string;
    barangay?: string | null;
    is_emergency?: boolean;
  };

  if (!title?.trim() || !description?.trim() || !category || !municipality?.trim()) {
    return NextResponse.json(
      { error: "title, description, category, and municipality are required" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const reference_number = generateReference();
  const resolvedSeverity = severity ?? "medium";

  if (isMockMode()) {
    const incident: Incident = {
      id: String(Date.now()),
      reference_number,
      reported_by: "demo",
      title: title.trim(),
      description: description.trim(),
      category,
      severity: resolvedSeverity,
      status: "reported",
      municipality: municipality.trim(),
      barangay: barangay?.trim() || null,
      latitude: null,
      longitude: null,
      image_url: null,
      is_emergency: Boolean(is_emergency),
      resolved_at: null,
      created_at: now,
      updated_at: now,
    };
    mockStore = [incident, ...mockStore];
    return NextResponse.json(incident, { status: 201 });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to report an incident." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("incidents")
      .insert({
        reported_by: user.id,
        title: title.trim(),
        description: description.trim(),
        category,
        severity: resolvedSeverity,
        municipality: municipality.trim(),
        barangay: barangay?.trim() || null,
        reference_number,
        status: "reported",
        is_emergency: Boolean(is_emergency),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    const incident: Incident = {
      id: String(Date.now()),
      reference_number,
      reported_by: "demo",
      title: title.trim(),
      description: description.trim(),
      category,
      severity: resolvedSeverity,
      status: "reported",
      municipality: municipality.trim(),
      barangay: barangay?.trim() || null,
      latitude: null,
      longitude: null,
      image_url: null,
      is_emergency: Boolean(is_emergency),
      resolved_at: null,
      created_at: now,
      updated_at: now,
    };
    mockStore = [incident, ...mockStore];
    return NextResponse.json(incident, { status: 201 });
  }
}
