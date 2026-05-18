"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { ProvincialBrand } from "@/components/ui/provincial-brand";
import { ProvincialNavBar } from "@/components/layout/provincial-nav-bar";
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
          className="shrink-0 text-cyan-100 hover:bg-cyan-500/10 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <ProvincialBrand
          href="/"
          logoSize={40}
          className="min-w-0 flex-1 sm:flex-none lg:[&_img]:!h-12 lg:[&_img]:!w-12"
        />

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
      <ProvincialNavBar variant="desktop" className="hidden xl:block" />
      <ProvincialNavBar variant="tablet" className="hidden md:block xl:hidden" />
    </header>
  );
}
