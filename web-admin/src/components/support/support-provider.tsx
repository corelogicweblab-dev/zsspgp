"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AiSupportPanel = dynamic(
  () => import("./ai-support-panel").then((m) => m.AiSupportPanel),
  { ssr: false }
);

type SupportContextValue = {
  open: boolean;
  openSupport: (step?: "welcome" | "chat") => void;
  closeSupport: () => void;
};

const SupportContext = createContext<SupportContextValue | null>(null);

export function SupportProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialStep, setInitialStep] = useState<"welcome" | "chat">("welcome");

  const openSupport = useCallback((step: "welcome" | "chat" = "welcome") => {
    setInitialStep(step);
    setOpen(true);
  }, []);

  const closeSupport = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openSupport, closeSupport }),
    [open, openSupport, closeSupport]
  );

  return (
    <SupportContext.Provider value={value}>
      {children}
      {open && (
        <AiSupportPanel open={open} initialStep={initialStep} onClose={closeSupport} />
      )}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const ctx = useContext(SupportContext);
  if (!ctx) {
    throw new Error("useSupport must be used within SupportProvider");
  }
  return ctx;
}
