"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Building2,
  Megaphone,
  MessageSquareWarning,
  Newspaper,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HubModule = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

/** Full provincial oversight: every admin route + key public surfaces. */
const GOVERNOR_MODULES: HubModule[] = [
  {
    href: "/admin/complaints",
    title: "Complaints command",
    description: "All citizen complaints — triage, assign departments, resolve province-wide.",
    icon: MessageSquareWarning,
  },
  {
    href: "/admin/incidents",
    title: "DRRM & incidents",
    description: "Emergency incidents, severity, and response coordination.",
    icon: AlertTriangle,
  },
  {
    href: "/admin/department",
    title: "Department portals",
    description: "DRRM, Health, Tourism, Agriculture, ICT, Information — unified access.",
    icon: Building2,
  },
  {
    href: "/admin/news",
    title: "News & information",
    description: "Publish and manage official provincial news and releases.",
    icon: Newspaper,
  },
  {
    href: "/admin/users",
    title: "Users & roles",
    description: "RBAC, officials, staff, and citizens — full directory control.",
    icon: Users,
  },
  {
    href: "/admin/notifications",
    title: "Notifications",
    description: "Alerts, broadcasts, and system communications.",
    icon: Bell,
  },
  {
    href: "/admin/settings",
    title: "Platform settings",
    description: "Enterprise configuration and governance preferences.",
    icon: Settings,
  },
  {
    href: "/news",
    title: "Public news (view)",
    description: "See the live site as citizens see official information.",
    icon: Newspaper,
  },
  {
    href: "/announcements",
    title: "Announcements",
    description: "Provincial announcements and public advisories.",
    icon: Megaphone,
  },
  {
    href: "/complaints",
    title: "Citizen intake",
    description: "Complaint submission experience for transparency review.",
    icon: MessageSquareWarning,
  },
];

export function GovernorCommandHub() {
  return (
    <section className="mb-10">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/35 bg-amber-500/10">
          <Shield className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Executive command functions</h2>
          <p className="text-sm text-slate-400">
            Governor Super Admin — full access to all provincial operations and public channels.
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {GOVERNOR_MODULES.map((mod, i) => {
          const Icon = mod.icon;
          const primary = mod.href.startsWith("/admin");
          return (
            <motion.div
              key={mod.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3 }}
            >
              <Link href={mod.href} className="block h-full">
                <Card
                  className={cn(
                    "glass-panel-hover h-full transition-colors",
                    primary
                      ? "border-cyan-500/25 hover:border-cyan-400/45"
                      : "border-slate-600/40 hover:border-slate-500/55"
                  )}
                >
                  <CardContent className="flex h-full flex-col p-4">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <Icon
                        className={cn(
                          "h-8 w-8 shrink-0",
                          primary ? "text-cyan-400" : "text-slate-400"
                        )}
                      />
                      {primary && (
                        <span className="rounded bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
                          Admin
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-cyan-50">{mod.title}</h3>
                    <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-400">
                      {mod.description}
                    </p>
                    <p className="mt-3 text-xs font-medium text-cyan-500/90">Open workspace →</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
