import { CitizenPage } from "@/components/layout/citizen-page";
import { TransparencyDocumentView } from "@/components/transparency/transparency-document";
import { DATA_PRIVACY_NOTICE } from "@/lib/transparency-content";

export const metadata = {
  title: "Data Privacy Notice",
  description: "How ZSSPGP collects, uses, and protects personal information",
};

export default function DataPrivacyPage() {
  return (
    <CitizenPage
      title={DATA_PRIVACY_NOTICE.title}
      subtitle={DATA_PRIVACY_NOTICE.subtitle}
      maxWidth="3xl"
    >
      <TransparencyDocumentView document={DATA_PRIVACY_NOTICE} />
    </CitizenPage>
  );
}
