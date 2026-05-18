/** Announcement banner helpers — IO-authored content, public read. */

export const ANNOUNCEMENT_BANNER_ICON = "📢";
export const DISMISSED_ANNOUNCEMENTS_KEY = "zsspgp-dismissed-announcements";

export type BannerAnnouncement = {
  id: string;
  title: string;
  message: string;
  category?: string;
};

export function isInformationOfficeAdmin(
  role: string,
  departmentCode?: string | null
): boolean {
  if (role === "information_office") return true;
  return role === "department_admin" && departmentCode?.toUpperCase() === "INFO";
}

/** Whether the viewer may create or edit announcements (PIO / INFO dept admin). */
export function canManageInfoAnnouncements(
  role: string,
  departmentCode?: string | null
): boolean {
  return isInformationOfficeAdmin(role, departmentCode);
}

/**
 * Whether the banner should render.
 * Public: when there is a message and announcements from Information Office exist.
 * The role parameter gates admin-only preview chrome, not citizen visibility.
 */
export function shouldRenderAnnouncementBanner(
  message: string,
  role: string,
  departmentCode?: string | null,
  hasPublishedItems = true
): boolean {
  if (!message.trim() || !hasPublishedItems) return false;
  return true;
}

export function loadDismissedAnnouncementIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DISMISSED_ANNOUNCEMENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function persistDismissedAnnouncementIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DISMISSED_ANNOUNCEMENTS_KEY, JSON.stringify(ids));
}

/** Hide a single announcement in the rotating banner. */
export function dismissBanner(id: string, dismissedIds: string[]): string[] {
  if (dismissedIds.includes(id)) return dismissedIds;
  const next = [...dismissedIds, id];
  persistDismissedAnnouncementIds(next);
  return next;
}

/** Advance carousel index for multiple announcement messages. */
export function cycleAnnouncements(
  messages: string[],
  currentIndex: number,
  direction: "next" | "prev" = "next"
): number {
  if (!messages.length) return 0;
  if (direction === "next") return (currentIndex + 1) % messages.length;
  return (currentIndex - 1 + messages.length) % messages.length;
}

/** Citizens (and all viewers) go to the announcements page when the banner is clicked. */
export function handleBannerClick(
  role: string,
  navigate: (path: string) => void,
  path = "/announcements"
): void {
  void role;
  navigate(path);
}

export function filterVisibleAnnouncements(
  items: BannerAnnouncement[],
  dismissedIds: string[]
): BannerAnnouncement[] {
  return items.filter((a) => !dismissedIds.includes(a.id));
}

export function toBannerMessages(items: BannerAnnouncement[]): string[] {
  return items.map((a) => a.message.trim() || a.title);
}
