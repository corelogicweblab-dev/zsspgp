import Link from "next/link";
import { ProvincialLogo } from "@/components/ui/provincial-logo";
import { APP_SHORT } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProvincialBrandProps {
  /** Logo pixel size — one seal only (system standard). */
  logoSize?: number;
  showText?: boolean;
  showGlow?: boolean;
  href?: string;
  className?: string;
  textAlign?: "left" | "center";
}

/** Single provincial seal + optional label — use everywhere (header, footer, admin). */
export function ProvincialBrand({
  logoSize = 52,
  showText = true,
  showGlow = true,
  href,
  className,
  textAlign = "left",
}: ProvincialBrandProps) {
  const inner = (
    <div
      className={cn(
        "flex items-center gap-3",
        textAlign === "center" && "flex-col text-center",
        className
      )}
    >
      <ProvincialLogo size={logoSize} priority showGlow={showGlow} />
      {showText && (
        <div className={cn("min-w-0 leading-tight", textAlign === "center" && "items-center")}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/90">
            Province of Zamboanga Sibugay
          </p>
          <p className="text-sm font-bold text-white sm:text-base">{APP_SHORT}</p>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition opacity-95 hover:opacity-100">
        {inner}
      </Link>
    );
  }

  return inner;
}
