"use client";

import { useCallback, useState } from "react";
import Image, { type ImageProps, type StaticImageData } from "next/image";
import { IMAGE_BLUR_DATA_URL, isOptimizableImageSrc } from "@/lib/image-blur";
import { useImageQuality } from "@/lib/use-image-quality";
import { cn } from "@/lib/utils";

type FastImageProps = Omit<ImageProps, "quality" | "placeholder" | "blurDataURL"> & {
  fallbackSrc?: string;
};

function resolveImageSrc(value: ImageProps["src"]): string {
  if (typeof value === "string") return value;
  return (value as StaticImageData).src;
}

/**
 * Optimized image with instant shimmer placeholder and fade-in.
 * Uses Next.js image optimization (WebP/AVIF, resized) unless src is data/blob.
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
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setLoaded(false);
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
          "image-placeholder flex items-center justify-center bg-slate-800/90 text-[10px] font-semibold uppercase tracking-wider text-slate-500",
          fill ? "absolute inset-0" : "",
          className
        )}
        aria-hidden={!alt}
      >
        {alt.slice(0, 2) || "—"}
      </span>
    );
  }

  const shellClass = cn("image-shell", fill && "absolute inset-0");

  return (
    <span className={shellClass}>
      {!loaded && <span className="image-shimmer absolute inset-0 z-0" aria-hidden />}
      <Image
        {...props}
        fill={fill}
        src={currentSrc}
        alt={alt}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder="blur"
        blurDataURL={IMAGE_BLUR_DATA_URL}
        loading={priority ? "eager" : loading ?? "lazy"}
        decoding="async"
        unoptimized={!isOptimizableImageSrc(currentSrc)}
        className={cn(
          className,
          "relative z-[1] transition-opacity duration-200 ease-out",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  );
}
