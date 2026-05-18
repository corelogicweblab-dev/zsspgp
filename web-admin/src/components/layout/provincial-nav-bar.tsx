"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { PROVINCIAL_NAV_ITEMS, type NavItem } from "@/lib/site-navigation";
import { cn } from "@/lib/utils";
import { usePerformanceMode } from "@/lib/use-performance-mode";

export type { NavItem };

export type NavRenderContext = {
  activeTab: string | null;
  openDropdown: string | null;
  pathname: string;
  lite: boolean;
  setActiveTab: (tab: string) => void;
  toggleDropdown: (tab: string) => void;
  openDropdownFor: (tab: string | null) => void;
  onNavigate?: () => void;
};

function isChildActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function resolveActiveTab(pathname: string, items: NavItem[]): string | null {
  for (const item of items) {
    if (!item.hasDropdown && isChildActive(pathname, item.link)) return item.title;
    for (const child of item.children ?? []) {
      if (isChildActive(pathname, child.href)) return item.title;
    }
  }
  return null;
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** @see setActiveTab — updates the highlighted top-level tab */
export function setActiveTab(tab: string, setter: (value: string | null) => void): void {
  setter(tab);
}

/** @see toggleDropdown — opens/closes a dropdown by tab title */
export function toggleDropdown(
  tab: string,
  current: string | null,
  setter: (value: string | null) => void
): void {
  setter(current === tab ? null : tab);
}

export function createNavItem(item: NavItem, ctx: NavRenderContext): ReactNode {
  const isActive = ctx.activeTab === item.title;
  const isOpen = ctx.openDropdown === item.title;
  const isAlert = item.title === "Emergency Alerts";

  if (!item.hasDropdown) {
    return (
      <li key={item.title} role="none" className="relative flex shrink-0 items-stretch">
        <Link
          href={item.link}
          role="menuitem"
          className={cn(
            "provincial-nav-item flex items-center whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 xl:px-3.5 xl:py-2.5 xl:text-xs",
            isAlert && "provincial-nav-item--alert",
            isActive && "provincial-nav-item-active"
          )}
          onClick={() => {
            ctx.setActiveTab(item.title);
            ctx.onNavigate?.();
          }}
        >
          {item.title}
        </Link>
      </li>
    );
  }

  return (
    <li
      key={item.title}
      role="none"
      className="relative flex shrink-0 items-stretch"
      onMouseEnter={() => !ctx.lite && ctx.openDropdownFor(item.title)}
    >
      <button
        type="button"
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={`nav-submenu-${slugify(item.title)}`}
        className={cn(
          "provincial-nav-item flex items-center gap-0.5 whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 xl:gap-1 xl:px-3.5 xl:py-2.5 xl:text-xs",
          (isActive || isOpen) && "provincial-nav-item-active"
        )}
        onClick={() => ctx.toggleDropdown(item.title)}
        onFocus={() => !ctx.lite && ctx.openDropdownFor(item.title)}
      >
        {item.title}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")}
          aria-hidden
        />
      </button>

      <div
        id={`nav-submenu-${slugify(item.title)}`}
        role="menu"
        aria-label={`${item.title} submenu`}
        className={cn(
          "provincial-nav-dropdown absolute left-0 top-full z-[60] min-w-[260px] pt-1 transition-all duration-200",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <ul className="provincial-nav-dropdown-panel overflow-hidden rounded-xl border border-cyan-400/25 bg-slate-950/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          {item.children?.map((child) => {
            const childActive = isChildActive(ctx.pathname, child.href);
            return (
              <li key={child.href + child.label} role="none">
                <Link
                  href={child.href}
                  role="menuitem"
                  className={cn(
                    "block rounded-md px-3 py-2.5 transition-colors duration-200",
                    childActive
                      ? "bg-amber-400/15 text-amber-100"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                  onClick={ctx.onNavigate}
                >
                  <span className="text-sm font-medium">{child.label}</span>
                  {child.description && (
                    <span className="mt-0.5 block text-[11px] text-slate-500">{child.description}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

export function renderNavBar(items: NavItem[], ctx: NavRenderContext): ReactNode {
  return (
    <ul role="menubar" className="flex flex-nowrap items-center justify-center gap-1">
      {items.map((item) => createNavItem(item, ctx))}
    </ul>
  );
}

type ProvincialNavBarProps = {
  variant?: "desktop" | "tablet";
  className?: string;
};

export function ProvincialNavBar({ variant = "desktop", className }: ProvincialNavBarProps) {
  const pathname = usePathname();
  const lite = usePerformanceMode();
  const routeActive = useMemo(() => resolveActiveTab(pathname, PROVINCIAL_NAV_ITEMS), [pathname]);
  const [activeTab, setActiveTabState] = useState<string | null>(routeActive);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [tabletOpen, setTabletOpen] = useState(false);

  useEffect(() => {
    setActiveTabState(routeActive);
  }, [routeActive]);

  const setActiveTabHandler = useCallback((tab: string) => {
    setActiveTab(tab, setActiveTabState);
  }, []);

  const toggleDropdownHandler = useCallback(
    (tab: string) => {
      toggleDropdown(tab, openDropdown, setOpenDropdown);
    },
    [openDropdown]
  );

  const openDropdownFor = useCallback((tab: string | null) => {
    setOpenDropdown(tab);
  }, []);

  const ctx: NavRenderContext = {
    activeTab: activeTab ?? routeActive,
    openDropdown,
    pathname,
    lite,
    setActiveTab: setActiveTabHandler,
    toggleDropdown: toggleDropdownHandler,
    openDropdownFor,
    onNavigate: () => setOpenDropdown(null),
  };

  if (variant === "tablet") {
    return (
      <nav
        className={cn("provincial-nav-bar provincial-nav-bar--tablet", className)}
        role="navigation"
        aria-label="Provincial navigation (tablet)"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <button
            type="button"
            className="provincial-nav-tablet-toggle flex w-full items-center justify-between px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-white/5"
            aria-expanded={tabletOpen}
            aria-controls="provincial-nav-tablet-panel"
            onClick={() => setTabletOpen((v) => !v)}
          >
            <span className="flex items-center gap-2">
              <Menu className="h-4 w-4 text-amber-300" aria-hidden />
              Browse sections
            </span>
            <ChevronDown
              className={cn("h-4 w-4 transition-transform duration-200", tabletOpen && "rotate-180")}
              aria-hidden
            />
          </button>
          <div
            id="provincial-nav-tablet-panel"
            className={cn(
              "overflow-hidden transition-all duration-300 ease-out",
              tabletOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <ul className="space-y-1 border-t border-white/10 px-2 py-3" role="menu">
              {PROVINCIAL_NAV_ITEMS.map((item) => (
                <TabletNavRow
                  key={item.title}
                  item={item}
                  ctx={ctx}
                  onClose={() => setTabletOpen(false)}
                />
              ))}
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={cn("provincial-nav-bar", className)}
      role="navigation"
      aria-label="Main provincial navigation"
      onMouseLeave={() => !lite && setOpenDropdown(null)}
    >
      <div className="provincial-nav-beam" aria-hidden />
      <div className="provincial-nav-bar-inner mx-auto flex max-w-7xl items-center justify-center px-4 py-1.5 sm:px-6">
        <div className="provincial-nav-track w-full min-w-0">
          {renderNavBar(PROVINCIAL_NAV_ITEMS, ctx)}
        </div>
      </div>
    </nav>
  );
}

function TabletNavRow({
  item,
  ctx,
  onClose,
}: {
  item: NavItem;
  ctx: NavRenderContext;
  onClose: () => void;
}) {
  const isExpanded = ctx.openDropdown === item.title;
  const isActive = ctx.activeTab === item.title;

  if (!item.hasDropdown) {
    return (
      <li role="none">
        <Link
          href={item.link}
          role="menuitem"
          className={cn(
            "provincial-nav-mobile-item block rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors duration-200",
            isActive && "provincial-nav-mobile-item-active"
          )}
          onClick={onClose}
        >
          {item.title}
        </Link>
      </li>
    );
  }

  return (
    <li role="none" className="rounded-lg border border-white/5">
      <button
        type="button"
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={isExpanded}
        className={cn(
          "provincial-nav-mobile-item flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold uppercase tracking-wide transition-colors duration-200",
          (isActive || isExpanded) && "provincial-nav-mobile-item-active"
        )}
        onClick={() => ctx.toggleDropdown(item.title)}
      >
        {item.title}
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isExpanded && "rotate-180")}
          aria-hidden
        />
      </button>
      <ul
        className={cn(
          "space-y-0.5 overflow-hidden border-t border-white/5 px-2 transition-all duration-200",
          isExpanded ? "max-h-96 py-2 opacity-100" : "max-h-0 border-transparent py-0 opacity-0"
        )}
        role="menu"
        aria-label={`${item.title} submenu`}
      >
        {item.children?.map((child) => (
          <li key={child.href + child.label} role="none">
            <Link
              href={child.href}
              role="menuitem"
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors duration-200",
                isChildActive(ctx.pathname, child.href)
                  ? "bg-amber-400/15 text-amber-100"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
              onClick={onClose}
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

type ProvincialNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  header?: ReactNode;
  footer?: ReactNode;
};

export function ProvincialNavDrawer({ open, onClose, header, footer }: ProvincialNavDrawerProps) {
  const pathname = usePathname();
  const routeActive = useMemo(() => resolveActiveTab(pathname, PROVINCIAL_NAV_ITEMS), [pathname]);
  const [activeTab, setActiveTabState] = useState<string | null>(routeActive);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    setActiveTabState(routeActive);
  }, [routeActive]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const ctx: NavRenderContext = {
    activeTab: activeTab ?? routeActive,
    openDropdown,
    pathname,
    lite: false,
    setActiveTab: (tab) => setActiveTab(tab, setActiveTabState),
    toggleDropdown: (tab) => toggleDropdown(tab, openDropdown, setOpenDropdown),
    openDropdownFor: setOpenDropdown,
    onNavigate: onClose,
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-[70] bg-black/60 transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-label="Close menu"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside
        className={cn(
          "provincial-nav-drawer fixed left-0 top-0 z-[80] flex h-full w-[min(320px,92vw)] flex-col border-r border-indigo-500/25 bg-gradient-to-b from-slate-950 via-indigo-950/95 to-purple-950/95 shadow-2xl transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          {header}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/90">
            Provincial Portal
          </p>
          <nav role="navigation" aria-label="Mobile provincial navigation">
            <ul className="space-y-1" role="menu">
              {PROVINCIAL_NAV_ITEMS.map((item) => (
                <DrawerNavRow key={item.title} item={item} ctx={ctx} />
              ))}
            </ul>
          </nav>
        </div>

        {footer && <div className="border-t border-white/10 p-3">{footer}</div>}
      </aside>
    </>
  );
}

function DrawerNavRow({ item, ctx }: { item: NavItem; ctx: NavRenderContext }) {
  const isExpanded = ctx.openDropdown === item.title;
  const isActive = ctx.activeTab === item.title;

  if (!item.hasDropdown) {
    return (
      <li role="none">
        <Link
          href={item.link}
          role="menuitem"
          className={cn(
            "provincial-nav-mobile-item block rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors duration-200",
            isActive && "provincial-nav-mobile-item-active"
          )}
          onClick={ctx.onNavigate}
        >
          {item.title}
        </Link>
      </li>
    );
  }

  return (
    <li role="none" className="rounded-lg border border-white/5">
      <button
        type="button"
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={isExpanded}
        className={cn(
          "provincial-nav-mobile-item flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold uppercase tracking-wide transition-colors duration-200",
          (isActive || isExpanded) && "provincial-nav-mobile-item-active"
        )}
        onClick={() => ctx.toggleDropdown(item.title)}
      >
        {item.title}
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isExpanded && "rotate-180")}
          aria-hidden
        />
      </button>
      <ul
        className={cn(
          "space-y-0.5 overflow-hidden border-t border-white/5 px-2 transition-all duration-200",
          isExpanded ? "max-h-96 py-2 opacity-100" : "max-h-0 border-transparent py-0 opacity-0"
        )}
        role="menu"
        aria-label={`${item.title} submenu`}
      >
        {item.children?.map((child) => (
          <li key={child.href + child.label} role="none">
            <Link
              href={child.href}
              role="menuitem"
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors duration-200",
                isChildActive(ctx.pathname, child.href)
                  ? "bg-amber-400/15 text-amber-100"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
              onClick={ctx.onNavigate}
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

/** @deprecated Use ProvincialNavBar */
export function SiteMegaNav() {
  return <ProvincialNavBar variant="desktop" className="hidden xl:block" />;
}
