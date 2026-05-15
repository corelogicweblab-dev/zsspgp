import { AdminShell } from "@/components/layout/admin-shell";
import { GovernorDashboardBody } from "@/components/dashboard/governor-dashboard-body";
import {
  getDashboardStats,
  getRecentComplaints,
  getActiveIncidents,
  getRecentActivity,
  getNotifications,
} from "@/services/dashboard.service";

export default async function GovernorDashboardPage() {
  const [stats, complaints, incidents, activity, notifications] = await Promise.all([
    getDashboardStats(),
    getRecentComplaints(5),
    getActiveIncidents(5),
    getRecentActivity(8),
    getNotifications(5),
  ]);

  return (
    <AdminShell
      title="Governor Command Center"
      subtitle="Provincial overview • Real-time governance analytics"
    >
      <GovernorDashboardBody
        stats={stats}
        complaints={complaints}
        incidents={incidents}
        activity={activity}
        notifications={notifications}
      />
    </AdminShell>
  );
}
