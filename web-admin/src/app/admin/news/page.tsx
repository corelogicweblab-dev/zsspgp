"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNewsArticle, fetchAllNewsClient } from "@/services/news.client";
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "@/types";

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [publish, setPublish] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadArticles() {
    const data = await fetchAllNewsClient();
    setArticles(data);
  }

  useEffect(() => {
    loadArticles();
  }, []);

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await createNewsArticle({
        title: title.trim(),
        summary: summary.trim() || null,
        content: content.trim(),
        is_published: publish,
        is_featured: featured,
      });
      setTitle("");
      setSummary("");
      setContent("");
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
                <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                  {success}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="title">Headline</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Input id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Full Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="min-h-[160px]"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
                Publish immediately
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                Feature on home page
              </label>
              <Button type="submit" variant="gov" disabled={loading}>
                {loading ? "Publishing…" : "Publish Article"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Published Articles</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[600px] space-y-3 overflow-y-auto">
            {articles.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No articles yet.</p>
            ) : (
              articles.map((a) => (
                <div key={a.id} className="rounded-lg border border-cyan-500/20 p-4">
                  <p className="font-medium text-cyan-50">{a.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {a.is_published ? "Published" : "Draft"} ·{" "}
                    {formatDate(a.published_at ?? a.created_at)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
