import type { ComplaintCategory } from "@/types";
import type { DepartmentPortal } from "@/lib/department-portals";
import { SITE_ROUTES } from "@/lib/site-navigation";

export type DepartmentQuickAction = {
  label: string;
  href: string;
  description: string;
};

export type DepartmentDashboardConfig = {
  slug: DepartmentPortal["slug"];
  focus: string;
  /** Complaint categories this office typically handles (empty = show all). */
  complaintCategories: ComplaintCategory[];
  quickActions: DepartmentQuickAction[];
  /** Admin routes this department role may open (plus /admin/department/[slug]). */
  allowedAdminPaths: string[];
};

const CONFIG: Record<DepartmentPortal["slug"], DepartmentDashboardConfig> = {
  drrm: {
    slug: "drrm",
    focus: "Live incident command, DRRM map, and emergency response workflows.",
    complaintCategories: ["flooding", "roads", "water"],
    quickActions: [
      { label: "Live ops map", href: "/admin/department/drrm", description: "Super dashboard with incident map" },
      { label: "All incidents", href: "/admin/incidents", description: "Province-wide incident log" },
      { label: "Emergency alerts", href: SITE_ROUTES.emergencyAlerts, description: "Public emergency announcements" },
    ],
    allowedAdminPaths: ["/admin/incidents", "/admin/complaints", "/admin/notifications", SITE_ROUTES.emergencyAlerts],
  },
  tourism: {
    slug: "tourism",
    focus: "Tourism promotions, attractions, events, and visitor assistance.",
    complaintCategories: ["others"],
    quickActions: [
      { label: "Tourism & projects", href: SITE_ROUTES.tourismProjects, description: "Public tourism and development page" },
      { label: "Office complaints", href: "/admin/complaints?dept=tourism", description: "Citizen requests for tourism" },
      { label: "Broadcasts", href: SITE_ROUTES.publicBroadcasts, description: "Provincial broadcasts" },
    ],
    allowedAdminPaths: [
      "/admin/complaints",
      "/admin/notifications",
      SITE_ROUTES.tourismProjects,
      SITE_ROUTES.publicBroadcasts,
    ],
  },
  health: {
    slug: "health",
    focus: "Public health services, clinics, and health-related citizen reports.",
    complaintCategories: ["health", "water"],
    quickActions: [
      { label: "Health complaints", href: "/admin/complaints?dept=health", description: "Medical and sanitation reports" },
      { label: "Emergency alerts", href: SITE_ROUTES.emergencyAlerts, description: "Health advisories and warnings" },
      { label: "Notifications", href: "/admin/notifications", description: "Send office updates" },
    ],
    allowedAdminPaths: ["/admin/complaints", "/admin/notifications", SITE_ROUTES.emergencyAlerts],
  },
  agriculture: {
    slug: "agriculture",
    focus: "Farming, fisheries, livestock, and rural development programs.",
    complaintCategories: ["water", "garbage", "others"],
    quickActions: [
      { label: "Agri programs", href: SITE_ROUTES.tourismProjects, description: "Agriculture & fisheries highlights" },
      { label: "Field complaints", href: "/admin/complaints?dept=agriculture", description: "Reports from farmers and barangays" },
      { label: "Job applications", href: SITE_ROUTES.jobApplications, description: "Provincial hiring — agri posts" },
    ],
    allowedAdminPaths: [
      "/admin/complaints",
      "/admin/notifications",
      SITE_ROUTES.tourismProjects,
      SITE_ROUTES.jobApplications,
    ],
  },
  ict: {
    slug: "ict",
    focus: "Platform administration, user accounts, and provincial ICT operations.",
    complaintCategories: [],
    quickActions: [
      { label: "User accounts", href: "/admin/users", description: "Manage provincial staff and roles" },
      { label: "System settings", href: "/admin/settings", description: "Platform configuration" },
      { label: "All complaints", href: "/admin/complaints", description: "Escalated technical tickets" },
      { label: "Notifications", href: "/admin/notifications", description: "System and office broadcasts" },
    ],
    allowedAdminPaths: ["/admin/users", "/admin/settings", "/admin/complaints", "/admin/notifications"],
  },
  information: {
    slug: "information",
    focus: "Official news, announcements, homepage carousel, and executive orders.",
    complaintCategories: [],
    quickActions: [
      { label: "News & PIO desk", href: "/admin/news", description: "Publish headlines and media" },
      { label: "Complaints", href: "/admin/complaints", description: "Information office queue" },
      { label: "Notifications", href: "/admin/notifications", description: "Provincial broadcasts" },
    ],
    allowedAdminPaths: ["/admin/news", "/admin/complaints", "/admin/notifications", "/admin/incidents"],
  },
};

export function getDepartmentDashboardConfig(
  slug: DepartmentPortal["slug"]
): DepartmentDashboardConfig {
  return CONFIG[slug];
}

/** Admin path prefixes allowed for a department portal account. */
export function getDepartmentAllowedAdminPaths(
  slug: DepartmentPortal["slug"] | null | undefined
): string[] {
  if (!slug || !(slug in CONFIG)) return ["/admin/complaints", "/admin/notifications"];
  const own = `/admin/department/${slug}`;
  return [own, ...CONFIG[slug as DepartmentPortal["slug"]].allowedAdminPaths];
}

export function filterComplaintsForDepartment<T extends { category: ComplaintCategory }>(
  rows: T[],
  categories: ComplaintCategory[]
): T[] {
  if (!categories.length) return rows;
  return rows.filter((r) => categories.includes(r.category));
}

export function getDepartmentComplaintCategories(
  slug: string | null | undefined
): ComplaintCategory[] | null {
  if (!slug || !(slug in CONFIG)) return null;
  return CONFIG[slug as DepartmentPortal["slug"]].complaintCategories;
}
