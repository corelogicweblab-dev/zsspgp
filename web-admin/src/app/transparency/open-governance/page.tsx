import { CitizenPage } from "@/components/layout/citizen-page";
import { OpenGovernanceHub } from "@/components/transparency/open-governance-hub";
import { OPEN_GOVERNANCE_INTRO } from "@/lib/transparency-content";

export const metadata = {
  title: "Open Governance",
  description: "Transparency, participation, and accountability for Zamboanga Sibugay",
};

export default function OpenGovernancePage() {
  return (
    <CitizenPage
      title={OPEN_GOVERNANCE_INTRO.title}
      subtitle={OPEN_GOVERNANCE_INTRO.subtitle}
      maxWidth="5xl"
    >
      <OpenGovernanceHub />
    </CitizenPage>
  );
}
