"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PioCarouselSlide } from "@/types";

const MAX = 16;

export function PioCarouselManager() {
  const [slides, setSlides] = useState<PioCarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pio/carousel?admin=true");
      const data = (await res.json()) as { slides?: PioCarouselSlide[] };
      setSlides(data.slides ?? []);
    } catch {
      setError("Failed to load carousel.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (slides.length >= MAX) {
      setError(`Maximum ${MAX} images.`);
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/pio/carousel/upload", { method: "POST", body: fd });
      const upData = (await up.json()) as { url?: string; error?: string };
      if (!up.ok || !upData.url) throw new Error(upData.error ?? "Upload failed");

      const res = await fetch("/api/pio/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || null, caption: caption || null, image_url: upData.url }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setTitle("");
      setCaption("");
      e.target.value = "";
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this slide?")) return;
    await fetch(`/api/pio/carousel/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <Card className="border-cyan-500/25">
      <CardHeader>
        <CardTitle>Homepage image carousel</CardTitle>
        <CardDescription>
          Up to {MAX} images after Provincial Updates ({slides.length}/{MAX}).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="carousel-title">Title (optional)</Label>
            <Input id="carousel-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carousel-caption">Caption (optional)</Label>
            <Input id="carousel-caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="carousel-file">Upload image</Label>
            <Input
              id="carousel-file"
              type="file"
              accept="image/*"
              disabled={uploading || slides.length >= MAX}
              onChange={onUpload}
            />
          </div>
        </div>

        {loading ? (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-400" />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {slides.map((s) => (
              <li key={s.id} className="relative overflow-hidden rounded-lg border border-white/10">
                <div className="relative aspect-video">
                  <Image src={s.image_url} alt="" fill className="object-cover" sizes="160px" />
                </div>
                <p className="truncate px-2 py-1 text-xs text-slate-300">{s.title ?? "Untitled"}</p>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  className="absolute right-1 top-1 rounded bg-red-600/90 p-1 text-white"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
