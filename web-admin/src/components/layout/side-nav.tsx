"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  Newspaper,
  Megaphone,
  MessageSquareWarning,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Building2,
  AlertTriangle,
  Users,
  Bell,
  Settings,
  Info,
} from "lucide-react";
import Image from "next/image";
import { LOGO_PATH, APP_SHORT } from "@/lib/constants";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };

const publicNav: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/news", label: "News & Information", icon: Newspaper },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
  { href: "/complaints", label: "File Complaint", icon: MessageSquareWarning },
  { href: "/dashboard", label: "My Dashboard", icon: LayoutDashboard },
];

const authNav: NavItem[] = [
  { href: "/login", label: "Login", icon: LogIn },
  { href: "/login/information", label: "Information Office Login", icon: Info },
  { href: "/register", label: "Register", icon: UserPlus },
];

const adminNav: NavItem[] = [
  { href: "/admin/governor", label: "Governor Dashboard", icon: LayoutDashboard },
  { href: "/admin/department", label: "Department Portals", icon: Building2 },
  { href: "/admin/news", label: "Manage News (Info Office)", icon: Newspaper },
  { href: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning },
  { href: "/admin/incidents", label: "DRRM Incidents", icon: AlertTriangle },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <div className="mb-4">
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500/80">
        {title}
      </p>
      <nav className="space-y-0.5">
        {items.map((item, i) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ x: 6 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  active
                    ? "bg-gradient-to-r from-cyan-500/25 to-indigo-500/20 text-cyan-100 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-cyan-400"
                  />
                )}
                <Icon className={cn("h-4 w-4 shrink-0", active && "text-cyan-400")} />
                <span className="truncate">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function SideNav() {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-cyan-500/20 glass-panel">
      <Link href="/" className="border-b border-cyan-500/15 p-4">
        <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
          <Image
            src={LOGO_PATH}
            alt={APP_SHORT}
            width={52}
            height={52}
            className="logo-glow logo-float rounded-full object-contain"
            priority
          />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-cyan-400/90">
              Zamboanga Sibugay
            </p>
            <p className="truncate text-sm font-bold text-white">{APP_SHORT}</p>
          </div>
        </motion.div>
      </Link>
      <div className="flex-1 overflow-y-auto p-3 pt-4">
        <NavSection title="Public" items={publicNav} />
        <NavSection title="Account" items={authNav} />
        <NavSection title="Governance" items={adminNav} />
      </div>
    </aside>
  );
}
