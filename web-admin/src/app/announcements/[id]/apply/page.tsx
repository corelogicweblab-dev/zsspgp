import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JobApplicationForm } from "@/components/applications/job-application-form";
import { CitizenPage } from "@/components/layout/citizen-page";
import { getPublishedAnnouncementById, isDemoAnnouncementId } from "@/services/announcements.service";

export default async function JobApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const posting = await getPublishedAnnouncementById(id);

  if (!posting || posting.category !== "hiring") notFound();

  const isDemo = isDemoAnnouncementId(id);

  return (
    <CitizenPage
      title="Job application"
      subtitle={posting.title}
      maxWidth="lg"
    >
      <Link
        href="/announcements?category=hiring"
        className="mb-6 inline-flex items-center gap-1 text-sm text-cyan-400 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to hiring announcements
      </Link>
      {isDemo && (
        <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          This is a sample hiring post for preview. Live PIO postings accept online applications;
          you may still review requirements below.
        </p>
      )}
      <article
        className="prose prose-sm mb-8 max-w-none rounded-xl border border-slate-200 bg-white p-5 text-slate-700"
        dangerouslySetInnerHTML={{ __html: posting.content }}
      />
      <JobApplicationForm
        announcementId={posting.id}
        announcementTitle={posting.title}
        demoMode={isDemo}
      />
    </CitizenPage>
  );
}
