"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { formatRelative } from "@/lib/utils";
import type { PublicBroadcast } from "@/types";
import { cn } from "@/lib/utils";

const READ_KEY = "zsspgp-read-broadcasts";

function loadReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(READ_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

function persistReadIds(ids: Set<string>) {
  localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
}

export function CitizenNotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PublicBroadcast[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/public-notifications");
      const data = (await res.json()) as { notifications?: PublicBroadcast[] };
      setItems(data.notifications ?? []);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    setReadIds(loadReadIds());
    void fetchItems();
    const timer = window.setInterval(fetchItems, 60_000);
    return () => window.clearInterval(timer);
  }, [fetchItems]);

  const unread = items.filter((n) => !readIds.has(n.id)).length;

  function markAllRead() {
    const next = new Set(readIds);
    items.forEach((n) => next.add(n.id));
    setReadIds(next);
    persistReadIds(next);
  }

  function markRead(id: string) {
    const next = new Set(readIds);
    next.add(id);
    setReadIds(next);
    persistReadIds(next);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) void fetchItems();
        }}
        className="relative rounded-lg p-2 text-cyan-100 transition hover:bg-cyan-500/10"
        aria-label="Provincial notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-slate-950">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[55]"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-[60] mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-cyan-500/25 bg-slate-950/98 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Provincial updates
              </p>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-[10px] font-semibold text-amber-300 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <ul className="max-h-[min(60vh,20rem)] overflow-y-auto p-2">
              {items.length === 0 ? (
                <li className="px-2 py-6 text-center text-xs text-slate-500">
                  No updates yet. News and announcements from the province will appear here.
                </li>
              ) : (
                items.map((n) => {
                  const isUnread = !readIds.has(n.id);
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        className={cn(
                          "w-full rounded-lg px-2.5 py-2.5 text-left transition hover:bg-white/5",
                          isUnread && "bg-cyan-500/10"
                        )}
                        onClick={() => {
                          markRead(n.id);
                          setOpen(false);
                          if (n.link_url) window.location.href = n.link_url;
                        }}
                      >
                        <p className="text-sm font-medium text-slate-100">{n.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{n.message}</p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {formatRelative(n.created_at)}
                          {n.link_url && (
                            <span className="ml-2 text-cyan-400">Open →</span>
                          )}
                        </p>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
            <div className="border-t border-white/10 px-3 py-2 text-center">
              <Link
                href="/announcements"
                className="text-xs font-semibold text-cyan-400 hover:underline"
                onClick={() => setOpen(false)}
              >
                View all announcements
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
