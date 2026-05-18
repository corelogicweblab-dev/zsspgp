"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SITE_MEGA_NAV } from "@/lib/site-navigation";
import { cn } from "@/lib/utils";
import { usePerformanceMode } from "@/lib/use-performance-mode";

export function SiteMegaNav() {
  const pathname = usePathname();
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const lite = usePerformanceMode();

  const toggle = (label: string) => {
    setOpenLabel((prev) => (prev === label ? null : label));
  };

  return (
    <nav className="site-mega-nav" aria-label="Provincial portal menu">
      <div className="site-mega-nav-inner mx-auto flex max-w-7xl items-stretch overflow-x-auto px-2 sm:px-6 scrollbar-thin">
        {SITE_MEGA_NAV.map((group, index) => {
          const hasChildren = group.children && group.children.length > 0;
          const isOpen = openLabel === group.label;
          const groupActive =
            group.href &&
            (pathname === group.href || pathname.startsWith(`${group.href}/`));

          return (
            <div
              key={group.label}
              className="relative flex shrink-0 items-stretch"
              onMouseEnter={() => !lite && hasChildren && setOpenLabel(group.label)}
              onMouseLeave={() => !lite && setOpenLabel(null)}
            >
              {index > 0 && (
                <span className="site-mega-nav-divider self-center" aria-hidden>
                  |
                </span>
              )}

              {hasChildren ? (
                <button
                  type="button"
                  className={cn(
                    "site-mega-nav-item flex items-center gap-1 whitespace-nowrap px-2.5 py-2.5 text-[10px] font-bold uppercase tracking-wide sm:px-3 sm:py-3 sm:text-[11px]",
                    isOpen && "site-mega-nav-item-active"
                  )}
                  aria-expanded={isOpen}
                  onClick={() => toggle(group.label)}
                >
                  {group.label}
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 transition", isOpen && "rotate-180")}
                  />
                </button>
              ) : (
                <Link
                  href={group.href ?? "/"}
                  className={cn(
                    "site-mega-nav-item flex items-center whitespace-nowrap px-2.5 py-2.5 text-[10px] font-bold uppercase tracking-wide sm:px-3 sm:py-3 sm:text-[11px]",
                    groupActive && "site-mega-nav-item-active"
                  )}
                >
                  {group.label}
                </Link>
              )}

              {hasChildren && isOpen && (
                <div className="site-mega-nav-dropdown absolute left-0 top-full z-[60] min-w-[240px] pt-1">
                  <ul className="overflow-hidden rounded-lg border border-cyan-500/25 bg-slate-950/98 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    {group.children!.map((child) => {
                      const active =
                        pathname === child.href ||
                        (child.href !== "/" && pathname.startsWith(child.href));
                      return (
                        <li key={child.href + child.label}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block rounded-md px-3 py-2.5 transition",
                              active
                                ? "bg-cyan-500/15 text-cyan-100"
                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                            )}
                            onClick={() => setOpenLabel(null)}
                          >
                            <span className="text-sm font-medium">{child.label}</span>
                            {child.description && (
                              <span className="mt-0.5 block text-[11px] text-slate-500">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
