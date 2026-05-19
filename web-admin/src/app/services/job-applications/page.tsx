import { getPublishedInfoAnnouncements } from "@/services/announcements.service";
import { CitizenPage } from "@/components/layout/citizen-page";
import { AnnouncementsPublicList } from "@/components/announcements/announcements-public-list";

export default async function JobApplicationsPage() {
  const announcements = await getPublishedInfoAnnouncements(50, "hiring");

  return (
    <CitizenPage
      title="Job Applications"
      subtitle="Provincial hiring, plantilla vacancies, and HR advisories — apply online when a post is open"
      maxWidth="4xl"
    >
      <AnnouncementsPublicList announcements={announcements} initialFilter="hiring" />
    </CitizenPage>
  );
}
