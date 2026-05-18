import { AdminShell } from "@/components/layout/admin-shell";
import { GovernorDashboardBody } from "@/components/dashboard/governor-dashboard-body";
import {
  getDashboardStats,
  getRecentComplaints,
  getActiveIncidents,
  getRecentActivity,
  getNotifications,
} from "@/services/dashboard.service";
import { getJobApplications } from "@/services/job-applications.service";

export default async function GovernorDashboardPage() {
  const [stats, complaints, incidents, activity, notifications, jobApplications] =
    await Promise.all([
      getDashboardStats(),
      getRecentComplaints(5),
      getActiveIncidents(5),
      getRecentActivity(8),
      getNotifications(5),
      getJobApplications(12),
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
        jobApplications={jobApplications}
      />
    </AdminShell>
  );
}
