"use client";

import { useState } from "react";
import { SideNav } from "./side-nav";
import { AppHeader } from "./app-header";
import { AppFooter } from "./app-footer";
import { InstallAppBanner } from "./install-app-banner";
import { SupportFab } from "@/components/support/support-fab";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <InstallAppBanner />
      <AppHeader onMenuClick={() => setMenuOpen(true)} />
      <SideNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      <AppFooter />
      <SupportFab />
    </div>
  );
}
