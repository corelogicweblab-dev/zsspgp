import Link from "next/link";
import { ArrowRight, MapPin, Sprout, Palmtree } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE_ROUTES } from "@/lib/site-navigation";

const HIGHLIGHTS = [
  {
    title: "Provincial Tourism",
    description:
      "Discover attractions, festivals, and investment opportunities across all 16 municipalities of Zamboanga Sibugay.",
    href: "/admin/department/tourism",
    icon: Palmtree,
    cta: "Tourism Office",
  },
  {
    title: "Agriculture & Fisheries",
    description:
      "Programs supporting farmers, fisherfolk, and agri-enterprise development province-wide.",
    href: "/admin/department/agriculture",
    icon: Sprout,
    cta: "Agriculture Office",
  },
  {
    title: "Capitol & Infrastructure",
    description:
      "Ongoing capitol improvements, road networks, and community facilities tracked through provincial modules.",
    href: SITE_ROUTES.home + "#modules",
    icon: MapPin,
    cta: "View modules",
  },
] as const;

export function TourismProjectsShowcase() {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-slate-300">
        Explore provincial programs, tourism destinations, and development initiatives. Official project
        updates are published through the Provincial Information Office and department portals.
      </p>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {HIGHLIGHTS.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.title}>
              <Card className="h-full border-amber-500/15 bg-slate-900/40 transition hover:border-amber-500/30">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-slate-400">{item.description}</p>
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex items-center text-sm font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    {item.cta}
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
                  </Link>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap gap-3">
        <Link
          href={SITE_ROUTES.news}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-cyan-500/30 text-cyan-100")}
        >
          Provincial news
        </Link>
        <Link
          href={SITE_ROUTES.announcements}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-cyan-500/30 text-cyan-100")}
        >
          All announcements
        </Link>
        <Link
          href={SITE_ROUTES.executiveOrders}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-cyan-500/30 text-cyan-100")}
        >
          Executive orders
        </Link>
      </div>
    </div>
  );
}
