import { LOGO_PATH } from "@/lib/constants";

export type FooterOfficialSeal = {
  id: string;
  label: string;
  shortLabel: string;
  href: string;
  src: string;
};

/** Official seals — provincial transparency footer (PNG assets in /public). */
export const FOOTER_OFFICIAL_SEALS: FooterOfficialSeal[] = [
  {
    id: "zamboanga-sibugay",
    label: "Province of Zamboanga Sibugay Seal",
    shortLabel: "Zamboanga Sibugay",
    href: "https://www.zamboangasibugay.gov.ph",
    src: LOGO_PATH,
  },
  {
    id: "dilg",
    label: "Department of the Interior and Local Government",
    shortLabel: "DILG",
    href: "https://www.dilg.gov.ph",
    src: "/dilg.png",
  },
  {
    id: "foi",
    label: "Freedom of Information — Philippines",
    shortLabel: "FOI PH",
    href: "https://www.foi.gov.ph",
    src: "/foi.png",
  },
  {
    id: "transparency",
    label: "Philippines Transparency Seal",
    shortLabel: "PH Transparency",
    href: "https://www.gov.ph/transparency",
    src: "/phtransparencyseal.png",
  },
];
