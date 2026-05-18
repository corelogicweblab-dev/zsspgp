"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, Megaphone } from "lucide-react";
import { ANNOUNCEMENT_CATEGORIES, getCategoryLabel } from "@/lib/announcement-categories";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Announcement, AnnouncementCategory } from "@/types";

type FilterValue = "all" | AnnouncementCategory;

export function AnnouncementsPublicList({
  announcements,
  initialFilter = "all",
}: {
  announcements: Announcement[];
  initialFilter?: FilterValue;
}) {
  const [filter, setFilter] = useState<FilterValue>(initialFilter);

  const filtered = useMemo(() => {
    if (filter === "all") return announcements;
    return announcements.filter((a) => a.category === filter);
  }, [announcements, filter]);

  const hiringCount = announcements.filter((a) => a.category === "hiring").length;

  return (
    <div className="space-y-6">
      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
        role="tablist"
        aria-label="Filter announcements"
      >
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" />
        {hiringCount > 0 && (
          <FilterChip
            active={filter === "hiring"}
            onClick={() => setFilter("hiring")}
            label={`Hiring (${hiringCount})`}
            highlight
          />
        )}
        {ANNOUNCEMENT_CATEGORIES.filter((c) => c.value !== "general" && c.value !== "hiring").map(
          (c) => {
            const count = announcements.filter((a) => a.category === c.value).length;
            if (!count) return null;
            return (
              <FilterChip
                key={c.value}
                active={filter === c.value}
                onClick={() => setFilter(c.value)}
                label={c.label}
              />
            );
          }
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
          No announcements in this category yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((item) => (
            <li key={item.id}>
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                        item.category === "hiring"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-600"
                      )}
                    >
                      {item.category === "hiring" ? (
                        <Briefcase className="h-5 w-5" />
                      ) : (
                        <Megaphone className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
                      {item.published_at && (
                        <p className="mt-1 text-xs text-slate-500">
                          Published {formatDate(item.published_at)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={item.category === "hiring" ? "warning" : "default"}
                    className="w-fit shrink-0"
                  >
                    {getCategoryLabel(item.category)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div
                    className="prose prose-sm max-w-none text-slate-600"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                  {item.link_url && (
                    <Link
                      href={item.link_url}
                      className="inline-flex text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {item.category === "hiring"
                        ? "View application details →"
                        : "More information →"}
                    </Link>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  highlight,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-blue-600 bg-blue-600 text-white"
          : highlight
            ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      )}
    >
      {label}
    </button>
  );
}
