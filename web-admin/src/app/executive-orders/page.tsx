import Link from "next/link";
import { FastImage } from "@/components/ui/fast-image";
import { CitizenPage } from "@/components/layout/citizen-page";
import { Button } from "@/components/ui/button";
import { getAllPublishedExecutiveOrders } from "@/services/pio-content.service";

export default async function ExecutiveOrdersPage() {
  const orders = await getAllPublishedExecutiveOrders();

  return (
    <CitizenPage
      title="Executive Orders"
      subtitle="Official provincial executive issuances"
      maxWidth="lg"
    >
      {orders.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
          No executive orders published yet.
        </p>
      ) : (
        <ul className="mx-auto grid max-w-3xl grid-cols-2 gap-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/executive-orders/${order.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-cyan-400/50"
              >
                <div className="relative aspect-square bg-slate-100">
                  <FastImage
                    src={order.image_url}
                    alt={order.title}
                    fill
                    className="object-contain p-1 transition group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 45vw, 280px"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <h2 className="line-clamp-3 text-sm font-bold text-slate-800">{order.title}</h2>
                  <span className="mt-3 inline-block text-xs font-semibold text-cyan-700">
                    Explore →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="outline">Back to home</Button>
        </Link>
      </div>
    </CitizenPage>
  );
}
