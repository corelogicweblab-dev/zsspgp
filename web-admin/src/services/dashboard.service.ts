import { createClient } from "@/lib/supabase/server";
import {
  MOCK_STATS,
  MOCK_COMPLAINTS,
  MOCK_INCIDENTS,
  MOCK_ACTIVITY,
  MOCK_NOTIFICATIONS,
} from "@/lib/mock-data";
import type { DashboardStats, Complaint, Incident, ActivityLog, Notification } from "@/types";

const useMock = () =>
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export async function getDashboardStats(): Promise<DashboardStats> {
  if (useMock()) return MOCK_STATS;

  const supabase = await createClient();
  const [complaints, incidents, users, departments] = await Promise.all([
    supabase.from("complaints").select("status", { count: "exact" }),
    supabase.from("incidents").select("severity, status", { count: "exact" }),
    supabase.from("users").select("id", { count: "exact" }),
    supabase.from("departments").select("id", { count: "exact" }),
  ]);

  const pending = complaints.data?.filter((c) => c.status === "pending").length ?? 0;
  const active = incidents.data?.filter((i) => i.status === "active" || i.status === "responding").length ?? 0;
  const critical = incidents.data?.filter((i) => i.severity === "critical").length ?? 0;

  return {
    totalComplaints: complaints.count ?? 0,
    pendingComplaints: pending,
    activeIncidents: active,
    criticalIncidents: critical,
    totalUsers: users.count ?? 0,
    departmentCount: departments.count ?? 0,
    resolvedToday: 0,
    notificationsUnread: 0,
  };
}

export async function getRecentComplaints(limit = 5): Promise<Complaint[]> {
  if (useMock()) return MOCK_COMPLAINTS.slice(0, limit);
  const supabase = await createClient();
  const { data } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Complaint[]) ?? [];
}

export async function getActiveIncidents(limit = 5): Promise<Incident[]> {
  if (useMock()) return MOCK_INCIDENTS.filter((i) => i.status !== "resolved").slice(0, limit);
  const supabase = await createClient();
  const { data } = await supabase
    .from("incidents")
    .select("*")
    .in("status", ["reported", "active", "responding"])
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Incident[]) ?? [];
}

export async function getRecentActivity(limit = 10): Promise<ActivityLog[]> {
  if (useMock()) return MOCK_ACTIVITY.slice(0, limit);
  const supabase = await createClient();
  const { data } = await supabase
    .from("activity_logs")
    .select("*, user:users(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as ActivityLog[]) ?? [];
}

export async function getNotifications(limit = 10): Promise<Notification[]> {
  if (useMock()) return MOCK_NOTIFICATIONS.slice(0, limit);
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Notification[]) ?? [];
}
