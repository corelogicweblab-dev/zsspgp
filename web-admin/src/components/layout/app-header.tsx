"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { ProvincialLogo } from "@/components/ui/provincial-logo";
import { APP_SHORT } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { LiveClock } from "@/components/layout/live-clock";

interface AppHeaderProps {
  onMenuClick: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-cyan-500/20 glass-panel px-4 py-3 sm:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="shrink-0 text-cyan-100 hover:bg-cyan-500/10"
      >
        <Menu className="h-6 w-6" />
      </Button>
      <Link href="/" className="flex min-w-0 flex-1 items-center gap-3">
        <ProvincialLogo size={44} priority />
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
            Province of Zamboanga Sibugay
          </p>
          <p className="truncate text-base font-bold text-white">{APP_SHORT}</p>
        </div>
      </Link>
      <LiveClock />
    </header>
  );
}
