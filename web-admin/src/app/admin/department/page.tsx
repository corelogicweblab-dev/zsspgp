import Link from "next/link";
import { Building2, MessageSquareWarning, CheckCircle, Clock } from "lucide-react";
import { MOCK_COMPLAINTS } from "@/lib/mock-data";
import { DEPARTMENTS, COMPLAINT_STATUSES } from "@/lib/constants";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelative } from "@/lib/utils";

export default function DepartmentPortalPage() {
  const assigned = MOCK_COMPLAINTS.filter((c) => c.status !== "resolved");
  const pending = MOCK_COMPLAINTS.filter((c) => c.status === "pending").length;
  const inReview = MOCK_COMPLAINTS.filter((c) => c.status === "under_review").length;
  const resolved = MOCK_COMPLAINTS.filter((c) => c.status === "resolved").length;

  return (
    <AdminShell
      title="Department Portal"
      subtitle="DRRM • Health • Tourism • Agriculture • ICT — assigned workload overview"
    >
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
              <p className="text-2xl font-bold">{DEPARTMENTS.length}</p>
              <p className="text-xs text-slate-500">Departments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Provincial Departments</CardTitle>
            <CardDescription>Quick links to department modules</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {DEPARTMENTS.map((d) => (
              <div
                key={d.code}
                className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{d.code}</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{d.name}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Assigned Complaints</CardTitle>
              <CardDescription>Open items requiring department action</CardDescription>
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
      </div>
    </AdminShell>
  );
}
