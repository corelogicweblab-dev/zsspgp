import { CitizenPage } from "@/components/layout/citizen-page";
import { TourismProjectsShowcase } from "@/components/services/tourism-projects-showcase";

export default function TourismProjectsPage() {
  return (
    <CitizenPage
      title="Tourism & Projects"
      subtitle="Provincial tourism, agriculture, infrastructure, and community development programs"
      maxWidth="5xl"
    >
      <TourismProjectsShowcase />
    </CitizenPage>
  );
}
