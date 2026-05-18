/** Provincial portal navigation — aligned with ZSSPGP routes (reference-style mega menu + footer). */

export type NavChild = { label: string; href: string; description?: string };

export type NavGroup = {
  label: string;
  href?: string;
  children?: NavChild[];
};

export const SITE_MEGA_NAV: NavGroup[] = [
  {
    label: "About",
    children: [
      { label: "Home", href: "/", description: "ZSSPGP landing page" },
      { label: "Know Your Governor", href: "/know-your-governor", description: "Governor Ann Hofer" },
      { label: "Platform Modules", href: "/#modules", description: "Integrated governance modules" },
      { label: "Contact Us", href: "/#contact", description: "Capitol address, hotline, email" },
    ],
  },
  {
    label: "Governor's Office",
    children: [
      { label: "Know Your Governor", href: "/know-your-governor" },
      { label: "Governor Dashboard", href: "/admin/governor", description: "Authorized executives only" },
      { label: "Executive Login", href: "/governor/executive-access", description: "Restricted access" },
    ],
  },
  {
    label: "Services",
    children: [
      { label: "File a Complaint", href: "/complaints" },
      { label: "Citizen Dashboard", href: "/dashboard" },
      { label: "Create Account", href: "/register" },
      { label: "Official Login", href: "/login" },
    ],
  },
  {
    label: "DRRM",
    children: [
      {
        label: "DRRM Super Dashboard Ops",
        href: "/admin/department/drrm",
        description: "Live map, incidents, and command overview",
      },
      { label: "Incident Reports", href: "/admin/incidents" },
      { label: "Department Portal (DRRM)", href: "/admin/department/drrm" },
    ],
  },
  {
    label: "News",
    href: "/news",
  },
  {
    label: "Transparency",
    children: [
      { label: "Announcements", href: "/announcements" },
      { label: "Provincial News", href: "/news" },
      { label: "Complaint Tracking", href: "/complaints" },
    ],
  },
];

export const FOOTER_QUICK_LINKS: NavChild[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/complaints" },
  { label: "Departments", href: "/admin/department" },
  { label: "News", href: "/news" },
  { label: "Governor", href: "/know-your-governor" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
  { label: "Contact", href: "/#contact" },
];

export const FOOTER_GOV_LINKS: { label: string; href: string; color?: "cyan" | "amber" | "white" }[] = [
  { label: "eGOV PH", href: "https://www.gov.ph", color: "cyan" },
  { label: "DICT", href: "https://dict.gov.ph", color: "cyan" },
  { label: "PNP", href: "https://pnp.gov.ph", color: "cyan" },
  { label: "PhilGEPS", href: "https://www.philgeps.gov.ph", color: "cyan" },
  { label: "BIR", href: "https://www.bir.gov.ph", color: "amber" },
  { label: "NBI", href: "https://nbi.gov.ph", color: "amber" },
  { label: "COA", href: "https://www.coa.gov.ph", color: "white" },
  { label: "DBM", href: "https://www.dbm.gov.ph", color: "white" },
];

export const OFFICE_HOURS = {
  weekdays: "Monday to Friday",
  weekdayTime: "8:00 AM to 5:00 PM",
  weekend: "Saturday and Sunday",
  weekendStatus: "CLOSED",
} as const;
