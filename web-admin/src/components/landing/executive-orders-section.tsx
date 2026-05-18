import Link from "next/link";
import Image from "next/image";
import { ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExecutiveOrder } from "@/types";

export function ExecutiveOrdersSection({ orders }: { orders: ExecutiveOrder[] }) {
  const items = orders.slice(0, 16);

  if (!items.length) return null;

  return (
    <section id="executive-orders" className="scroll-mt-24">
      <div className="mb-5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
          <ScrollText className="h-3.5 w-3.5" />
          Executive Orders
        </span>
        <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
          Official Executive Issuances
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          Provincial executive orders published by the Information Office.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {items.map((order) => (
          <article
            key={order.id}
            className="flex flex-col overflow-hidden rounded-xl border border-cyan-500/15 bg-slate-950/60"
          >
            <div className="relative aspect-[4/5] w-full bg-slate-900">
              <Image
                src={order.image_url}
                alt={order.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-3">
              {order.order_number && (
                <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-400/90">
                  {order.order_number}
                </p>
              )}
              <h3 className="mt-1 line-clamp-2 flex-1 text-xs font-bold leading-snug text-cyan-50 sm:text-sm">
                {order.title}
              </h3>
              <Link href={`/executive-orders/${order.id}`} className="mt-3 block">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Explore
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href="/executive-orders">
          <Button variant="gov" size="sm">
            View all executive orders
          </Button>
        </Link>
      </div>
    </section>
  );
}
