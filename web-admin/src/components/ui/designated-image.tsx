"use client";

import { FastImage } from "@/components/ui/fast-image";
import type { ImageProps } from "next/image";

type DesignatedImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallbackSrc?: string;
};

/** Official PNG/WebP with fast placeholder, optimization, and fallback. */
export function DesignatedImage({ src, fallbackSrc, ...props }: DesignatedImageProps) {
  return <FastImage src={src} fallbackSrc={fallbackSrc} {...props} />;
}
