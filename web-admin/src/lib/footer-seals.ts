import { LOGO_PATH } from "@/lib/constants";

export type FooterOfficialSeal = {
  id: string;
  label: string;
  href: string;
  src: string;
};

/** Official seals row — matches standard provincial transparency footer layout. */
export const FOOTER_OFFICIAL_SEALS: FooterOfficialSeal[] = [
  {
    id: "zamboanga-sibugay",
    label: "Province of Zamboanga Sibugay",
    href: "https://www.zamboangasibugay.gov.ph",
    src: LOGO_PATH,
  },
  {
    id: "bagong-pilipinas",
    label: "Bagong Pilipinas",
    href: "https://www.gov.ph",
    src: "/seals/bagong-pilipinas.svg",
  },
  {
    id: "transparency",
    label: "Transparency Seal",
    href: "https://www.gov.ph/transparency",
    src: "/seals/transparency-seal.svg",
  },
  {
    id: "foi",
    label: "Freedom of Information — Philippines",
    href: "https://www.foi.gov.ph",
    src: "/seals/foi-philippines.svg",
  },
  {
    id: "pco",
    label: "Presidential Communications Office",
    href: "https://pco.gov.ph",
    src: "/seals/pco-philippines.svg",
  },
];

export const FOOTER_COAT_WATERMARK = "/seals/ph-coat-watermark.svg";
