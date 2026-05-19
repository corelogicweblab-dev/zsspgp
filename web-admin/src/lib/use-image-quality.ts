"use client";

import { useEffect, useState } from "react";

function isSlowConnection(): boolean {
  if (typeof navigator === "undefined") return false;
  const connection = (
    navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    }
  ).connection;
  if (!connection) return false;
  if (connection.saveData) return true;
  const type = connection.effectiveType;
  return type === "slow-2g" || type === "2g" || type === "3g";
}

/** Lower quality only on save-data or 2G/3G — not on every mobile viewport. */
export function useImageQuality(normal = 75): number {
  const [quality, setQuality] = useState(normal);

  useEffect(() => {
    const sync = () => setQuality(isSlowConnection() ? 52 : normal);
    sync();
    const connection = (
      navigator as Navigator & {
        connection?: {
          addEventListener?: (t: string, fn: () => void) => void;
          removeEventListener?: (t: string, fn: () => void) => void;
        };
      }
    ).connection;
    connection?.addEventListener?.("change", sync);
    return () => connection?.removeEventListener?.("change", sync);
  }, [normal]);

  return quality;
}
