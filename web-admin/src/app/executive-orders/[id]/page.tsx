import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { CitizenPage } from "@/components/layout/citizen-page";
import { Button } from "@/components/ui/button";
import { getExecutiveOrderById } from "@/services/pio-content.service";
import { formatDate } from "@/lib/utils";

export default async function ExecutiveOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getExecutiveOrderById(id);
  if (!order) notFound();

  return (
    <CitizenPage title={order.title} subtitle="Executive Order" maxWidth="lg">
      <Link
        href="/executive-orders"
        className="mb-6 inline-flex items-center gap-1 text-sm text-cyan-400 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> All executive orders
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="relative aspect-[16/10] w-full bg-slate-100">
          <Image src={order.image_url} alt="" fill className="object-cover" priority sizes="800px" />
        </div>
        <div className="space-y-4 p-5 sm:p-8">
          {order.order_number && (
            <p className="text-sm font-semibold text-cyan-700">{order.order_number}</p>
          )}
          {order.published_at && (
            <p className="text-xs text-slate-500">Published {formatDate(order.published_at)}</p>
          )}
          {order.summary && (
            <p className="text-sm leading-relaxed text-slate-600">{order.summary}</p>
          )}
          {order.document_url && (
            <a href={order.document_url} target="_blank" rel="noopener noreferrer">
              <Button variant="gov" className="gap-2">
                Open full document <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </CitizenPage>
  );
}
