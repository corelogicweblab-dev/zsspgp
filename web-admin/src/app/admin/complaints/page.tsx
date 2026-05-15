"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { MOCK_COMPLAINTS } from "@/lib/mock-data";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from "@/lib/constants";
import { isMockMode } from "@/lib/env";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatDate, capitalize } from "@/lib/utils";
import type { Complaint, ComplaintStatus } from "@/types";

export default function AdminComplaintsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all");
  const [rows, setRows] = useState<Complaint[]>(isMockMode() ? MOCK_COMPLAINTS : []);
  const [loading, setLoading] = useState(!isMockMode());
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isMockMode()) {
      setRows(MOCK_COMPLAINTS);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/complaints");
      const json = await res.json();
      if (!res.ok) {
        setLoadError(json.error ?? "Could not load complaints.");
        setRows([]);
        return;
      }
      setRows((json.data as Complaint[]) ?? []);
    } catch {
      setLoadError("Could not load complaints.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    return rows.filter((c) => {
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.reference_number.toLowerCase().includes(q) ||
        c.municipality.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [rows, search, statusFilter]);

  const sourceNote = isMockMode() ? "demo data" : "live records (RLS applies by role)";

  return (
    <AdminShell
      title="Complaints Management"
      subtitle="Review, assign, and resolve citizen complaints province-wide"
    >
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <CardTitle>All Complaints</CardTitle>
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
            <p className="py-12 text-center text-sm text-slate-400">Loading complaints…</p>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-3">
                <div className="relative min-w-[200px] flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="pl-9"
                    placeholder="Search reference, title, municipality…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | "all")}
                  className="w-44"
                >
                  <option value="all">All statuses</option>
                  {COMPLAINT_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="border-b bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Filed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((c) => {
                      const status = COMPLAINT_STATUSES.find((s) => s.value === c.status);
                      const cat = COMPLAINT_CATEGORIES.find((x) => x.value === c.category);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/80">
                          <td className="px-4 py-3 font-mono text-xs text-blue-700">{c.reference_number}</td>
                          <td className="max-w-[200px] truncate px-4 py-3 font-medium">{c.title}</td>
                          <td className="px-4 py-3">{cat?.label ?? capitalize(c.category)}</td>
                          <td className="px-4 py-3 text-slate-600">
                            {c.municipality}
                            {c.barangay ? `, ${c.barangay}` : ""}
                            {c.purok_or_street ? ` · ${c.purok_or_street}` : ""}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status?.color}`}
                            >
                              {status?.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">{formatDate(c.created_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <p className="py-12 text-center text-sm text-slate-500">No complaints match your filters.</p>
                )}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Showing {filtered.length} of {rows.length} records ({sourceNote})
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
