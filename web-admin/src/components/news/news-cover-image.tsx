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

/** Cover image — Next/Image for Supabase storage, native img for other HTTPS URLs. */
export function NewsCoverImage({
  src,
  alt = "",
  className,
  sizes,
  priority,
  fill = true,
}: NewsCoverImageProps) {
  if (isSupabaseStorageUrl(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(fill && "absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
