import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JobApplicationForm } from "@/components/applications/job-application-form";
import { CitizenPage } from "@/components/layout/citizen-page";
import { getPublishedAnnouncement } from "@/services/job-applications.service";

export default async function JobApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const posting = await getPublishedAnnouncement(id);

  if (!posting) notFound();

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
      <article
        className="prose prose-sm mb-8 max-w-none rounded-xl border border-slate-200 bg-white p-5 text-slate-700"
        dangerouslySetInnerHTML={{ __html: posting.content }}
      />
      <JobApplicationForm announcementId={posting.id} announcementTitle={posting.title} />
    </CitizenPage>
  );
}
