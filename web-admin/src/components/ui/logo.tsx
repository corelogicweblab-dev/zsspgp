import Image from "next/image";
import Link from "next/link";
import { LOGO_PATH, APP_SHORT } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizes = { sm: 36, md: 48, lg: 64 };

export function Logo({ className, showText = true, size = "md", href = "/" }: LogoProps) {
  const dim = sizes[size];
  const inner = (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src={LOGO_PATH}
        alt={`${APP_SHORT} Logo`}
        width={dim}
        height={dim}
        className="rounded-full object-contain"
        priority
      />
      {showText && (
        <div className="hidden flex-col sm:flex">
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
            Province of Zamboanga Sibugay
          </span>
          <span className="text-sm font-bold text-slate-900">{APP_SHORT}</span>
        </div>
      )}
    </div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
