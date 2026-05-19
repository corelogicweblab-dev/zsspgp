"use client";

import { useState } from "react";
import { FastImage } from "@/components/ui/fast-image";
import { LOGO_PATH, APP_SHORT } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProvincialLogoProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
  priority?: boolean;
}

/** Provincial seal — optimized with instant placeholder. */
export function ProvincialLogo({
  size = 52,
  className,
  showGlow = true,
  priority = false,
}: ProvincialLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-bold text-white",
          showGlow && "logo-glow",
          className
        )}
        style={{ width: size, height: size }}
        title={APP_SHORT}
      >
        ZS
      </div>
    );
  }

  return (
    <FastImage
      src={LOGO_PATH}
      alt={`${APP_SHORT} — Province of Zamboanga Sibugay`}
      width={size}
      height={size}
      priority={priority}
      sizes={`${size}px`}
      className={cn(
        "rounded-full object-contain",
        showGlow && "logo-glow logo-float",
        className
      )}
      onError={() => setFailed(true)}
    />
  );
}
