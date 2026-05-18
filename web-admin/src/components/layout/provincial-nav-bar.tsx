"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import {
  PROVINCIAL_NAV_ITEMS,
  PROVINCIAL_NAV_MORE,
  PROVINCIAL_NAV_PRIMARY,
  navDisplayTitle,
  type NavItem,
} from "@/lib/site-navigation";
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

function resolveBarActiveTab(pathname: string): string | null {
  const primary = resolveActiveTab(pathname, PROVINCIAL_NAV_PRIMARY);
  if (primary) return primary;
  if (resolveActiveTab(pathname, PROVINCIAL_NAV_MORE)) return "More";
  return null;
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

type DropdownCoords = { top: number; left?: number; right?: number; minWidth: number };

function useDropdownPosition(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  align: "left" | "right"
): DropdownCoords | null {
  const [coords, setCoords] = useState<DropdownCoords | null>(null);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) {
      setCoords(null);
      return;
    }
    const update = () => {
      const rect = anchorRef.current!.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: align === "left" ? rect.left : undefined,
        right: align === "right" ? window.innerWidth - rect.right : undefined,
        minWidth: Math.max(240, rect.width),
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, align, anchorRef]);

  return coords;
}

function NavDropdownPortal({
  open,
  anchorRef,
  align,
  id,
  ariaLabel,
  children,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  align: "left" | "right";
  id: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  const coords = useDropdownPosition(open, anchorRef, align);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open || !coords) return null;

  const style: CSSProperties = {
    position: "fixed",
    top: coords.top,
    left: coords.left,
    right: coords.right,
    minWidth: coords.minWidth,
    zIndex: 400,
  };

  return createPortal(
    <div
      id={id}
      role="menu"
      aria-label={ariaLabel}
      style={style}
      className="provincial-nav-dropdown-portal"
    >
      {children}
    </div>,
    document.body
  );
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

function NavDropdownMenuItem({
  item,
  ctx,
  alignDropdown = "left",
}: {
  item: NavItem;
  ctx: NavRenderContext;
  alignDropdown?: "left" | "right";
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const label = navDisplayTitle(item);
  const isActive = ctx.activeTab === item.title;
  const isOpen = ctx.openDropdown === item.title;
  const submenuId = `nav-submenu-${slugify(item.title)}`;

  return (
    <li
      role="none"
      className="relative flex shrink-0 items-stretch"
      onMouseEnter={() => !ctx.lite && ctx.openDropdownFor(item.title)}
    >
      <button
        ref={buttonRef}
        type="button"
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={submenuId}
        className={cn(
          "provincial-nav-item flex items-center gap-0.5 whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all duration-200 sm:px-3 lg:px-3.5 lg:text-xs",
          (isActive || isOpen) && "provincial-nav-item-active"
        )}
        onClick={() => ctx.toggleDropdown(item.title)}
        onFocus={() => !ctx.lite && ctx.openDropdownFor(item.title)}
      >
        {label}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")}
          aria-hidden
        />
      </button>
      <NavDropdownPortal
        open={isOpen}
        anchorRef={buttonRef}
        align={alignDropdown}
        id={submenuId}
        ariaLabel={`${item.title} submenu`}
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
      </NavDropdownPortal>
    </li>
  );
}

export function createNavItem(
  item: NavItem,
  ctx: NavRenderContext,
  options?: { alignDropdown?: "left" | "right" }
): ReactNode {
  const label = navDisplayTitle(item);
  const isActive = ctx.activeTab === item.title;
  const isAlert = item.title === "Emergency Alerts";

  if (!item.hasDropdown) {
    return (
      <li key={item.title} role="none" className="relative flex shrink-0 items-stretch">
        <Link
          href={item.link}
          role="menuitem"
          className={cn(
            "provincial-nav-item flex items-center whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all duration-200 sm:px-3 lg:px-3.5 lg:text-xs",
            isAlert && "provincial-nav-item--alert",
            isActive && "provincial-nav-item-active"
          )}
          onClick={() => {
            ctx.setActiveTab(item.title);
            ctx.onNavigate?.();
          }}
        >
          {label}
        </Link>
      </li>
    );
  }

  return (
    <NavDropdownMenuItem
      key={item.title}
      item={item}
      ctx={ctx}
      alignDropdown={options?.alignDropdown}
    />
  );
}

const MORE_MENU_ID = "More";

function NavMoreMenuItem({ moreItems, ctx }: { moreItems: NavItem[]; ctx: NavRenderContext }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isOpen = ctx.openDropdown === MORE_MENU_ID;
  const isActive = ctx.activeTab === MORE_MENU_ID;

  return (
    <li
      role="none"
      className="relative flex shrink-0 items-stretch"
      onMouseEnter={() => !ctx.lite && ctx.openDropdownFor(MORE_MENU_ID)}
    >
      <button
        ref={buttonRef}
        type="button"
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="nav-submenu-more"
        className={cn(
          "provincial-nav-item provincial-nav-item--more flex items-center gap-0.5 whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all duration-200 sm:px-3 lg:px-3.5 lg:text-xs",
          (isActive || isOpen) && "provincial-nav-item-active"
        )}
        onClick={() => ctx.toggleDropdown(MORE_MENU_ID)}
      >
        More
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")}
          aria-hidden
        />
      </button>
      <NavDropdownPortal
        open={isOpen}
        anchorRef={buttonRef}
        align="right"
        id="nav-submenu-more"
        ariaLabel="More provincial sections"
      >
        <div className="provincial-nav-dropdown-panel provincial-nav-mega-panel max-h-[min(70vh,28rem)] overflow-y-auto rounded-xl border border-cyan-400/25 bg-slate-950/98 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          {moreItems.map((section) => (
            <div key={section.title} className="border-b border-white/5 py-2 last:border-0 last:pb-0 first:pt-0">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.children?.map((child) => {
                  const childActive = isChildActive(ctx.pathname, child.href);
                  return (
                    <li key={child.href + child.label}>
                      <Link
                        href={child.href}
                        role="menuitem"
                        className={cn(
                          "block rounded-md px-2.5 py-2 text-sm transition-colors",
                          childActive
                            ? "bg-amber-400/15 text-amber-100"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        )}
                        onClick={ctx.onNavigate}
                      >
                        {child.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </NavDropdownPortal>
    </li>
  );
}

function createMoreNavItem(moreItems: NavItem[], ctx: NavRenderContext): ReactNode {
  return <NavMoreMenuItem moreItems={moreItems} ctx={ctx} />;
}

export function renderNavBar(
  primaryItems: NavItem[],
  moreItems: NavItem[],
  ctx: NavRenderContext
): ReactNode {
  return (
    <ul role="menubar" className="flex flex-nowrap items-center justify-center gap-0.5 sm:gap-1">
      {primaryItems.map((item, index) =>
        createNavItem(item, ctx, {
          alignDropdown: index >= primaryItems.length - 2 ? "right" : "left",
        })
      )}
      {moreItems.length > 0 && createMoreNavItem(moreItems, ctx)}
    </ul>
  );
}

type ProvincialNavBarProps = {
  className?: string;
};

export function ProvincialNavBar({ className }: ProvincialNavBarProps) {
  const pathname = usePathname();
  const lite = usePerformanceMode();
  const routeActive = useMemo(() => resolveBarActiveTab(pathname), [pathname]);
  const [activeTab, setActiveTabState] = useState<string | null>(routeActive);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
          {renderNavBar(PROVINCIAL_NAV_PRIMARY, PROVINCIAL_NAV_MORE, ctx)}
        </div>
      </div>
    </nav>
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
  return <ProvincialNavBar className="hidden md:block" />;
}

