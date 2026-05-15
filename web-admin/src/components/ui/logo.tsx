import Link from "next/link";
import { ProvincialLogo } from "./provincial-logo";
import { APP_SHORT } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizes = { sm: 40, md: 52, lg: 72 };

export function Logo({ className, showText = true, size = "md", href = "/" }: LogoProps) {
  const dim = sizes[size];
  const inner = (
    <div className={cn("flex items-center gap-3", className)}>
      <ProvincialLogo size={dim} priority />
      {showText && (
        <div className="hidden flex-col sm:flex">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
            Province of Zamboanga Sibugay
          </span>
          <span className="text-sm font-bold text-white">{APP_SHORT}</span>
        </div>
      )}
    </div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
