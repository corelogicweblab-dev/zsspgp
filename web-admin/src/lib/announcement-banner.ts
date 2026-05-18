/** Announcement banner helpers — IO-authored content, public read. */

export const ANNOUNCEMENT_BANNER_ICON = "📢";

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

/** Whether the banner should render when published announcements exist. */
export function shouldRenderAnnouncementBanner(
  message: string,
  _role: string,
  _departmentCode?: string | null,
  hasPublishedItems = true
): boolean {
  return Boolean(message.trim() && hasPublishedItems);
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

export function toBannerMessages(items: BannerAnnouncement[]): string[] {
  return items.map((a) => a.message.trim() || a.title);
}
