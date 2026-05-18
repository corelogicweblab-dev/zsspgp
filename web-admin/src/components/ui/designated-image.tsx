"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type DesignatedImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallbackSrc?: string;
};

/** WebP-first provincial images with PNG fallback; shows placeholder if both fail. */
export function DesignatedImage({
  src,
  fallbackSrc,
  className,
  alt = "",
  fill,
  ...props
}: DesignatedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-slate-800/80 text-[10px] font-semibold uppercase tracking-wider text-slate-500",
          fill ? "absolute inset-0" : "",
          className
        )}
        aria-hidden
      >
        {alt.slice(0, 2) || "ZS"}
      </div>
    );
  }

  return (
    <Image
      {...props}
      fill={fill}
      src={currentSrc}
      alt={alt}
      className={cn(className)}
      unoptimized={currentSrc.endsWith(".webp")}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
          return;
        }
        setFailed(true);
      }}
    />
  );
}
