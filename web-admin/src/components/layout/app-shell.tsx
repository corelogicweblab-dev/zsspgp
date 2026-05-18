"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { SideNav } from "./side-nav";
import { AppHeader } from "./app-header";
import { AppFooter } from "./app-footer";
import { ProvincialCapitolMap } from "@/components/landing/provincial-capitol-map";
import { InstallAppBanner } from "./install-app-banner";
import { SupportFab } from "@/components/support/support-fab";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <InstallAppBanner />
      <AppHeader onMenuClick={() => setMenuOpen(true)} />
      <SideNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="app-main mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:p-6 lg:p-8">
        {children}
      </main>
      {isHome && (
        <div className="mx-auto w-full max-w-7xl px-3 pb-6 sm:px-6 sm:pb-8">
          <ProvincialCapitolMap />
        </div>
      )}
      <AppFooter />
      <SupportFab />
    </div>
  );
}
