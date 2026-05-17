"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { ProvincialLogo } from "@/components/ui/provincial-logo";
import { APP_SHORT } from "@/lib/constants";
import { KNOW_YOUR_GOVERNOR_PATH } from "@/lib/governor-profile";
import { Button } from "@/components/ui/button";
import { LiveClock } from "@/components/layout/live-clock";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  onMenuClick: () => void;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/complaints", label: "Complaints" },
  { href: KNOW_YOUR_GOVERNOR_PATH, label: "Governor" },
] as const;

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="app-header sticky top-0 z-50">
      <div className="app-header-accent" aria-hidden />
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

        <nav
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-cyan-500/15 text-cyan-100 ring-1 ring-cyan-400/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <LiveClock />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
