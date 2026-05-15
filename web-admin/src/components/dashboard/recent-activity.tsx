import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelative, capitalize } from "@/lib/utils";
import type { ActivityLog } from "@/types";

interface RecentActivityProps {
  activities: ActivityLog[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ActivityList activities={activities} />
      </CardContent>
    </Card>
  );
}

function ActivityList({ activities }: { activities: ActivityLog[] }) {
  if (activities.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-500">No recent activity</p>;
  }
  return (
    <div className="space-y-4">
      {activities.map((a) => (
        <div
          key={a.id}
          className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
        >
          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">
              {a.user?.full_name ?? "System"} — {capitalize(a.action)}
            </p>
            <p className="text-xs text-slate-500">{formatRelative(a.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
