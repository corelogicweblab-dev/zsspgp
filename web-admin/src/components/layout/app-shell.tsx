"use client";

import { SideNav } from "./side-nav";
import { AppFooter } from "./app-footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-screen">
      <SideNav />
      <div className="flex min-h-screen flex-1 flex-col pl-[260px]">
        <main className="flex-1 p-6 sm:p-8">{children}</main>
        <AppFooter />
      </div>
    </div>
  );
}
