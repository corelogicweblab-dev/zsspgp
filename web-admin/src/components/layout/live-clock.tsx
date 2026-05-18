"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { format } from "date-fns";

export function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div
        className={
          className ??
          "hidden h-9 min-w-[7rem] animate-pulse rounded-lg border border-cyan-500/20 bg-slate-900/50 sm:block"
        }
        aria-hidden
      />
    );
  }

  return (
    <div
      className={
        className ??
        "hidden items-center gap-2 rounded-lg border border-cyan-500/25 bg-slate-900/60 px-3 py-1.5 text-xs sm:flex"
      }
    >
      <Clock className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
      <div className="text-right leading-tight">
        <p className="font-mono font-semibold text-cyan-100">{format(now, "hh:mm:ss a")}</p>
        <p className="text-[10px] text-slate-400">{format(now, "EEEE, MMMM d, yyyy")}</p>
      </div>
    </div>
  );
}
