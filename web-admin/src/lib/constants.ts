import type {
  ComplaintCategory,
  ComplaintStatus,
  IncidentCategory,
  IncidentSeverity,
  UserRole,
} from "@/types";

export const APP_NAME = "Zamboanga Sibugay Smart Provincial Governance Platform";
export const APP_SHORT = "ZSSPGP";
export const LOGO_PATH = "/zamboangasibugaylogo.png";
export const FOOTER_TEXT = "2026 Province of Zamboanga Sibugay";
export const POWERED_BY = "CoreLogic";

export const MUNICIPALITIES = [
  "Alicia",
  "Buug",
  "Diplahan",
  "Imelda",
  "Ipil",
  "Kabasalan",
  "Mabuhay",
  "Malangas",
  "Naga",
  "Olutanga",
  "Payao",
  "Roseller Lim",
  "Siay",
  "Talusan",
  "Titay",
  "Tungawan",
] as const;

export const DEPARTMENTS = [
  { code: "DRRM", name: "Disaster Risk Reduction & Management", slug: "drrm" },
  { code: "TOURISM", name: "Tourism Office", slug: "tourism" },
  { code: "HEALTH", name: "Provincial Health Office", slug: "health" },
  { code: "AGRI", name: "Agriculture Office", slug: "agriculture" },
  { code: "ICT", name: "Information & Communications Technology", slug: "ict" },
  { code: "INFO", name: "Provincial Information Office", slug: "information" },
] as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  governor_super_admin: "Governor Super Admin",
  ict_admin: "ICT Admin",
  department_admin: "Department Admin",
  information_office: "Information Office",
  staff: "Department Staff",
  citizen: "Citizen",
};

/** Roles available during public self-registration */
export const SIGNUP_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: "citizen", label: "Citizen", description: "File complaints and access provincial services" },
  {
    value: "information_office",
    label: "Information Office",
    description: "Publish provincial news and public information",
  },
  {
    value: "staff",
    label: "Department Staff",
    description: "Submit reports and manage department records",
  },
  {
    value: "department_admin",
    label: "Department Administrator",
    description: "Manage department portal and operations",
  },
];

export const PLATFORM_MODULES = [
  {
    title: "Provincial Governor Dashboard",
    desc: "Executive command center with real-time provincial analytics.",
    href: "/admin/governor",
    menuLabel: "Governor Dashboard",
  },
  {
    title: "Department Portals",
    desc: "DRRM, Health, Tourism, Agriculture, ICT, and Information Office.",
    href: "/admin/department",
    menuLabel: "Department Portal",
  },
  {
    title: "Citizen Complaint System",
    desc: "Submit, track, and resolve citizen concerns province-wide.",
    href: "/complaints",
    menuLabel: "File Complaint",
  },
  {
    title: "DRRM Incident Reporting",
    desc: "Emergency incidents with severity levels and response workflows.",
    href: "/admin/incidents",
    menuLabel: "Incidents (DRRM)",
  },
  {
    title: "Notifications",
    desc: "In-app alerts, announcements, and broadcast communications.",
    href: "/admin/notifications",
    menuLabel: "Notifications",
  },
  {
    title: "Mobile App",
    desc: "Citizen access on iOS and Android via ZSSPGP mobile.",
    href: "/register",
    menuLabel: "Register",
  },
  {
    title: "Role-Based Access",
    desc: "Secure RBAC for officials, departments, and citizens.",
    href: "/admin/users",
    menuLabel: "User Management",
  },
  {
    title: "Realtime Dashboard",
    desc: "Live updates on complaints, incidents, and provincial activity.",
    href: "/admin/governor",
    menuLabel: "Governor Dashboard",
  },
  {
    title: "Scalable Enterprise Architecture",
    desc: "Modular, cloud-ready infrastructure for provincial scale.",
    href: "/admin/settings",
    menuLabel: "Settings",
  },
  {
    title: "Information Office",
    desc: "Official news publishing and public information management.",
    href: "/news",
    menuLabel: "News & Information",
  },
] as const;

export const COMPLAINT_CATEGORIES: { value: ComplaintCategory; label: string }[] = [
  { value: "roads", label: "Roads" },
  { value: "flooding", label: "Flooding" },
  { value: "health", label: "Health" },
  { value: "garbage", label: "Garbage" },
  { value: "water", label: "Water" },
  { value: "electricity", label: "Electricity" },
  { value: "others", label: "Others" },
];

export const COMPLAINT_STATUSES: { value: ComplaintStatus; label: string; color: string }[] = [
  { value: "pending", label: "Pending", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  { value: "under_review", label: "Under Review", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  { value: "resolved", label: "Resolved", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
];

export const INCIDENT_CATEGORIES: { value: IncidentCategory; label: string }[] = [
  { value: "flood", label: "Flood" },
  { value: "fire", label: "Fire" },
  { value: "landslide", label: "Landslide" },
  { value: "accident", label: "Accident" },
  { value: "rescue", label: "Rescue" },
];

export const INCIDENT_SEVERITIES: {
  value: IncidentSeverity;
  label: string;
  color: string;
}[] = [
  { value: "low", label: "Low", color: "bg-slate-500/20 text-slate-300 border-slate-500/40" },
  { value: "medium", label: "Medium", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40" },
  { value: "high", label: "High", color: "bg-orange-500/20 text-orange-300 border-orange-500/40" },
  { value: "critical", label: "Critical", color: "bg-red-500/20 text-red-300 border-red-500/40" },
];

export const ADMIN_ROLES: UserRole[] = [
  "governor_super_admin",
  "ict_admin",
  "department_admin",
  "staff",
];

export const GOVERNOR_ROLES: UserRole[] = ["governor_super_admin"];
export const ICT_ROLES: UserRole[] = ["ict_admin", "governor_super_admin"];
