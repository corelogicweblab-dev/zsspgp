"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { getNavSearchResults, type SiteSearchResult } from "@/lib/site-search";
import { cn } from "@/lib/utils";

const CATEGORY_STYLES: Record<SiteSearchResult["category"], string> = {
  Page: "text-cyan-400",
  News: "text-amber-300",
  Announcement: "text-emerald-300",
  "Executive Order": "text-violet-300",
};

export function SiteSearchBar() {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [results, setResults] = useState<SiteSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const nav = getNavSearchResults(trimmed);

    try {
      const res = await fetch(`/api/site-search?q=${encodeURIComponent(trimmed)}`);
      const data = (await res.json()) as { results?: SiteSearchResult[] };
      const remote = data.results ?? [];
      const merged = [...nav];
      const seen = new Set(nav.map((n) => n.href));
      for (const item of remote) {
        if (!seen.has(item.href)) merged.push(item);
      }
      setResults(merged.slice(0, 12));
    } catch {
      setResults(nav.slice(0, 12));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open && !mobileOpen) return;
    const t = window.setTimeout(() => void runSearch(query), 280);
    return () => window.clearTimeout(t);
  }, [query, open, mobileOpen, runSearch]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setMobileOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function goTo(item: SiteSearchResult) {
    setOpen(false);
    setMobileOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
    const href = item.href;
    if (href.includes("#")) {
      router.push(href);
    } else {
      router.push(href);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      setMobileOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      goTo(results[activeIndex]);
    }
  }

  const showPanel = (open || mobileOpen) && query.trim().length >= 2;

  const inputClasses =
    "h-9 w-full rounded-lg border border-cyan-500/30 bg-slate-900/80 pl-9 pr-8 text-sm text-cyan-50 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45";

  const resultsPanel = showPanel && (
    <ul
      id={listId}
      role="listbox"
      className="site-search-results absolute right-0 top-full z-[400] mt-1.5 max-h-[min(70vh,20rem)] w-[min(100vw-2rem,22rem)] overflow-y-auto rounded-xl border border-cyan-500/25 bg-slate-950/98 py-1 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:w-80"
    >
      {loading && results.length === 0 ? (
        <li className="flex items-center gap-2 px-3 py-3 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          Searching…
        </li>
      ) : results.length === 0 ? (
        <li className="px-3 py-3 text-sm text-slate-400">No results for &ldquo;{query.trim()}&rdquo;</li>
      ) : (
        results.map((item, i) => (
          <li key={item.id} role="option" aria-selected={i === activeIndex}>
            <button
              type="button"
              className={cn(
                "flex w-full flex-col gap-0.5 px-3 py-2.5 text-left transition-colors",
                i === activeIndex ? "bg-cyan-500/15" : "hover:bg-white/5"
              )}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => goTo(item)}
            >
              <span className="text-sm font-medium text-slate-100">{item.title}</span>
              <span className="flex items-center gap-2 text-[11px]">
                <span className={cn("font-semibold uppercase tracking-wide", CATEGORY_STYLES[item.category])}>
                  {item.category}
                </span>
                {item.excerpt && (
                  <span className="truncate text-slate-500">{item.excerpt}</span>
                )}
              </span>
            </button>
          </li>
        ))
      )}
    </ul>
  );

  return (
    <div ref={rootRef} className="site-search relative flex items-center">
      {/* Mobile: icon toggles search */}
      <button
        type="button"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/25 text-cyan-100 transition hover:bg-cyan-500/10 sm:hidden",
          mobileOpen && "border-cyan-400/50 bg-cyan-500/15"
        )}
        aria-label={mobileOpen ? "Close search" : "Open search"}
        aria-expanded={mobileOpen}
        onClick={() => {
          setMobileOpen((v) => !v);
          if (!mobileOpen) window.setTimeout(() => inputRef.current?.focus(), 50);
        }}
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
      </button>

      {mobileOpen && (
        <div className="absolute right-0 top-full z-[390] mt-1.5 w-[min(calc(100vw-2rem),18rem)] sm:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400/70" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
                setActiveIndex(-1);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search portal…"
              className={inputClasses}
              aria-label="Search provincial portal"
              aria-controls={listId}
              aria-expanded={showPanel}
              autoComplete="off"
            />
          </div>
          {resultsPanel}
        </div>
      )}

      {/* Desktop */}
      <div className="relative hidden sm:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400/70" />
        <input
          ref={!mobileOpen ? inputRef : undefined}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search…"
          className={cn(inputClasses, "w-36 md:w-44 lg:w-52")}
          aria-label="Search provincial portal"
          aria-controls={listId}
          aria-expanded={showPanel}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-200"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {resultsPanel}
      </div>
    </div>
  );
}

