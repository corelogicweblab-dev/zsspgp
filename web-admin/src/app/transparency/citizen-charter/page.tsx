import { CitizenPage } from "@/components/layout/citizen-page";
import { TransparencyDocumentView } from "@/components/transparency/transparency-document";
import { CITIZEN_CHARTER } from "@/lib/transparency-content";

export const metadata = {
  title: "Citizen Charter",
  description: "Service standards and commitments of the Provincial Government of Zamboanga Sibugay",
};

export default function CitizenCharterPage() {
  return (
    <CitizenPage
      title={CITIZEN_CHARTER.title}
      subtitle={CITIZEN_CHARTER.subtitle}
      maxWidth="3xl"
    >
      <TransparencyDocumentView document={CITIZEN_CHARTER} />
    </CitizenPage>
  );
}
