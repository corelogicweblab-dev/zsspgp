/** Provincial portal navigation — ZSSPGP public menu structure. */

export type NavChild = { label: string; href: string; description?: string };

export type NavItem = {
  title: string;
  shortTitle?: string;
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

/** Single source of truth for public routes (footer, nav, AI, search). */
export const SITE_ROUTES = {
  home: "/",
  about: "/#about",
  modules: "/#modules",
  contact: "/#contact",
  capitolMap: "/#capitol-map",
  news: "/news",
  announcements: "/announcements",
  announcementsHiring: "/announcements?category=hiring",
  announcementsEmergency: "/announcements?category=emergency",
  knowYourGovernor: "/know-your-governor",
  complaints: "/complaints",
  dashboard: "/dashboard",
  login: "/login",
  register: "/register",
  executiveOrders: "/executive-orders",
  jobApplications: "/services/job-applications",
  publicBroadcasts: "/services/public-broadcasts",
  emergencyAlerts: "/services/emergency-alerts",
  tourismProjects: "/services/tourism-projects",
  dataPrivacy: "/transparency/data-privacy",
  citizenCharter: "/transparency/citizen-charter",
  openGovernance: "/transparency/open-governance",
} as const;

const ALL_NAV_ITEMS: NavItem[] = [
  {
    title: "Our Province",
    shortTitle: "Province",
    link: SITE_ROUTES.home,
    hasDropdown: true,
    children: [
      { label: "Home", href: SITE_ROUTES.home, description: "ZSSPGP landing page" },
      { label: "About Zamboanga Sibugay", href: SITE_ROUTES.about, description: "Province overview" },
      { label: "Platform Modules", href: SITE_ROUTES.modules, description: "Integrated governance modules" },
      { label: "Contact Us", href: SITE_ROUTES.contact, description: "Capitol address, hotline, email" },
    ],
  },
  {
    title: "Leadership",
    link: SITE_ROUTES.knowYourGovernor,
    hasDropdown: true,
    children: [
      { label: "Know Your Governor", href: SITE_ROUTES.knowYourGovernor, description: "Governor Ann K. Hofer" },
      { label: "Executive Priorities", href: `${SITE_ROUTES.knowYourGovernor}#priorities` },
      { label: "Governor Dashboard", href: "/admin/governor", description: "Authorized executives only" },
      { label: "Executive Login", href: "/governor/executive-access", description: "Restricted access" },
    ],
  },
  {
    title: "Public Assistance",
    shortTitle: "Assistance",
    link: SITE_ROUTES.complaints,
    hasDropdown: true,
    children: [
      { label: "File a Complaint", href: SITE_ROUTES.complaints },
      { label: "Track Your Request", href: SITE_ROUTES.complaints },
      { label: "Citizen Dashboard", href: SITE_ROUTES.dashboard },
      { label: "Create Account", href: SITE_ROUTES.register },
      { label: "Sign In", href: SITE_ROUTES.login },
    ],
  },
  {
    title: "Provincial Updates",
    shortTitle: "Updates",
    link: SITE_ROUTES.news,
    hasDropdown: true,
    children: [
      { label: "Headlines & News", href: SITE_ROUTES.news },
      { label: "Announcements & Hiring", href: SITE_ROUTES.announcements },
      { label: "Public Broadcasts", href: SITE_ROUTES.publicBroadcasts, description: "Official advisories pushed to citizens" },
      { label: "Information Office", href: "/admin/news", description: "Authorized PIO staff" },
    ],
  },
  {
    title: "Emergency Alerts",
    shortTitle: "Alerts",
    link: SITE_ROUTES.emergencyAlerts,
    hasDropdown: false,
  },
  {
    title: "Safety & Resilience",
    shortTitle: "DRRM",
    link: "/admin/incidents",
    hasDropdown: true,
    children: [
      {
        label: "DRRM Command Center",
        href: "/admin/department/drrm",
        description: "Live map, incidents, and command overview",
      },
      { label: "Incident Reports", href: "/admin/incidents" },
    ],
  },
  {
    title: "Open Governance",
    shortTitle: "Governance",
    link: SITE_ROUTES.openGovernance,
    hasDropdown: true,
    children: [
      { label: "Open Governance Hub", href: SITE_ROUTES.openGovernance, description: "Transparency portal" },
      { label: "Data Privacy Notice", href: SITE_ROUTES.dataPrivacy },
      { label: "Citizen Charter", href: SITE_ROUTES.citizenCharter },
      { label: "Provincial News", href: SITE_ROUTES.news },
      { label: "Announcements", href: SITE_ROUTES.announcements },
      { label: "Executive Orders", href: SITE_ROUTES.executiveOrders },
      { label: "Complaint Tracking", href: SITE_ROUTES.complaints },
    ],
  },
  {
    title: "Provincial Programs",
    shortTitle: "Programs",
    link: SITE_ROUTES.tourismProjects,
    hasDropdown: true,
    children: [
      { label: "Tourism & Projects", href: SITE_ROUTES.tourismProjects, description: "Tourism and development programs" },
      { label: "Job Applications", href: SITE_ROUTES.jobApplications, description: "Provincial hiring portal" },
      { label: "Projects & Modules", href: SITE_ROUTES.modules, description: "Integrated governance modules" },
      { label: "Tourism Office", href: "/admin/department/tourism", description: "Attractions and events" },
      { label: "Agriculture", href: "/admin/department/agriculture", description: "Farming and fisheries programs" },
      {
        label: "Community Voices",
        href: SITE_ROUTES.complaints,
        description: "Feedback, surveys, participatory governance",
      },
    ],
  },
];

export const PROVINCIAL_NAV_PRIMARY: NavItem[] = ALL_NAV_ITEMS.filter((i) =>
  ["Our Province", "Leadership", "Public Assistance", "Provincial Updates", "Emergency Alerts"].includes(
    i.title
  )
);

export const PROVINCIAL_NAV_MORE: NavItem[] = ALL_NAV_ITEMS.filter(
  (i) => !PROVINCIAL_NAV_PRIMARY.some((p) => p.title === i.title)
);

export const PROVINCIAL_NAV_ITEMS: NavItem[] = ALL_NAV_ITEMS;

export const SITE_MEGA_NAV: NavGroup[] = PROVINCIAL_NAV_ITEMS.map((item) => ({
  label: item.title,
  href: item.hasDropdown ? undefined : item.link,
  children: item.hasDropdown ? item.children : undefined,
}));

export const FOOTER_QUICK_LINKS: NavChild[] = [
  { label: "Home", href: SITE_ROUTES.home },
  { label: "Public Assistance", href: SITE_ROUTES.complaints },
  { label: "Provincial Updates", href: SITE_ROUTES.news },
  { label: "Leadership", href: SITE_ROUTES.knowYourGovernor },
  { label: "Emergency Alerts", href: SITE_ROUTES.emergencyAlerts },
  { label: "Login", href: SITE_ROUTES.login },
  { label: "Register", href: SITE_ROUTES.register },
  { label: "Contact", href: SITE_ROUTES.contact },
];

export const FOOTER_CITIZEN_SERVICES: NavChild[] = [
  {
    label: "Job Applications",
    href: SITE_ROUTES.jobApplications,
    description: "Provincial hiring and plantilla vacancies",
  },
  {
    label: "Public Broadcasts",
    href: SITE_ROUTES.publicBroadcasts,
    description: "Official alerts and public advisories",
  },
  {
    label: "Emergency Alerts",
    href: SITE_ROUTES.emergencyAlerts,
    description: "DRRM and emergency notifications",
  },
  {
    label: "Tourism & Projects",
    href: SITE_ROUTES.tourismProjects,
    description: "Tourism, agriculture, and provincial programs",
  },
];

export const FOOTER_TRANSPARENCY_LINKS: NavChild[] = [
  {
    label: "Data Privacy Notice",
    href: SITE_ROUTES.dataPrivacy,
    description: "How we handle your personal data",
  },
  {
    label: "Citizen Charter",
    href: SITE_ROUTES.citizenCharter,
    description: "Service standards and commitments",
  },
  {
    label: "Open Governance",
    href: SITE_ROUTES.openGovernance,
    description: "Transparency hub and public information",
  },
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

/** Extra pages for site search (footer services + transparency). */
export const STATIC_SITE_PAGES: NavChild[] = [
  ...FOOTER_CITIZEN_SERVICES,
  ...FOOTER_TRANSPARENCY_LINKS,
  { label: "Executive Orders", href: SITE_ROUTES.executiveOrders, description: "Signed provincial executive orders" },
  { label: "Announcements", href: SITE_ROUTES.announcements, description: "Official PIO announcements" },
];

export const OFFICE_HOURS = {
  weekdays: "Monday to Friday",
  weekdayTime: "8:00 AM to 5:00 PM",
  weekend: "Saturday and Sunday",
  weekendStatus: "CLOSED",
} as const;

export function navDisplayTitle(item: NavItem): string {
  return item.shortTitle ?? item.title;
}
