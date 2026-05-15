import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function formatRelative(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function capitalize(str: string) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getRoleDashboardPath(role: string): string {
  switch (role) {
    case "governor_super_admin":
      return "/admin/governor";
    case "ict_admin":
      return "/admin/users";
    case "information_office":
      return "/admin/news";
    case "department_admin":
    case "staff":
      return "/admin/department";
    case "citizen":
    default:
      return "/dashboard";
  }
}
