"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type BannerAnnouncement,
  canManageInfoAnnouncements,
  cycleAnnouncements,
  handleBannerClick,
  shouldRenderAnnouncementBanner,
  toBannerMessages,
} from "@/lib/announcement-banner";
import { getCategoryBannerIcon, getCategoryLabel } from "@/lib/announcement-categories";
import { cn } from "@/lib/utils";

export type AnnouncementBannerProps = {
  announcements: BannerAnnouncement[];
  viewerRole?: string;
  departmentCode?: string | null;
  className?: string;
};

export function renderAnnouncementBanner(
  message: string,
  icon: string,
  role: string,
  departmentCode?: string | null,
  options?: {
    category?: string;
    showAdminLink?: boolean;
  }
): ReactNode {
  if (!shouldRenderAnnouncementBanner(message, role, departmentCode)) {
    return null;
  }

  const isAdmin = canManageInfoAnnouncements(role, departmentCode);

  return (
    <div
      className="announcement-banner-inner min-w-0 flex-1"
      role="status"
      aria-live="polite"
    >
      <div className="flex min-w-0 items-start gap-2 sm:items-center sm:gap-3">
        <span className="announcement-banner-icon shrink-0 text-lg leading-none sm:text-xl" aria-hidden>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          {options?.category && (
            <span className="mb-0.5 inline-block rounded bg-amber-400/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-200 sm:text-[10px]">
              {getCategoryLabel(options.category)}
            </span>
          )}
          <p className="line-clamp-2 text-sm font-medium leading-snug text-amber-50 sm:line-clamp-1 sm:text-base">
            {message}
          </p>
        </div>
      </div>
      {isAdmin && options?.showAdminLink && (
        <Link
          href="/admin/news"
          className="mt-2 inline-block shrink-0 rounded-md border border-amber-200/30 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-100 hover:bg-white/10 sm:mt-0 sm:ml-2"
          onClick={(e) => e.stopPropagation()}
        >
          PIO Manage
        </Link>
      )}
    </div>
  );
}

export function AnnouncementBanner({
  announcements,
  viewerRole = "public",
  departmentCode = null,
  className,
}: AnnouncementBannerProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const visible = announcements;
  const messages = useMemo(() => toBannerMessages(visible), [visible]);
  const safeIndex = visible.length ? index % visible.length : 0;
  const current = visible[safeIndex];
  const currentMessage = current ? current.message.trim() || current.title : "";
  const currentIcon = getCategoryBannerIcon(current?.category);

  useEffect(() => {
    if (safeIndex >= visible.length && visible.length > 0) setIndex(0);
  }, [safeIndex, visible.length]);

  useEffect(() => {
    if (visible.length <= 1 || paused) return;
    const timer = window.setInterval(() => {
      setIndex((i) => cycleAnnouncements(messages, i, "next"));
    }, 6000);
    return () => window.clearInterval(timer);
  }, [visible.length, messages, paused]);

  const onBannerClick = useCallback(() => {
    const path =
      current?.category === "hiring"
        ? "/announcements?category=hiring"
        : "/announcements";
    handleBannerClick(viewerRole, (p) => router.push(p), path);
  }, [viewerRole, router, current?.category]);

  const onPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIndex((i) => cycleAnnouncements(messages, i, "prev"));
    },
    [messages]
  );

  const onNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIndex((i) => cycleAnnouncements(messages, i, "next"));
    },
    [messages]
  );

  if (!current || !shouldRenderAnnouncementBanner(currentMessage, viewerRole, departmentCode)) {
    return null;
  }

  const showControls = visible.length > 1;
  const isAdmin = canManageInfoAnnouncements(viewerRole, departmentCode);

  return (
    <section
      className={cn("announcement-banner w-full max-w-full", className)}
      aria-label="Provincial announcements"
    >
      <div
        role="button"
        tabIndex={0}
        className="announcement-banner-track flex w-full max-w-full flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-3"
        onClick={onBannerClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onBannerClick();
          }
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex min-w-0 flex-1 items-start gap-2 sm:items-center">
          {renderAnnouncementBanner(currentMessage, currentIcon, viewerRole, departmentCode, {
            category: current.category,
            showAdminLink: isAdmin,
          })}
        </div>

        {showControls && (
          <div
            className="flex w-full shrink-0 items-center justify-center gap-1 sm:w-auto sm:justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="rounded-md p-1.5 text-amber-100/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Previous announcement"
              onClick={onPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[2.25rem] text-center text-[10px] font-semibold text-amber-200/90 tabular-nums">
              {safeIndex + 1}/{visible.length}
            </span>
            <button
              type="button"
              className="rounded-md p-1.5 text-amber-100/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Next announcement"
              onClick={onNext}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {showControls && (
        <div className="flex justify-center gap-1.5 border-t border-amber-400/15 bg-black/10 px-3 py-1.5">
          {visible.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === safeIndex ? "w-5 bg-amber-300" : "w-1.5 bg-amber-200/40 hover:bg-amber-200/70"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              aria-label={`Show announcement ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
