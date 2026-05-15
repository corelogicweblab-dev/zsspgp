"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MessageSquareWarning, PlusCircle, Megaphone } from "lucide-react";
import { MOCK_COMPLAINTS } from "@/lib/mock-data";
import { COMPLAINT_STATUSES } from "@/lib/constants";
import { isMockMode } from "@/lib/env";
import { formatDate, formatRelative } from "@/lib/utils";
import { CitizenPage } from "@/components/layout/citizen-page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Complaint } from "@/types";

export default function DashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(isMockMode() ? MOCK_COMPLAINTS : []);
  const [loading, setLoading] = useState(!isMockMode());
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isMockMode()) {
      setComplaints(MOCK_COMPLAINTS);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/complaints");
      const json = await res.json();
      if (!res.ok) {
        setLoadError(json.error ?? "Could not load your complaints.");
        setComplaints([]);
        return;
      }
      setComplaints((json.data as Complaint[]) ?? []);
    } catch {
      setLoadError("Could not load your complaints.");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const pending = complaints.filter((c) => c.status === "pending").length;
  const inReview = complaints.filter((c) => c.status === "under_review").length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;

  return (
    <CitizenPage
      title="Citizen Dashboard"
      subtitle="Track your complaints and access provincial services"
      maxWidth="4xl"
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
              <MessageSquareWarning className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{pending}</p>
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
              <p className="text-2xl font-bold text-slate-900">{inReview}</p>
              <p className="text-xs text-slate-500">Under Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
              <MessageSquareWarning className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{resolved}</p>
              <p className="text-xs text-slate-500">Resolved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Link href="/complaints">
          <Button variant="gov">
            <PlusCircle className="h-4 w-4" />
            File New Complaint
          </Button>
        </Link>
        <Link href="/announcements">
          <Button variant="outline">
            <Megaphone className="h-4 w-4" />
            Announcements
          </Button>
        </Link>
        {!isMockMode() && (
          <Button type="button" variant="outline" onClick={() => void load()}>
            Refresh list
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Complaints</CardTitle>
          <CardDescription>
            {isMockMode()
              ? "Demo sample data — connect Supabase for your real filings."
              : "Records visible to you based on your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {loadError}
            </div>
          )}
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading…</p>
          ) : complaints.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No complaints yet.</p>
          ) : (
            complaints.map((c) => {
              const status = COMPLAINT_STATUSES.find((s) => s.value === c.status);
              return (
                <div
                  key={c.id}
                  className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{c.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {c.reference_number} • {c.municipality}
                        {c.barangay ? `, ${c.barangay}` : ""}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status?.color}`}
                    >
                      {status?.label}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{c.description}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                    <span>Filed {formatDate(c.created_at)}</span>
                    <span>Updated {formatRelative(c.updated_at)}</span>
                  </div>
                  {c.admin_response && (
                    <div className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-900">
                      <span className="font-medium">Government response: </span>
                      {c.admin_response}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </CitizenPage>
  );
}
