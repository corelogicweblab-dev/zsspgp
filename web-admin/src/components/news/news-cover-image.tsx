import Image from "next/image";
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

/** Cover image — Next/Image when optimizable; native img with eager load otherwise. */
export function NewsCoverImage({
  src,
  alt = "",
  className,
  sizes,
  priority = false,
  fill = true,
}: NewsCoverImageProps) {
  if (isSupabaseStorageUrl(src) || src.startsWith("/")) {
    return (
      <Image
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

  if (isOptimizableRemoteUrl(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : undefined}
        unoptimized
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
