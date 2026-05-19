"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ExecutiveOrder } from "@/types";

const empty = {
  title: "",
  summary: "",
  order_number: "",
  document_url: "",
  image_url: "",
  publish: true,
};

export function PioExecutiveOrdersManager() {
  const [orders, setOrders] = useState<ExecutiveOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pio/executive-orders?admin=true");
      const data = (await res.json()) as { orders?: ExecutiveOrder[] };
      setOrders(data.orders ?? []);
    } catch {
      setError("Failed to load executive orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/pio/executive-orders/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
      setForm((f) => ({ ...f, image_url: data.url! }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.image_url) {
      setError("Title and cover image are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/pio/executive-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          summary: form.summary,
          order_number: form.order_number,
          document_url: form.document_url || null,
          image_url: form.image_url,
          is_published: form.publish,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setForm(empty);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this executive order?")) return;
    await fetch(`/api/pio/executive-orders/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          Publish executive orders (4×4 grid on home between Contact and Governor).
        </p>
        <Button variant="gov" className="gap-2" onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4" />
          {showForm ? "Close form" : "Add executive order"}
        </Button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {showForm && (
        <Card className="border-amber-500/25">
          <CardHeader>
            <CardTitle>New executive order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Order number</Label>
                <Input
                  value={form.order_number}
                  onChange={(e) => setForm((f) => ({ ...f, order_number: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Summary</Label>
                <Textarea
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                  rows={6}
                  placeholder="Use blank lines between paragraphs. Bullet lines: - item or 1. item"
                  className="leading-relaxed"
                />
              </div>
              <div className="space-y-2">
                <Label>Document URL (optional PDF link)</Label>
                <Input
                  value={form.document_url}
                  onChange={(e) => setForm((f) => ({ ...f, document_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Cover image *</Label>
                <Input type="file" accept="image/*" disabled={uploading} onChange={onCoverUpload} />
                {form.image_url && (
                  <div className="relative mt-2 h-32 w-48 overflow-hidden rounded-lg">
                    <Image src={form.image_url} alt="" fill className="object-cover" sizes="192px" />
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.publish}
                  onChange={(e) => setForm((f) => ({ ...f, publish: e.target.checked }))}
                />
                Publish on home page
              </label>
              <Button type="submit" variant="gov" disabled={saving || uploading}>
                {saving ? "Saving…" : "Save executive order"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-400" />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {orders.map((o) => (
            <li key={o.id} className="relative rounded-lg border border-white/10 bg-slate-900/50 p-2">
              <div className="relative mb-2 aspect-[4/5] overflow-hidden rounded-md">
                <Image src={o.image_url} alt="" fill className="object-cover" sizes="120px" />
              </div>
              <p className="line-clamp-2 text-xs font-medium text-slate-200">{o.title}</p>
              <button
                type="button"
                onClick={() => remove(o.id)}
                className="absolute right-2 top-2 rounded bg-red-600/90 p-1 text-white"
                aria-label="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
