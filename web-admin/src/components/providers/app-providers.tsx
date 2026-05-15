"use client";

import { PageTransitionProvider } from "./page-transition-provider";
import { FuturisticBackground } from "@/components/layout/futuristic-background";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FuturisticBackground />
      <PageTransitionProvider>{children}</PageTransitionProvider>
    </>
  );
}
