import { getPublicBroadcasts } from "@/services/public-broadcasts.service";
import { CitizenPage } from "@/components/layout/citizen-page";
import { PublicBroadcastsList } from "@/components/services/public-broadcasts-list";

export default async function PublicBroadcastsPage() {
  const broadcasts = await getPublicBroadcasts(40);

  return (
    <CitizenPage
      title="Public Broadcasts"
      subtitle="Official advisories pushed to citizens through the ZSSPGP notification system"
      maxWidth="3xl"
    >
      <PublicBroadcastsList broadcasts={broadcasts} />
    </CitizenPage>
  );
}
