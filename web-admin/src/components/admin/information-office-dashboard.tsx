"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  ExternalLink,
  Megaphone,
} from "lucide-react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/news/rich-text-editor";
import { NewsMediaUpload } from "@/components/news/news-media-upload";
import { NewsCoverImage } from "@/components/news/news-cover-image";
import { NewsShareBar } from "@/components/news/news-share-bar";
import { LOGO_PATH } from "@/lib/constants";
import {
  createNewsViaApi,
  deleteNewsViaApi,
  fetchNewsAdmin,
  updateNewsViaApi,
  uploadNewsCoverImage,
} from "@/services/news.client";
import { formatDateTime } from "@/lib/utils";
import { PioAnnouncementsManager } from "@/components/admin/pio-announcements-manager";
import { PioCarouselManager } from "@/components/admin/pio-carousel-manager";
import { PioExecutiveOrdersManager } from "@/components/admin/pio-executive-orders-manager";
import { cn } from "@/lib/utils";
import type { NewsArticle, NewsMediaType } from "@/types";

type PioTab = "news" | "announcements" | "carousel" | "executive-orders";

function toDatetimeLocalValue(iso: string | null): string {
  const d = iso ? new Date(iso) : new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

const emptyForm = {
  headline: "",
  summary: "",
  content: "",
  coverUrl: "",
  coverFile: null as File | null,
  coverPreview: null as string | null,
  mediaUrl: "",
  mediaType: null as NewsMediaType,
  publishedAtLocal: toDatetimeLocalValue(null),
  publish: true,
  featured: false,
};

export function InformationOfficeDashboard() {
  const [activeTab, setActiveTab] = useState<PioTab>("news");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [authorLabel, setAuthorLabel] = useState("Information Office");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadArticles = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await fetchNewsAdmin();
      setArticles(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load articles.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void loadArticles();
    void (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("users")
        .select("full_name, email")
        .eq("id", user.id)
        .single();
      if (data?.full_name) setAuthorLabel(data.full_name);
      else if (data?.email) setAuthorLabel(data.email);
    })();
  }, [loadArticles]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError(null);
  }

  function startCreate() {
    setForm({ ...emptyForm, publishedAtLocal: toDatetimeLocalValue(null) });
    setEditingId(null);
    setShowForm(true);
    setSuccess(null);
  }

  function startEdit(article: NewsArticle) {
    setForm({
      headline: article.title,
      summary: article.summary ?? "",
      content: article.content,
      coverUrl: article.cover_image_url ?? "",
      coverFile: null,
      coverPreview: null,
      mediaUrl: article.media_url ?? "",
      mediaType: article.media_type ?? null,
      publishedAtLocal: toDatetimeLocalValue(article.published_at),
      publish: article.is_published,
      featured: article.is_featured,
    });
    setEditingId(article.id);
    setShowForm(true);
    setSuccess(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      let coverUrl = form.coverUrl.trim() || null;
      if (form.coverFile) {
        coverUrl = await uploadNewsCoverImage(form.coverFile);
      }

      const publishedIso = form.publishedAtLocal
        ? new Date(form.publishedAtLocal).toISOString()
        : null;

      const payload = {
        headline: form.headline.trim(),
        summary: form.summary.trim() || null,
        content: form.content,
        cover_image_url: coverUrl,
        media_url: form.mediaUrl || null,
        media_type: form.mediaType,
        is_published: form.publish,
        is_featured: form.featured,
        published_at: publishedIso,
      };

      if (editingId) {
        await updateNewsViaApi(editingId, payload);
        setSuccess("Article updated successfully.");
      } else {
        await createNewsViaApi(payload);
        setSuccess("Article published successfully.");
      }

      resetForm();
      await loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setError(null);
    try {
      await deleteNewsViaApi(id);
      if (editingId === id) resetForm();
      await loadArticles();
      setSuccess("Article deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <AdminShell
      title="Provincial Information Dashboard"
      subtitle="Information Office — news headlines, hiring & announcements, public communications"
    >
      <div className="pio-dashboard-hero mb-6 flex flex-col gap-4 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-indigo-950/40 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <Image src={LOGO_PATH} alt="" width={56} height={56} className="shrink-0 rounded-full object-contain" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">INFO · PIO</p>
          <h2 className="text-lg font-bold text-white sm:text-xl">Communications Control Center</h2>
          <p className="mt-1 text-sm text-slate-400">
            News articles, hiring posts, advisories, and official announcements.
          </p>
        </div>
        {activeTab === "news" && (
          <Button variant="gov" className="w-full shrink-0 gap-2 sm:w-auto" onClick={startCreate}>
            <Plus className="h-4 w-4" />
            New article
          </Button>
        )}
      </div>

      <div
        className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-cyan-500/20 bg-slate-900/50 p-1 scrollbar-thin"
        role="tablist"
        aria-label="PIO content type"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "news"}
          className={cn(
            "shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
            activeTab === "news"
              ? "bg-cyan-600 text-white"
              : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
          )}
          onClick={() => setActiveTab("news")}
        >
          News & headlines
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "announcements"}
          className={cn(
            "shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
            activeTab === "announcements"
              ? "bg-amber-600 text-white"
              : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
          )}
          onClick={() => setActiveTab("announcements")}
        >
          Announcements & hiring
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "carousel"}
          className={cn(
            "shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
            activeTab === "carousel"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
          )}
          onClick={() => setActiveTab("carousel")}
        >
          Image carousel
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "executive-orders"}
          className={cn(
            "shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
            activeTab === "executive-orders"
              ? "bg-purple-600 text-white"
              : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
          )}
          onClick={() => setActiveTab("executive-orders")}
        >
          Executive orders
        </button>
      </div>

      {activeTab === "announcements" ? (
        <PioAnnouncementsManager />
      ) : activeTab === "carousel" ? (
        <PioCarouselManager />
      ) : activeTab === "executive-orders" ? (
        <PioExecutiveOrdersManager />
      ) : (
        <>
      {(error || success) && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            error
              ? "border-red-500/40 bg-red-500/10 text-red-300"
              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {error ?? success}
        </div>
      )}

      {showForm && (
        <Card className="mb-8 border-cyan-500/25">
          <CardHeader>
            <CardTitle>{editingId ? "Edit News Article" : "Add News Article"}</CardTitle>
            <CardDescription>
              Author: <span className="text-cyan-200">{authorLabel}</span> (from your account)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={form.headline}
                  onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
                  required
                  placeholder="Official provincial headline"
                  className="text-base font-semibold"
                />
              </div>

              <NewsMediaUpload
                label="Cover image (headline thumbnail)"
                coverUrl={form.coverUrl}
                coverPreview={form.coverPreview}
                coverFile={form.coverFile}
                mediaUrl={form.mediaUrl}
                mediaType={form.mediaType}
                disabled={saving}
                onCoverUrlChange={(coverUrl) => setForm((f) => ({ ...f, coverUrl }))}
                onCoverFileChange={(coverFile, coverPreview) =>
                  setForm((f) => ({ ...f, coverFile, coverPreview }))
                }
                onMediaChange={(mediaUrl, mediaType) =>
                  setForm((f) => ({
                    ...f,
                    mediaUrl: mediaUrl ?? "",
                    mediaType,
                  }))
                }
              />

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                  rows={2}
                  placeholder="Short preview for cards and headlines"
                />
              </div>

              <div className="space-y-2">
                <Label>Full content</Label>
                <RichTextEditor
                  value={form.content}
                  onChange={(content) => setForm((f) => ({ ...f, content }))}
                  minHeight="220px"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="publishedAt">Publish date & time</Label>
                  <Input
                    id="publishedAt"
                    type="datetime-local"
                    value={form.publishedAtLocal}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, publishedAtLocal: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="flex flex-col justify-end gap-3 sm:pb-1">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={form.publish}
                      onChange={(e) => setForm((f) => ({ ...f, publish: e.target.checked }))}
                    />
                    Publish to public headlines
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    />
                    Feature on home page
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" variant="gov" disabled={saving} className="gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Save changes" : "Publish article"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-cyan-400" />
              News articles
            </CardTitle>
            <CardDescription>Headline, thumbnail, date, author — edit or delete</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {loadingList ? (
            <p className="flex items-center gap-2 py-12 text-center text-slate-500 justify-center">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading…
            </p>
          ) : articles.length === 0 ? (
            <p className="py-12 text-center text-slate-500">No articles yet. Create your first headline.</p>
          ) : (
            <div className="space-y-3">
              {articles.map((a) => (
                <article
                  key={a.id}
                  className="flex flex-col gap-3 rounded-xl border border-cyan-500/20 bg-slate-900/30 p-4 sm:flex-row sm:items-center"
                >
                  {a.cover_image_url && (
                    <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg bg-slate-900 sm:h-16 sm:w-24">
                      <NewsCoverImage src={a.cover_image_url} className="object-cover" sizes="96px" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-cyan-50 line-clamp-2">{a.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {a.is_published ? "Published" : "Draft"} ·{" "}
                      {formatDateTime(a.published_at ?? a.created_at)}
                      {a.author?.full_name && ` · ${a.author.full_name}`}
                    </p>
                    {a.is_published && (
                      <div className="mt-2">
                        <NewsShareBar articleId={a.id} title={a.title} />
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {a.is_published && (
                      <Link href={`/news/${a.id}`} target="_blank">
                        <Button type="button" variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3.5 w-3.5" /> View
                        </Button>
                      </Link>
                    )}
                    <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => startEdit(a)}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="gap-1"
                      onClick={() => void handleDelete(a.id, a.title)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
        </>
      )}
    </AdminShell>
  );
}
