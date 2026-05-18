/** Provincial portal navigation — ZSSPGP public menu structure. */

export type NavChild = { label: string; href: string; description?: string };

export type NavItem = {
  title: string;
  link: string;
  hasDropdown: boolean;
  children?: NavChild[];
};

/** @deprecated Use NavItem — kept for footer / legacy imports */
export type NavGroup = {
  label: string;
  href?: string;
  children?: NavChild[];
};

export const PROVINCIAL_NAV_ITEMS: NavItem[] = [
  {
    title: "Our Province",
    link: "/",
    hasDropdown: true,
    children: [
      { label: "Home", href: "/", description: "ZSSPGP landing page" },
      { label: "About Zamboanga Sibugay", href: "/#about", description: "Province overview" },
      { label: "Platform Modules", href: "/#modules", description: "Integrated governance modules" },
      { label: "Contact Us", href: "/#contact", description: "Capitol address, hotline, email" },
    ],
  },
  {
    title: "Leadership",
    link: "/know-your-governor",
    hasDropdown: true,
    children: [
      { label: "Know Your Governor", href: "/know-your-governor", description: "Governor Ann K. Hofer" },
      { label: "Executive Priorities", href: "/know-your-governor#priorities" },
      { label: "Governor Dashboard", href: "/admin/governor", description: "Authorized executives only" },
      { label: "Executive Login", href: "/governor/executive-access", description: "Restricted access" },
    ],
  },
  {
    title: "Public Assistance",
    link: "/complaints",
    hasDropdown: true,
    children: [
      { label: "File a Complaint", href: "/complaints" },
      { label: "Track Your Request", href: "/complaints" },
      { label: "Citizen Dashboard", href: "/dashboard" },
      { label: "Create Account", href: "/register" },
      { label: "Official Login", href: "/login" },
    ],
  },
  {
    title: "Safety & Resilience",
    link: "/admin/incidents",
    hasDropdown: true,
    children: [
      {
        label: "DRRM Command Center",
        href: "/admin/department/drrm",
        description: "Live map, incidents, and command overview",
      },
      { label: "Incident Reports", href: "/admin/incidents" },
      { label: "Emergency Alerts", href: "/announcements", description: "Advisories and warnings" },
    ],
  },
  {
    title: "Provincial Updates",
    link: "/news",
    hasDropdown: true,
    children: [
      { label: "Headlines & News", href: "/news" },
      { label: "Announcements", href: "/announcements" },
      { label: "Information Office", href: "/admin/news", description: "Authorized PIO staff" },
    ],
  },
  {
    title: "Open Governance",
    link: "/announcements",
    hasDropdown: true,
    children: [
      { label: "Transparency Hub", href: "/announcements" },
      { label: "Provincial News", href: "/news" },
      { label: "Complaint Tracking", href: "/complaints" },
      { label: "Department Portals", href: "/admin/department" },
    ],
  },
  {
    title: "Projects",
    link: "/#modules",
    hasDropdown: true,
    children: [
      { label: "Ongoing Projects", href: "/#modules", description: "Infrastructure and development" },
      { label: "Completed Projects", href: "/announcements", description: "Milestones and turnover" },
      { label: "Platform Modules", href: "/#modules" },
    ],
  },
  {
    title: "Tourism",
    link: "/admin/department/tourism",
    hasDropdown: true,
    children: [
      { label: "Local Attractions", href: "/admin/department/tourism" },
      { label: "Events & Festivals", href: "/announcements" },
      { label: "Tourism Office Portal", href: "/admin/department/tourism" },
    ],
  },
  {
    title: "Agriculture",
    link: "/admin/department/agriculture",
    hasDropdown: true,
    children: [
      { label: "Farming Programs", href: "/admin/department/agriculture" },
      { label: "Fisheries Support", href: "/admin/department/agriculture" },
      { label: "Agriculture Office Portal", href: "/admin/department/agriculture" },
    ],
  },
  {
    title: "Community Voices",
    link: "/complaints",
    hasDropdown: true,
    children: [
      { label: "Citizen Feedback", href: "/complaints" },
      { label: "Surveys & Participation", href: "/dashboard" },
      { label: "Register to Participate", href: "/register" },
    ],
  },
  {
    title: "Emergency Alerts",
    link: "/announcements",
    hasDropdown: false,
  },
];

export const SITE_MEGA_NAV: NavGroup[] = PROVINCIAL_NAV_ITEMS.map((item) => ({
  label: item.title,
  href: item.hasDropdown ? undefined : item.link,
  children: item.hasDropdown ? item.children : undefined,
}));

export const FOOTER_QUICK_LINKS: NavChild[] = [
  { label: "Home", href: "/" },
  { label: "Public Assistance", href: "/complaints" },
  { label: "Provincial Updates", href: "/news" },
  { label: "Leadership", href: "/know-your-governor" },
  { label: "Emergency Alerts", href: "/announcements" },
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
