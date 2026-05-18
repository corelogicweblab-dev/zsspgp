import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ExecutiveOrder, PioCarouselSlide } from "@/types";

const CAROUSEL_SELECT =
  "id, title, caption, image_url, sort_order, is_published, created_at";
const EO_SELECT =
  "id, title, summary, image_url, document_url, order_number, published_at, is_published, sort_order, created_at";

export async function getPublishedCarouselSlides(limit = 16): Promise<PioCarouselSlide[]> {
  const db = createAdminClient() ?? (await createClient());
  const { data, error } = await db
    .from("pio_carousel_slides")
    .select(CAROUSEL_SELECT)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data?.length) return [];
  return data as PioCarouselSlide[];
}

export async function getPublishedExecutiveOrders(limit = 16): Promise<ExecutiveOrder[]> {
  const db = createAdminClient() ?? (await createClient());
  const { data, error } = await db
    .from("executive_orders")
    .select(EO_SELECT)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data?.length) return [];
  return data as ExecutiveOrder[];
}

export async function getExecutiveOrderById(id: string): Promise<ExecutiveOrder | null> {
  const db = createAdminClient() ?? (await createClient());
  const { data } = await db
    .from("executive_orders")
    .select(EO_SELECT)
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  return (data as ExecutiveOrder) ?? null;
}

export async function getAllPublishedExecutiveOrders(): Promise<ExecutiveOrder[]> {
  return getPublishedExecutiveOrders(100);
}
