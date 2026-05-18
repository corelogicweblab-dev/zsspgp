"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MUNICIPALITIES } from "@/lib/constants";

export function JobApplicationForm({
  announcementId,
  announcementTitle,
  demoMode = false,
}: {
  announcementId: string;
  announcementTitle: string;
  demoMode?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [resumeName, setResumeName] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (demoMode) {
      setError(
        "Online submission is available for live PIO postings only. For this sample listing, submit your PDS and documents to the Provincial HRMO at the Capitol, Ipil."
      );
      setLoading(false);
      return;
    }

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const resume = fd.get("resume");
    if (!(resume instanceof File) || resume.size === 0) {
      setError("Please upload your resume (PDF or Word, required).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/job-applications", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Submission failed.");
        return;
      }
      setDone(true);
      router.refresh();
    } catch {
      setError("Unable to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <p className="text-lg font-semibold text-emerald-200">Application submitted</p>
        <p className="mt-2 text-sm text-slate-300">
          Thank you. The Provincial Government has received your application for{" "}
          <strong>{announcementTitle}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-cyan-500/20 bg-slate-900/50 p-5 sm:p-6">
      <input type="hidden" name="announcement_id" value={announcementId} />
      <p className="text-sm text-slate-400">
        Complete this form and upload your resume. Submissions appear in the Governor&apos;s command
        center for review.
      </p>
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="full_name">Full name *</Label>
          <Input id="full_name" name="full_name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Contact number</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="municipality">Municipality</Label>
          <select
            id="municipality"
            name="municipality"
            className="flex h-10 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 text-sm text-slate-200"
          >
            <option value="">Select…</option>
            {MUNICIPALITIES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="barangay">Barangay</Label>
          <Input id="barangay" name="barangay" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="position_applied">Position applied for</Label>
          <Input id="position_applied" name="position_applied" placeholder={announcementTitle} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="cover_letter">Cover letter / qualifications summary</Label>
          <textarea
            id="cover_letter"
            name="cover_letter"
            rows={4}
            className="flex w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-200"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="resume">Resume / CV * (PDF or Word, max 10 MB)</Label>
          <Input
            id="resume"
            name="resume"
            type="file"
            required={!demoMode}
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-600 file:px-3 file:py-1.5 file:text-sm file:text-white"
            onChange={(e) => setResumeName(e.target.files?.[0]?.name ?? null)}
          />
          {resumeName && <p className="text-xs text-cyan-400/90">Selected: {resumeName}</p>}
        </div>
      </div>
      <Button type="submit" variant="gov" className="w-full sm:w-auto" disabled={loading}>
        {loading ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
