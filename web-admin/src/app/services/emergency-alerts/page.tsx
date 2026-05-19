import { getPublishedInfoAnnouncements } from "@/services/announcements.service";
import { CitizenPage } from "@/components/layout/citizen-page";
import { AnnouncementsPublicList } from "@/components/announcements/announcements-public-list";

export default async function EmergencyAlertsPage() {
  const announcements = await getPublishedInfoAnnouncements(50, "emergency");

  return (
    <CitizenPage
      title="Emergency Alerts"
      subtitle="Urgent provincial warnings and DRRM advisories — verified by authorized offices"
      maxWidth="4xl"
    >
      <AnnouncementsPublicList announcements={announcements} initialFilter="emergency" />
    </CitizenPage>
  );
}
