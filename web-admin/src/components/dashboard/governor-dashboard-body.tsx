"use client";

import Link from "next/link";
import {
  MessageSquareWarning,
  AlertTriangle,
  Users,
  CheckCircle,
  Building2,
  Bell,
} from "lucide-react";
import { GovernorCommandHub } from "@/components/dashboard/governor-command-hub";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  ComplaintsByCategoryChart,
  IncidentsTrendChart,
  MunicipalityActivityChart,
} from "@/components/dashboard/charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { capitalize, formatRelative } from "@/lib/utils";
import { COMPLAINT_STATUSES, INCIDENT_SEVERITIES } from "@/lib/constants";
import type {
  ActivityLog,
  Complaint,
  DashboardStats,
  Incident,
  Notification,
} from "@/types";

interface GovernorDashboardBodyProps {
  stats: DashboardStats;
  complaints: Complaint[];
  incidents: Incident[];
  activity: ActivityLog[];
  notifications: Notification[];
}

export function GovernorDashboardBody({
  stats,
  complaints,
  incidents,
  activity,
  notifications,
}: GovernorDashboardBodyProps) {
  return (
    <>
      <GovernorCommandHub />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Complaints"
          value={stats.totalComplaints.toLocaleString()}
          icon={MessageSquareWarning}
          change="+12% this month"
          trend="up"
        />
        <StatCard
          title="Pending Complaints"
          value={stats.pendingComplaints}
          icon={MessageSquareWarning}
        />
        <StatCard
          title="Active Incidents"
          value={stats.activeIncidents}
          icon={AlertTriangle}
          change={`${stats.criticalIncidents} critical`}
        />
        <StatCard title="Resolved Today" value={stats.resolvedToday} icon={CheckCircle} trend="up" />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Registered Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
        />
        <StatCard title="Departments" value={stats.departmentCount} icon={Building2} />
        <StatCard title="Unread Alerts" value={stats.notificationsUnread} icon={Bell} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <ComplaintsByCategoryChart />
            <IncidentsTrendChart />
          </div>
          <MunicipalityActivityChart />
        </div>
        <div className="space-y-6">
          <RecentActivity activities={activity} />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Notifications</CardTitle>
              <Link
                href="/admin/notifications"
                className="text-xs font-medium text-cyan-400 hover:underline"
              >
                Manage all
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatRelative(n.created_at)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Recent Complaints</CardTitle>
            <Link
              href="/admin/complaints"
              className="text-xs font-medium text-cyan-400 hover:underline"
            >
              Full workspace
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {complaints.map((c) => {
              const status = COMPLAINT_STATUSES.find((s) => s.value === c.status);
              return (
                <Link key={c.id} href="/admin/complaints" className="block rounded-lg border border-transparent transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/5">
                  <div className="flex justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-slate-500">
                        {c.reference_number} • {c.municipality}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status?.color}`}>
                      {status?.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Active Incidents</CardTitle>
            <Link
              href="/admin/incidents"
              className="text-xs font-medium text-cyan-400 hover:underline"
            >
              Full workspace
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {incidents.map((i) => {
              const sev = INCIDENT_SEVERITIES.find((s) => s.value === i.severity);
              return (
                <Link key={i.id} href="/admin/incidents" className="block rounded-lg border border-transparent transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/5">
                  <div className="flex justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">{i.title}</p>
                      <p className="text-xs text-slate-500">
                        {i.reference_number} • {capitalize(i.category)}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${sev?.color}`}>
                      {sev?.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
