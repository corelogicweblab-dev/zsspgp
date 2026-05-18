"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SITE_MEGA_NAV } from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

export function SiteMegaNav() {
  const pathname = usePathname();
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  return (
    <nav className="site-mega-nav hidden lg:block" aria-label="Provincial portal menu">
      <div className="site-mega-nav-inner mx-auto flex max-w-7xl items-stretch px-4 sm:px-6">
        {SITE_MEGA_NAV.map((group, index) => {
          const hasChildren = group.children && group.children.length > 0;
          const isOpen = openLabel === group.label;
          const groupActive =
            group.href &&
            (pathname === group.href || pathname.startsWith(`${group.href}/`));

          return (
            <motion.div
              key={group.label}
              className="relative flex items-stretch"
              onMouseEnter={() => hasChildren && setOpenLabel(group.label)}
              onMouseLeave={() => setOpenLabel(null)}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
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
                    "site-mega-nav-item flex items-center gap-1 px-3 py-3 text-[11px] font-bold uppercase tracking-wide",
                    isOpen && "site-mega-nav-item-active"
                  )}
                  aria-expanded={isOpen}
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
                    "site-mega-nav-item flex items-center px-3 py-3 text-[11px] font-bold uppercase tracking-wide",
                    groupActive && "site-mega-nav-item-active"
                  )}
                >
                  {group.label}
                </Link>
              )}

              <AnimatePresence>
                {hasChildren && isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="site-mega-nav-dropdown absolute left-0 top-full z-[60] min-w-[240px] pt-1"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}
