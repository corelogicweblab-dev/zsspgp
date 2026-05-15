export type UserRole =
  | "governor_super_admin"
  | "ict_admin"
  | "department_admin"
  | "information_office"
  | "staff"
  | "citizen";

export type ComplaintStatus = "pending" | "under_review" | "resolved";
export type ComplaintCategory =
  | "roads"
  | "flooding"
  | "health"
  | "garbage"
  | "water"
  | "electricity"
  | "others";

export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentCategory =
  | "flood"
  | "fire"
  | "landslide"
  | "accident"
  | "rescue";
export type IncidentStatus =
  | "reported"
  | "active"
  | "responding"
  | "resolved"
  | "closed";

export type NotificationType =
  | "info"
  | "alert"
  | "announcement"
  | "complaint_update"
  | "incident_update"
  | "system";

export interface Department {
  id: string;
  code: string;
  name: string;
  description: string | null;
  head_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department_id: string | null;
  phone: string | null;
  municipality: string | null;
  barangay: string | null;
  purok_or_street: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  department?: Department;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  cover_image_url: string | null;
  author_id: string | null;
  department_id: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  reference_number: string;
  user_id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  municipality: string;
  barangay: string | null;
  purok_or_street: string | null;
  image_url: string | null;
  assigned_department_id: string | null;
  admin_response: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
}

export interface Incident {
  id: string;
  reference_number: string;
  reported_by: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  municipality: string;
  barangay: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  is_emergency: boolean;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  is_broadcast: boolean;
  link_url: string | null;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
  user?: UserProfile;
}

export interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  activeIncidents: number;
  criticalIncidents: number;
  totalUsers: number;
  departmentCount: number;
  resolvedToday: number;
  notificationsUnread: number;
}
