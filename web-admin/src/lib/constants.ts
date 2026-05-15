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
] as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  governor_super_admin: "Governor Super Admin",
  ict_admin: "ICT Admin",
  department_admin: "Department Admin",
  staff: "Staff",
  citizen: "Citizen",
};

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
  { value: "pending", label: "Pending", color: "bg-amber-100 text-amber-800" },
  { value: "under_review", label: "Under Review", color: "bg-blue-100 text-blue-800" },
  { value: "resolved", label: "Resolved", color: "bg-emerald-100 text-emerald-800" },
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
  { value: "low", label: "Low", color: "bg-slate-100 text-slate-700" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
];

export const ADMIN_ROLES: UserRole[] = [
  "governor_super_admin",
  "ict_admin",
  "department_admin",
  "staff",
];

export const GOVERNOR_ROLES: UserRole[] = ["governor_super_admin"];
export const ICT_ROLES: UserRole[] = ["ict_admin", "governor_super_admin"];
