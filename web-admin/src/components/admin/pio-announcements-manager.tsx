"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Loader2, Megaphone, Pencil, Plus, Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/news/rich-text-editor";
import { ANNOUNCEMENT_CATEGORIES, getCategoryLabel } from "@/lib/announcement-categories";
import {
  createAnnouncementViaApi,
  deleteAnnouncementViaApi,
  fetchAnnouncementsAdmin,
  updateAnnouncementViaApi,
} from "@/services/announcements.client";
import { formatDateTime } from "@/lib/utils";
import type { Announcement, AnnouncementCategory } from "@/types";

function toDatetimeLocalValue(iso: string | null): string {
  const d = iso ? new Date(iso) : new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

const emptyForm = {
  title: "",
  content: "",
  category: "general" as AnnouncementCategory,
  linkUrl: "",
  publishedAtLocal: toDatetimeLocalValue(null),
  expiresAtLocal: "",
  publish: true,
};

export function PioAnnouncementsManager() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAnnouncementsAdmin();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setForm({ ...emptyForm, publishedAtLocal: toDatetimeLocalValue(null) });
    setEditingId(null);
    setShowForm(false);
  }

  function startCreate(category: AnnouncementCategory = "general") {
    setForm({
      ...emptyForm,
      category,
      publishedAtLocal: toDatetimeLocalValue(null),
    });
    setEditingId(null);
    setShowForm(true);
    setSuccess(null);
  }

  function startEdit(item: Announcement) {
    setForm({
      title: item.title,
      content: item.content,
      category: item.category ?? "general",
      linkUrl: item.link_url ?? "",
      publishedAtLocal: toDatetimeLocalValue(item.published_at),
      expiresAtLocal: item.expires_at ? toDatetimeLocalValue(item.expires_at) : "",
      publish: item.is_published,
    });
    setEditingId(item.id);
    setShowForm(true);
    setSuccess(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        title: form.title.trim(),
        content: form.content,
        category: form.category,
        link_url: form.linkUrl.trim() || null,
        is_published: form.publish,
        published_at: form.publishedAtLocal
          ? new Date(form.publishedAtLocal).toISOString()
          : null,
        expires_at: form.expiresAtLocal
          ? new Date(form.expiresAtLocal).toISOString()
          : null,
      };

      if (editingId) {
        await updateAnnouncementViaApi(editingId, payload);
        setSuccess("Announcement updated.");
      } else {
        await createAnnouncementViaApi(payload);
        setSuccess("Announcement published.");
      }

      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteAnnouncementViaApi(id);
      if (editingId === id) resetForm();
      await load();
      setSuccess("Announcement deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            <Megaphone className="h-5 w-5 text-amber-400" />
            Provincial announcements
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Hiring, advisories, events, emergencies — separate from news headlines.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="gov" className="gap-2" onClick={() => startCreate("general")}>
            <Plus className="h-4 w-4" />
            New announcement
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-amber-500/40 text-amber-100"
            onClick={() => startCreate("hiring")}
          >
            <Briefcase className="h-4 w-4" />
            Post hiring
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="border-amber-500/25">
          <CardHeader>
            <CardTitle>{editingId ? "Edit announcement" : "New announcement"}</CardTitle>
            <CardDescription>
              Category: {getCategoryLabel(form.category)} — shown on home banner and /announcements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="ann-title">Title</Label>
                  <Input
                    id="ann-title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                    placeholder={
                      form.category === "hiring"
                        ? "HIRING: Position title"
                        : "Official announcement title"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ann-category">Category</Label>
                  <select
                    id="ann-category"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category: e.target.value as AnnouncementCategory,
                      }))
                    }
                    className="w-full rounded-lg border border-cyan-500/25 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                  >
                    {ANNOUNCEMENT_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ann-link">Link URL (optional)</Label>
                  <Input
                    id="ann-link"
                    value={form.linkUrl}
                    onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
                    placeholder="https:// or /announcements"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Details</Label>
                <RichTextEditor
                  value={form.content}
                  onChange={(content) => setForm((f) => ({ ...f, content }))}
                  minHeight="180px"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ann-pub">Publish date & time</Label>
                  <Input
                    id="ann-pub"
                    type="datetime-local"
                    value={form.publishedAtLocal}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, publishedAtLocal: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ann-exp">Expires (optional)</Label>
                  <Input
                    id="ann-exp"
                    type="datetime-local"
                    value={form.expiresAtLocal}
                    onChange={(e) => setForm((f) => ({ ...f, expiresAtLocal: e.target.value }))}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.publish}
                  onChange={(e) => setForm((f) => ({ ...f, publish: e.target.checked }))}
                />
                Publish to public banner and announcements page
              </label>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" variant="gov" disabled={saving} className="gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Save changes" : "Publish"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-base">All announcements</CardTitle>
          <CardDescription>Hiring, advisories, and official notices</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="flex items-center justify-center gap-2 py-10 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading…
            </p>
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-slate-500">
              No announcements yet. Post hiring or general advisories above.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-900/40 p-4 sm:flex-row sm:items-start"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-200">
                        {getCategoryLabel(item.category)}
                      </span>
                      {!item.is_published && (
                        <span className="text-[10px] uppercase text-slate-500">Draft</span>
                      )}
                    </div>
                    <p className="mt-1 font-semibold text-cyan-50">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDateTime(item.published_at ?? item.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {item.is_published && (
                      <Link href="/announcements" target="_blank">
                        <Button type="button" variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3.5 w-3.5" /> View
                        </Button>
                      </Link>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => startEdit(item)}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="gap-1"
                      onClick={() => void handleDelete(item.id, item.title)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
