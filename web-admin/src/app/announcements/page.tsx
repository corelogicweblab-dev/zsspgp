import { getPublishedInfoAnnouncements } from "@/services/announcements.service";
import { CitizenPage } from "@/components/layout/citizen-page";
import { AnnouncementsPublicList } from "@/components/announcements/announcements-public-list";
import type { AnnouncementCategory } from "@/types";

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function AnnouncementsPage({ searchParams }: PageProps) {
  const { category: rawCategory } = await searchParams;
  const category =
    rawCategory &&
    [
      "general",
      "hiring",
      "advisory",
      "event",
      "emergency",
      "procurement",
      "holiday",
    ].includes(rawCategory)
      ? (rawCategory as AnnouncementCategory)
      : undefined;

  const announcements = await getPublishedInfoAnnouncements(50);

  return (
    <CitizenPage
      title="Provincial Announcements"
      subtitle="Official hiring, advisories, events, and updates from the Provincial Information Office"
      maxWidth="4xl"
    >
      <AnnouncementsPublicList
        announcements={announcements}
        initialFilter={category ?? "all"}
      />
    </CitizenPage>
  );
}
