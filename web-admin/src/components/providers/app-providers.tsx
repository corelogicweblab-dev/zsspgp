"use client";

import { PageTransitionProvider } from "./page-transition-provider";
import { FuturisticBackground } from "@/components/layout/futuristic-background";
import { SupportProvider } from "@/components/support/support-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FuturisticBackground />
      <SupportProvider>
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </SupportProvider>
    </>
  );
}
