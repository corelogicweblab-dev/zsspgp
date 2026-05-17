import type { Metadata } from "next";
import { GOVERNOR_PROFILE } from "@/lib/governor-profile";

export const metadata: Metadata = {
  title: `Know Your Governor | ${GOVERNOR_PROFILE.name}`,
  description: GOVERNOR_PROFILE.tagline,
};

export default function KnowYourGovernorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
