"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelative } from "@/lib/utils";
import type { Notification } from "@/types";

const typeVariant: Record<string, "default" | "danger" | "warning" | "success" | "secondary"> = {
  alert: "danger",
  announcement: "default",
  complaint_update: "warning",
  incident_update: "warning",
  info: "secondary",
  system: "secondary",
};

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unread = items.filter((n) => !n.is_read).length;

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  return (
    <AdminShell
      title="Notifications Center"
      subtitle={`${unread} unread alert${unread === 1 ? "" : "s"}`}
    >
      <div className="mb-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={markAllRead} disabled={unread === 0}>
          <CheckCheck className="h-4 w-4" />
          Mark all read
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((n) => (
          <Card key={n.id} className={!n.is_read ? "border-blue-200 bg-blue-50/30" : ""}>
            <CardContent className="flex gap-4 p-5">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  n.is_read ? "bg-slate-100 text-slate-500" : "bg-blue-100 text-blue-600"
                }`}
              >
                <Bell className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{n.title}</p>
                  <Badge variant={typeVariant[n.type] ?? "secondary"}>{n.type.replace(/_/g, " ")}</Badge>
                  {n.is_broadcast && <Badge variant="outline">Broadcast</Badge>}
                  {!n.is_read && <Badge variant="default">New</Badge>}
                </div>
                <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                <p className="mt-2 text-xs text-slate-400">{formatRelative(n.created_at)}</p>
              </div>
              {!n.is_read && (
                <Button variant="ghost" size="sm" onClick={() => markRead(n.id)}>
                  Mark read
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
