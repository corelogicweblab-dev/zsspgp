import { Megaphone } from "lucide-react";
import { MOCK_ANNOUNCEMENTS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { CitizenPage } from "@/components/layout/citizen-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AnnouncementsPage() {
  const announcements = MOCK_ANNOUNCEMENTS.filter((a) => a.is_published);

  return (
    <CitizenPage
      title="Provincial Announcements"
      subtitle="Official updates from the Provincial Government of Zamboanga Sibugay"
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {announcements.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  {item.published_at && (
                    <p className="mt-1 text-xs text-slate-500">
                      Published {formatDate(item.published_at)}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="default">Official</Badge>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                {item.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </CitizenPage>
  );
}
