import Link from "next/link";
import { Radio, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PublicBroadcast } from "@/types";

export function PublicBroadcastsList({ broadcasts }: { broadcasts: PublicBroadcast[] }) {
  if (broadcasts.length === 0) {
    return (
      <p className="rounded-xl border border-slate-700/60 bg-slate-900/50 px-4 py-10 text-center text-sm text-slate-400">
        No public broadcasts at this time. Check back for official provincial advisories.
      </p>
    );
  }

  return (
    <ul className="space-y-4" role="list" aria-label="Public broadcasts">
      {broadcasts.map((item) => (
        <li key={item.id}>
          <Card className="border-cyan-500/10 bg-slate-900/40">
            <CardHeader className="flex flex-row items-start gap-3 pb-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                <Radio className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base text-white">{item.title}</CardTitle>
                  <Badge variant="outline" className="border-cyan-500/30 text-cyan-200">
                    {item.source}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">{formatDate(item.created_at)}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <p className="text-sm leading-relaxed text-slate-300">{item.message}</p>
              {item.link_url && (
                <Link
                  href={item.link_url}
                  className="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300"
                >
                  View related page
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </Link>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
