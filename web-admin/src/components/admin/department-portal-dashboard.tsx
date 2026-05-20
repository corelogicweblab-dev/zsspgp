"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  MessageSquareWarning,
  RefreshCw,
} from "lucide-react";
import type { DepartmentPortal } from "@/lib/department-portals";
import {
  filterComplaintsForDepartment,
  getDepartmentDashboardConfig,
} from "@/lib/department-dashboard-config";
import { COMPLAINT_STATUSES } from "@/lib/constants";
import { isMockMode } from "@/lib/env";
import { MOCK_COMPLAINTS } from "@/lib/mock-data";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelative } from "@/lib/utils";
import type { Complaint } from "@/types";

interface DepartmentPortalDashboardProps {
  portal: DepartmentPortal;
}

export function DepartmentPortalDashboard({ portal }: DepartmentPortalDashboardProps) {
  const config = getDepartmentDashboardConfig(portal.slug);
  const [rows, setRows] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isMockMode()) {
        setRows(filterComplaintsForDepartment(MOCK_COMPLAINTS, config.complaintCategories));
        return;
      }
      const res = await fetch("/api/complaints", { cache: "no-store" });
      const json = (await res.json()) as { data?: Complaint[]; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Could not load complaints.");
      setRows(filterComplaintsForDepartment(json.data ?? [], config.complaintCategories));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load data.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [config.complaintCategories]);

  useEffect(() => {
    void load();
  }, [load]);

  const open = useMemo(() => rows.filter((c) => c.status !== "resolved"), [rows]);
  const pending = rows.filter((c) => c.status === "pending").length;
  const inReview = rows.filter((c) => c.status === "under_review").length;
  const resolved = rows.filter((c) => c.status === "resolved").length;

  const complaintsHref = config.complaintCategories.length
    ? `/admin/complaints?dept=${portal.slug}`
    : "/admin/complaints";

  return (
    <AdminShell title={portal.name} subtitle={`${portal.code} — ${config.focus}`}>
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
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-300">{portal.code}</p>
          <h2 className="text-xl font-bold text-white">{portal.name}</h2>
          <p className="mt-1 text-sm text-slate-400">{portal.email}</p>
          <p className="mt-2 text-sm text-cyan-200/80">{config.focus}</p>
        </div>
        <Button type="button" variant="outline" size="sm" className="shrink-0 gap-2" onClick={() => void load()}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

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
              <p className="text-xs text-slate-500">Under review</p>
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
            <div className="rounded-xl bg-cyan-500/20 p-3 text-cyan-400">
              <MessageSquareWarning className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{open.length}</p>
              <p className="text-xs text-slate-500">Open for {portal.code}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-cyan-500/20">
          <CardHeader>
            <CardTitle>Department tools</CardTitle>
            <CardDescription>Functions for {portal.name} only</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {config.quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-xl border border-slate-200/10 bg-slate-950/40 p-4 transition hover:border-cyan-400/40 hover:bg-cyan-500/5"
              >
                <p className="font-medium text-cyan-100 group-hover:text-white">{action.label}</p>
                <p className="mt-1 text-xs text-slate-500">{action.description}</p>
                <span className="mt-2 inline-flex items-center text-xs font-semibold text-cyan-400">
                  Open <ArrowRight className="ml-1 h-3 w-3" />
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Open complaints</CardTitle>
              <CardDescription>
                {config.complaintCategories.length
                  ? `Filtered for ${portal.code} categories`
                  : "All categories (ICT oversight)"}
              </CardDescription>
            </div>
            <Link href={complaintsHref}>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading && <p className="text-sm text-slate-500">Loading…</p>}
            {!loading && open.length === 0 && (
              <p className="text-sm text-slate-500">No open complaints for this office.</p>
            )}
            {open.slice(0, 6).map((c) => {
              const status = COMPLAINT_STATUSES.find((s) => s.value === c.status);
              return (
                <div key={c.id} className="rounded-lg border border-white/10 p-3">
                  <div className="flex justify-between gap-2">
                    <p className="text-sm font-medium text-slate-200">{c.title}</p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${status?.color}`}
                    >
                      {status?.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {c.reference_number} • {formatRelative(c.created_at)} • {c.municipality}
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

