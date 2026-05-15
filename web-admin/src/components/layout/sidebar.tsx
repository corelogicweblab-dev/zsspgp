"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  MessageSquareWarning,
  AlertTriangle,
  Users,
  Bell,
  Settings,
  FileText,
  Megaphone,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/governor", label: "Governor Dashboard", icon: LayoutDashboard },
  { href: "/admin/department", label: "Department Portal", icon: Building2 },
  { href: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning },
  { href: "/admin/incidents", label: "Incidents (DRRM)", icon: AlertTriangle },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="border-b border-slate-100 p-5">
        <Logo size="sm" href="/admin/governor" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 p-4">
        <p className="text-center text-xs text-slate-400">ZSSPGP v1.0 MVP</p>
      </div>
    </aside>
  );
}
