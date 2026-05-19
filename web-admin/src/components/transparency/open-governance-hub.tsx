import Link from "next/link";
import {
  FileText,
  Megaphone,
  Newspaper,
  Scale,
  Shield,
  MessageSquare,
  Briefcase,
  Radio,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { OPEN_GOVERNANCE_INTRO } from "@/lib/transparency-content";
import { SITE_ROUTES } from "@/lib/site-navigation";

const PORTAL_LINKS = [
  { label: "Data Privacy Notice", href: SITE_ROUTES.dataPrivacy, icon: Shield, description: "Personal data handling" },
  { label: "Citizen Charter", href: SITE_ROUTES.citizenCharter, icon: Scale, description: "Service standards" },
  { label: "Provincial News", href: SITE_ROUTES.news, icon: Newspaper, description: "Official PIO releases" },
  { label: "Announcements", href: SITE_ROUTES.announcements, icon: Megaphone, description: "Hiring, advisories, events" },
  { label: "Executive Orders", href: SITE_ROUTES.executiveOrders, icon: FileText, description: "Signed provincial orders" },
  { label: "Complaint Tracking", href: SITE_ROUTES.complaints, icon: MessageSquare, description: "File and track concerns" },
  { label: "Job Applications", href: SITE_ROUTES.jobApplications, icon: Briefcase, description: "Provincial hiring" },
  { label: "Public Broadcasts", href: SITE_ROUTES.publicBroadcasts, icon: Radio, description: "Citizen advisories" },
  { label: "Emergency Alerts", href: SITE_ROUTES.emergencyAlerts, icon: AlertTriangle, description: "DRRM warnings" },
] as const;

export function OpenGovernanceHub() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-cyan-500/15 bg-slate-900/50 p-6">
        <h2 className="text-lg font-bold text-white">{OPEN_GOVERNANCE_INTRO.sections[0].title}</h2>
        {OPEN_GOVERNANCE_INTRO.sections[0].paragraphs.map((p) => (
          <p key={p.slice(0, 32)} className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            {p}
          </p>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-amber-300/90">
          Transparency channels
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {PORTAL_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link href={link.href} className="group block h-full">
                  <Card className="h-full border-slate-700/60 bg-slate-900/40 transition group-hover:border-cyan-500/35">
                    <CardContent className="flex gap-3 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300 group-hover:bg-cyan-500/20">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white group-hover:text-cyan-100">{link.label}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{link.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
