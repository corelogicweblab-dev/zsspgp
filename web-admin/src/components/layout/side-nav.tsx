"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { ProvincialBrand } from "@/components/ui/provincial-brand";
import { SITE_MEGA_NAV } from "@/lib/site-navigation";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/auth/logout-button";

interface SideNavProps {
  open: boolean;
  onClose: () => void;
}

export function SideNav({ open, onClose }: SideNavProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[70] bg-black/60 lg:hidden"
        aria-label="Close menu"
        onClick={onClose}
      />
      <aside className="fixed left-0 top-0 z-[80] flex h-full w-[min(320px,92vw)] flex-col border-r border-cyan-500/20 bg-slate-950/98 shadow-2xl lg:hidden">
        <div className="flex items-center justify-between border-b border-cyan-500/15 p-4">
          <Link href="/" onClick={onClose} className="min-w-0">
            <ProvincialBrand href={undefined} logoSize={44} showText />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500/80">
            Provincial Portal
          </p>
          <nav className="site-mega-nav-mobile space-y-1" aria-label="Mobile portal menu">
            {SITE_MEGA_NAV.map((group) => {
              const hasChildren = Boolean(group.children?.length);
              const isExpanded = expanded === group.label;
              const groupActive =
                group.href &&
                (pathname === group.href || pathname.startsWith(`${group.href}/`));

              if (!hasChildren) {
                return (
                  <Link
                    key={group.label}
                    href={group.href ?? "/"}
                    onClick={onClose}
                    className={cn(
                      "site-mega-nav-mobile-item block rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide",
                      groupActive && "site-mega-nav-mobile-item-active"
                    )}
                  >
                    {group.label}
                  </Link>
                );
              }

              return (
                <div key={group.label} className="rounded-lg border border-white/5">
                  <button
                    type="button"
                    className="site-mega-nav-mobile-item flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold uppercase tracking-wide"
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpanded((prev) => (prev === group.label ? null : group.label))
                    }
                  >
                    {group.label}
                    <ChevronDown
                      className={cn("h-4 w-4 shrink-0 transition", isExpanded && "rotate-180")}
                    />
                  </button>
                  {isExpanded && (
                    <ul className="space-y-0.5 border-t border-white/5 px-2 py-2">
                      {group.children!.map((child) => {
                        const active =
                          pathname === child.href ||
                          (child.href !== "/" && pathname.startsWith(child.href));
                        return (
                          <li key={child.href + child.label}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className={cn(
                                "block rounded-md px-3 py-2 text-sm",
                                active
                                  ? "bg-cyan-500/15 text-cyan-100"
                                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <LogoutButton block onAfterSignOut={onClose} />
      </aside>
    </>
  );
}
