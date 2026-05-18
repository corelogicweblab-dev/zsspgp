"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelative } from "@/lib/utils";
import type { JobApplication } from "@/types";

export function GovernorJobApplications({ applications }: { applications: JobApplication[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-amber-400" />
          Job applications
        </CardTitle>
        <span className="text-xs text-slate-500">{applications.length} recent</span>
      </CardHeader>
      <CardContent className="space-y-3">
        {applications.length === 0 ? (
          <p className="text-sm text-slate-500">No applications submitted yet.</p>
        ) : (
          applications.slice(0, 8).map((app) => {
            const postingTitle =
              app.announcements && !Array.isArray(app.announcements)
                ? app.announcements.title
                : "Hiring post";
            return (
              <div key={app.id} className="rounded-lg border border-cyan-500/15 p-3">
                <p className="text-sm font-medium text-slate-100">{app.full_name}</p>
                <p className="text-xs text-cyan-400/90">{postingTitle}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {app.email}
                  {app.municipality ? ` · ${app.municipality}` : ""}
                </p>
                {app.resume_url && (
                  <a
                    href={app.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-semibold text-cyan-400 hover:underline"
                  >
                    View resume →
                  </a>
                )}
                <p className="mt-1 text-[10px] text-slate-600">{formatRelative(app.created_at)}</p>
              </div>
            );
          })
        )}
        <Link href="/announcements?category=hiring" className="text-xs font-medium text-cyan-400 hover:underline">
          View hiring announcements →
        </Link>
      </CardContent>
    </Card>
  );
}
