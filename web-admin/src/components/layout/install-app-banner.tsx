"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProvincialLogo } from "@/components/ui/provincial-logo";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isAndroid() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

export function InstallAppBanner() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<"ios" | "android" | "web">("web");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dismissedStorage = localStorage.getItem("zsspgp-install-dismissed");
    if (dismissedStorage === "1") {
      setDismissed(true);
      return;
    }

    if (isIOS()) setPlatform("ios");
    else if (isAndroid()) setPlatform("android");
    else setPlatform("web");

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (standalone) return;

    setVisible(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function handleDismiss() {
    localStorage.setItem("zsspgp-install-dismissed", "1");
    setDismissed(true);
    setVisible(false);
  }

  async function handleInstall() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setVisible(false);
      return;
    }
    if (platform === "ios") {
      alert(
        "To install on iOS:\n1. Tap Share in Safari\n2. Choose \"Add to Home Screen\"\n3. Tap Add"
      );
    } else {
      alert(
        "To install on desktop:\nUse your browser menu → Install app / Add to Home Screen (Chrome, Edge)."
      );
    }
  }

  const installLabel =
    platform === "ios"
      ? "Install on iOS"
      : platform === "android"
        ? "Install on Android"
        : "Install Web App";

  const hint =
    platform === "ios"
      ? "Add ZSSPGP to your Home Screen for quick access."
      : platform === "android"
        ? "Install the provincial app for alerts and citizen services."
        : "Install this app in your browser for a full-screen experience.";

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          className="sticky top-0 z-[60] border-b border-cyan-500/30 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 shadow-lg"
        >
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <ProvincialLogo size={36} showGlow={false} />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  <Smartphone className="h-4 w-4 text-cyan-400" />
                  Install ZSSPGP App
                </p>
                <p className="truncate text-xs text-slate-400">{hint}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button type="button" variant="gov" size="sm" className="gap-1.5" onClick={handleInstall}>
                <Download className="h-4 w-4" />
                {installLabel}
              </Button>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Dismiss install banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
