"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { ProvincialLogo } from "@/components/ui/provincial-logo";
import { APP_SHORT } from "@/lib/constants";
import { SiteMegaNav } from "@/components/layout/site-mega-nav";
import { Button } from "@/components/ui/button";
import { LiveClock } from "@/components/layout/live-clock";
import { LogoutButton } from "@/components/auth/logout-button";
import { useSupport } from "@/components/support/support-provider";

interface AppHeaderProps {
  onMenuClick: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { openSupport } = useSupport();

  return (
    <header className="app-header sticky top-0 z-50">
      <div className="app-header-accent" aria-hidden />
      <div className="app-header-scan" aria-hidden />
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="shrink-0 text-cyan-100 hover:bg-cyan-500/10 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <Link href="/" className="flex min-w-0 flex-1 items-center gap-3 sm:flex-none">
          <ProvincialLogo size={48} priority />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/90">
              Province of Zamboanga Sibugay
            </p>
            <p className="truncate text-base font-bold text-white sm:text-lg">{APP_SHORT}</p>
          </div>
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="hidden border-cyan-500/30 text-cyan-100 sm:inline-flex"
            onClick={() => openSupport("welcome")}
          >
            Contact Us!
          </Button>
          <LiveClock />
          <LogoutButton />
        </div>
      </div>
      <SiteMegaNav />
    </header>
  );
}
