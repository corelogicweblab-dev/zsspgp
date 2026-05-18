"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  AlertTriangle,
  MapPin,
  Radio,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { MOCK_INCIDENTS, MOCK_STATS } from "@/lib/mock-data";
import { INCIDENT_SEVERITIES } from "@/lib/constants";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelative } from "@/lib/utils";

const DrrmOpsMap = dynamic(
  () => import("@/components/admin/drrm-ops-map").then((m) => m.DrrmOpsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(420px,55vh)] items-center justify-center rounded-xl border border-cyan-500/20 bg-slate-900/50 text-sm text-slate-400">
        Loading provincial operations map…
      </div>
    ),
  }
);

export function DrrmOpsDashboard() {
  const active = MOCK_INCIDENTS.filter((i) => i.status !== "resolved" && i.status !== "closed");
  const critical = MOCK_INCIDENTS.filter((i) => i.severity === "critical");

  return (
    <AdminShell
      title="DRRM Super Dashboard Ops"
      subtitle="Disaster Risk Reduction & Management — live provincial map and incident command"
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-red-500/20">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-red-500/20 p-3 text-red-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{critical.length}</p>
              <p className="text-xs text-slate-500">Critical incidents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-500/20 p-3 text-amber-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{active.length}</p>
              <p className="text-xs text-slate-500">Active responses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-cyan-500/20 p-3 text-cyan-400">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{MOCK_STATS.activeIncidents}</p>
              <p className="text-xs text-slate-500">Province-wide (ops feed)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-indigo-500/20 p-3 text-indigo-400">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">16</p>
              <p className="text-xs text-slate-500">Municipalities monitored</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 overflow-hidden border-cyan-500/25">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-400" />
            Provincial Operations Map
          </CardTitle>
          <CardDescription>
            Incident pins by municipality — Zamboanga Sibugay (OpenStreetMap). Severity: low →
            critical.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <DrrmOpsMap incidents={MOCK_INCIDENTS} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Incidents</CardTitle>
              <CardDescription>DRRM command queue</CardDescription>
            </div>
            <Link href="/admin/incidents">
              <Button variant="outline" size="sm">
                Manage all
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {active.map((inc) => {
              const sev = INCIDENT_SEVERITIES.find((s) => s.value === inc.severity);
              return (
                <div
                  key={inc.id}
                  className="rounded-lg border border-slate-700/80 bg-slate-900/40 p-3"
                >
                  <div className="flex justify-between gap-2">
                    <p className="text-sm font-medium text-white">{inc.title}</p>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${sev?.color}`}
                    >
                      {sev?.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {inc.reference_number} · {inc.municipality} · {formatRelative(inc.created_at)}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/admin/incidents">
              <Button variant="gov" className="w-full justify-start">
                Open Incident Command
              </Button>
            </Link>
            <Link href="/admin/complaints">
              <Button variant="outline" className="w-full justify-start">
                Review Assigned Complaints
              </Button>
            </Link>
            <Link href="/admin/notifications">
              <Button variant="outline" className="w-full justify-start">
                Broadcast Alert
              </Button>
            </Link>
            <p className="mt-2 text-xs text-slate-500">
              Login: drrm@zamboangasibugay.gov.ph · Hotline (062) 333-0000
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
