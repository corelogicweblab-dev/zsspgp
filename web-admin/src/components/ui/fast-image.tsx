"use client";

import { useCallback, useEffect, useState } from "react";
import Image, { type ImageProps, type StaticImageData } from "next/image";
import { useImageQuality } from "@/lib/use-image-quality";
import { cn } from "@/lib/utils";

type FastImageProps = Omit<ImageProps, "quality"> & {
  fallbackSrc?: string;
};

function resolveImageSrc(value: ImageProps["src"]): string {
  if (typeof value === "string") return value;
  return (value as StaticImageData).src;
}

/** Static /public assets load directly — avoids optimizer edge cases. */
function shouldSkipOptimization(src: string): boolean {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return true;
  if (src.startsWith("/")) return /\.(png|webp|gif|jpe?g|avif|svg)$/i.test(src);
  return false;
}

/**
 * Reliable image with WebP fallback. No opacity gate — Next.js onLoad is unreliable
 * and previously left images permanently invisible.
 */
export function FastImage({
  src,
  fallbackSrc,
  alt = "",
  className,
  fill,
  priority,
  sizes,
  loading,
  onError,
  ...props
}: FastImageProps) {
  const quality = useImageQuality();
  const [currentSrc, setCurrentSrc] = useState(() => resolveImageSrc(src));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(resolveImageSrc(src));
    setFailed(false);
  }, [src]);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setFailed(false);
        return;
      }
      setFailed(true);
      onError?.(e);
    },
    [fallbackSrc, currentSrc, onError]
  );

  if (failed) {
    return (
      <span
        className={cn(
          "flex items-center justify-center bg-slate-800/90 text-[10px] font-semibold uppercase tracking-wider text-slate-500",
          fill ? "absolute inset-0" : "",
          className
        )}
        aria-hidden={!alt}
      >
        {alt.slice(0, 2) || "—"}
      </span>
    );
  }

  return (
    <Image
      {...props}
      fill={fill}
      src={currentSrc}
      alt={alt}
      sizes={sizes}
      priority={priority}
      quality={quality}
      loading={priority ? "eager" : loading ?? "lazy"}
      decoding="async"
      unoptimized={shouldSkipOptimization(currentSrc)}
      className={className}
      onError={handleError}
    />
  );
}
