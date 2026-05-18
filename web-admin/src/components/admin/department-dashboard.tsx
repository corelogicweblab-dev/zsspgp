import Image from "next/image";
import Link from "next/link";
import { Building2, MessageSquareWarning, CheckCircle, Clock } from "lucide-react";
import { MOCK_COMPLAINTS } from "@/lib/mock-data";
import { COMPLAINT_STATUSES } from "@/lib/constants";
import type { DepartmentPortal } from "@/lib/department-portals";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelative } from "@/lib/utils";

interface DepartmentDashboardProps {
  portal: DepartmentPortal;
}

export function DepartmentDashboard({ portal }: DepartmentDashboardProps) {
  const assigned = MOCK_COMPLAINTS.filter((c) => c.status !== "resolved");
  const pending = MOCK_COMPLAINTS.filter((c) => c.status === "pending").length;
  const inReview = MOCK_COMPLAINTS.filter((c) => c.status === "under_review").length;
  const resolved = MOCK_COMPLAINTS.filter((c) => c.status === "resolved").length;

  return (
    <AdminShell
      title={portal.name}
      subtitle={`${portal.code} — department portal dashboard`}
    >
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-950">
          <Image
            src={portal.imagePath}
            alt={portal.name}
            fill
            className="object-contain p-2"
            sizes="80px"
            priority
          />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-300">{portal.code}</p>
          <h2 className="text-xl font-bold text-white">{portal.name}</h2>
          <p className="mt-1 text-sm text-slate-400">{portal.email}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pending}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <MessageSquareWarning className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inReview}</p>
              <p className="text-xs text-slate-500">Under Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{resolved}</p>
              <p className="text-xs text-slate-500">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{assigned.length}</p>
              <p className="text-xs text-slate-500">Open assignments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Assigned Complaints</CardTitle>
            <CardDescription>Open items for {portal.code}</CardDescription>
          </div>
          <Link href="/admin/complaints">
            <Button variant="outline" size="sm">
              View all
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {assigned.map((c) => {
            const status = COMPLAINT_STATUSES.find((s) => s.value === c.status);
            return (
              <div key={c.id} className="rounded-lg border p-3">
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-medium">{c.title}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${status?.color}`}>
                    {status?.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {c.reference_number} • {formatRelative(c.created_at)}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
