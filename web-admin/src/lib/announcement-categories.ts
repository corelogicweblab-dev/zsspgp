import type { AnnouncementCategory } from "@/types";

export const ANNOUNCEMENT_CATEGORIES: {
  value: AnnouncementCategory;
  label: string;
  description: string;
  bannerIcon: string;
}[] = [
  {
    value: "general",
    label: "General",
    description: "Official provincial notices",
    bannerIcon: "📢",
  },
  {
    value: "hiring",
    label: "Hiring / Jobs",
    description: "Vacancies, job fairs, and HR advisories",
    bannerIcon: "💼",
  },
  {
    value: "advisory",
    label: "Public Advisory",
    description: "Reminders and citizen advisories",
    bannerIcon: "📋",
  },
  {
    value: "event",
    label: "Events",
    description: "Programs, activities, and schedules",
    bannerIcon: "📅",
  },
  {
    value: "emergency",
    label: "Emergency",
    description: "Urgent alerts and warnings",
    bannerIcon: "🚨",
  },
  {
    value: "procurement",
    label: "Procurement / Bids",
    description: "BAC notices and bidding",
    bannerIcon: "📄",
  },
  {
    value: "holiday",
    label: "Holidays / Suspension",
    description: "Work suspensions and holiday schedules",
    bannerIcon: "🏛️",
  },
];

export function getCategoryMeta(category: string | null | undefined) {
  const found = ANNOUNCEMENT_CATEGORIES.find((c) => c.value === category);
  return found ?? ANNOUNCEMENT_CATEGORIES[0];
}

export function getCategoryBannerIcon(category: string | null | undefined): string {
  return getCategoryMeta(category).bannerIcon;
}

export function getCategoryLabel(category: string | null | undefined): string {
  return getCategoryMeta(category).label;
}
