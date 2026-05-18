"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { ProvincialBrand } from "@/components/ui/provincial-brand";
import { ProvincialNavBar } from "@/components/layout/provincial-nav-bar";
import { Button } from "@/components/ui/button";
import { LiveClock } from "@/components/layout/live-clock";
import { LogoutButton } from "@/components/auth/logout-button";
import { CitizenNotificationsBell } from "@/components/layout/citizen-notifications-bell";
import { SiteSearchBar } from "@/components/layout/site-search-bar";
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
          variant="outline"
          size="sm"
          onClick={onMenuClick}
          aria-label="Open full navigation menu"
          className="shrink-0 gap-1.5 border-cyan-500/35 px-2.5 text-cyan-100 hover:bg-cyan-500/10 lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wide">Menu</span>
        </Button>

        <ProvincialBrand
          href="/"
          logoSize={40}
          className="min-w-0 flex-1 sm:flex-none lg:[&_img]:!h-12 lg:[&_img]:!w-12"
        />

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <SiteSearchBar />
          <CitizenNotificationsBell />
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
      <ProvincialNavBar className="provincial-nav-bar--desktop-scroll" />
    </header>
  );
}
