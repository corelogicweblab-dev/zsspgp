"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { NewsCoverImage } from "@/components/news/news-cover-image";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareNewsLink } from "@/components/news/share-news-link";
import {
  createNewsArticle,
  fetchAllNewsClient,
  uploadNewsCoverImage,
} from "@/services/news.client";
import { formatDateTime } from "@/lib/utils";
import type { NewsArticle } from "@/types";

function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function AdminNewsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [publishedAtLocal, setPublishedAtLocal] = useState(() => toDatetimeLocalValue(null));
  const [publish, setPublish] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  async function loadArticles() {
    const data = await fetchAllNewsClient();
    setArticles(data);
  }

  useEffect(() => {
    void loadArticles();
  }, []);

  function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setError(null);
  }

  function clearCover() {
    setCoverFile(null);
    setCoverPreview(null);
    setCoverUrl("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLastCreatedId(null);
    setLoading(true);
    try {
      let imageUrl = coverUrl.trim() || null;
      if (coverFile) {
        imageUrl = await uploadNewsCoverImage(coverFile);
      }

      const publishedIso = publishedAtLocal
        ? new Date(publishedAtLocal).toISOString()
        : null;

      const created = await createNewsArticle({
        title: title.trim(),
        summary: summary.trim() || null,
        content: content.trim(),
        cover_image_url: imageUrl,
        is_published: publish,
        is_featured: featured,
        published_at: publishedIso,
      });

      setTitle("");
      setSummary("");
      setContent("");
      clearCover();
      setPublishedAtLocal(toDatetimeLocalValue(null));
      setLastCreatedId(created.id);
      setSuccess("News article saved successfully.");
      await loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish news.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell
      title="Provincial News Management"
      subtitle="Information Office — publish official news and public information"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Publish News Article</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePublish} className="space-y-4">
              {error && (
                <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}
              {success && (
                <div className="space-y-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-300">
                  <p>{success}</p>
                  {lastCreatedId && publish && (
                    <ShareNewsLink articleId={lastCreatedId} size="default" />
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Headline</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label>Cover image</Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleCoverFile}
                />
                {coverPreview ? (
                  <div className="relative overflow-hidden rounded-xl border border-cyan-500/25">
                    <div className="relative aspect-video w-full bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverPreview} alt="Cover preview" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 bg-slate-950/80"
                      onClick={clearCover}
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2 border-dashed"
                    onClick={() => fileRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Upload image
                  </Button>
                )}
                <Label htmlFor="coverUrl" className="text-xs text-slate-500">
                  Or paste image URL
                </Label>
                <Input
                  id="coverUrl"
                  type="url"
                  placeholder="https://..."
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  disabled={Boolean(coverFile)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary (short text)</Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  placeholder="Brief summary for cards and previews"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Full content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="min-h-[140px]"
                  placeholder="Official news body text"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishedAt">Date & time</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  value={publishedAtLocal}
                  onChange={(e) => setPublishedAtLocal(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-500">Shown on the public news page.</p>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
                Publish immediately
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                Feature on home page
              </label>

              <Button type="submit" variant="gov" disabled={loading} className="w-full sm:w-auto">
                {loading ? "Publishing…" : "Publish Article"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Published Articles</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[640px] space-y-3 overflow-y-auto">
            {articles.length === 0 ? (
              <p className="py-8 text-center text-slate-500">No articles yet.</p>
            ) : (
              articles.map((a) => (
                <div
                  key={a.id}
                  className="flex gap-3 rounded-lg border border-cyan-500/20 p-3 sm:p-4"
                >
                  {a.cover_image_url && (
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-900">
                      <NewsCoverImage
                        src={a.cover_image_url}
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-cyan-50">{a.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {a.is_published ? "Published" : "Draft"} ·{" "}
                      {formatDateTime(a.published_at ?? a.created_at)}
                    </p>
                    {a.is_published && (
                      <div className="mt-2">
                        <ShareNewsLink articleId={a.id} />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
