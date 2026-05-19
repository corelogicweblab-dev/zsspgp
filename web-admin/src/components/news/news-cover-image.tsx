"use client";

import { FastImage } from "@/components/ui/fast-image";
import { cn } from "@/lib/utils";

interface NewsCoverImageProps {
  src: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}

function isSupabaseStorageUrl(url: string) {
  try {
    return new URL(url).hostname.endsWith("supabase.co");
  } catch {
    return false;
  }
}

function isOptimizableRemoteUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** Cover image with shimmer placeholder and adaptive quality on slow networks. */
export function NewsCoverImage({
  src,
  alt = "",
  className,
  sizes,
  priority = false,
  fill = true,
}: NewsCoverImageProps) {
  if (isSupabaseStorageUrl(src) || src.startsWith("/") || isOptimizableRemoteUrl(src)) {
    return (
      <FastImage
        src={src}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : undefined}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn(fill && "absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
