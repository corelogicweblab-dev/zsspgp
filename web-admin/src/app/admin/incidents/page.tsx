"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { AlertTriangle, Search } from "lucide-react";
import { MOCK_INCIDENTS } from "@/lib/mock-data";
import { INCIDENT_CATEGORIES, INCIDENT_SEVERITIES } from "@/lib/constants";
import { isMockMode } from "@/lib/env";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDate, capitalize } from "@/lib/utils";
import type { Incident, IncidentSeverity } from "@/types";

export default function AdminIncidentsPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | "all">("all");
  const [rows, setRows] = useState<Incident[]>(isMockMode() ? MOCK_INCIDENTS : []);
  const [loading, setLoading] = useState(!isMockMode());
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isMockMode()) {
      setRows(MOCK_INCIDENTS);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/incidents");
      const json = await res.json();
      if (!res.ok) {
        setLoadError(json.error ?? "Could not load incidents.");
        setRows([]);
        return;
      }
      setRows((json.data as Incident[]) ?? []);
    } catch {
      setLoadError("Could not load incidents.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    return rows.filter((i) => {
      const matchesSeverity = severityFilter === "all" || i.severity === severityFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        i.title.toLowerCase().includes(q) ||
        i.reference_number.toLowerCase().includes(q) ||
        i.municipality.toLowerCase().includes(q);
      return matchesSeverity && matchesSearch;
    });
  }, [rows, search, severityFilter]);

  const criticalCount = rows.filter((i) => i.severity === "critical").length;
  const emergencyCount = rows.filter((i) => i.is_emergency).length;

  return (
    <AdminShell
      title="DRRM Incident Management"
      subtitle="Monitor and coordinate disaster risk reduction responses"
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-red-100 p-3 text-red-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{criticalCount}</p>
              <p className="text-xs text-slate-500">Critical incidents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-orange-100 p-3 text-orange-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{emergencyCount}</p>
              <p className="text-xs text-slate-500">Emergency flagged</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <CardTitle>Incident Registry</CardTitle>
          {!isMockMode() && (
            <button
              type="button"
              onClick={() => void load()}
              className="text-xs font-semibold text-cyan-400 hover:underline"
            >
              Refresh
            </button>
          )}
        </CardHeader>
        <CardContent>
          {loadError && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {loadError}
            </div>
          )}
          {loading ? (
            <p className="py-12 text-center text-sm text-slate-400">Loading incidents…</p>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-3">
                <div className="relative min-w-[200px] flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="pl-9"
                    placeholder="Search incidents…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as IncidentSeverity | "all")}
                  className="w-44"
                >
                  <option value="all">All severities</option>
                  {INCIDENT_SEVERITIES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="border-b bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Severity</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Reported</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((i) => {
                      const sev = INCIDENT_SEVERITIES.find((s) => s.value === i.severity);
                      const cat = INCIDENT_CATEGORIES.find((c) => c.value === i.category);
                      return (
                        <tr key={i.id} className="hover:bg-slate-50/80">
                          <td className="px-4 py-3 font-mono text-xs text-blue-700">{i.reference_number}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{i.title}</span>
                              {i.is_emergency && <Badge variant="danger">Emergency</Badge>}
                            </div>
                          </td>
                          <td className="px-4 py-3">{cat?.label ?? capitalize(i.category)}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${sev?.color}`}>
                              {sev?.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 capitalize">{i.status.replace(/_/g, " ")}</td>
                          <td className="px-4 py-3 text-slate-600">
                            {i.municipality}
                            {i.barangay ? `, ${i.barangay}` : ""}
                          </td>
                          <td className="px-4 py-3 text-slate-500">{formatDate(i.created_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <p className="py-12 text-center text-sm text-slate-500">No incidents match your filters.</p>
                )}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Showing {filtered.length} of {rows.length} records ({isMockMode() ? "demo" : "live"})
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
