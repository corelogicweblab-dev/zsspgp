"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Upload, X, ImageIcon } from "lucide-react";
import { COMPLAINT_CATEGORIES, MUNICIPALITIES } from "@/lib/constants";
import { CitizenPage } from "@/components/layout/citizen-page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { ComplaintCategory } from "@/types";

export default function ComplaintsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ComplaintCategory | "">("");
  const [municipality, setMunicipality] = useState("");
  const [barangay, setBarangay] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, or WebP).");
      return;
    }
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    setError(null);
  }

  function clearImage() {
    setPreview(null);
    setFileName(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          municipality,
          barangay: barangay.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to submit complaint.");
        return;
      }

      setSuccess(`Complaint submitted. Reference: ${data.reference_number}`);
      setTitle("");
      setDescription("");
      setCategory("");
      setMunicipality("");
      setBarangay("");
      clearImage();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CitizenPage
      title="File a Complaint"
      subtitle="Report provincial service issues to the appropriate department"
      maxWidth="lg"
    >
      <Card>
        <CardHeader>
          <CardTitle>Complaint Form</CardTitle>
          <CardDescription>
            Provide clear details and optional photo evidence. You can track status after signing in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {success}{" "}
                <Link href="/dashboard" className="font-medium underline">
                  View dashboard
                </Link>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="title">Subject</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                required
              >
                <option value="">Select category</option>
                {COMPLAINT_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="municipality">Municipality</Label>
                <Select
                  id="municipality"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  required
                >
                  <option value="">Select municipality</option>
                  {MUNICIPALITIES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="barangay">Barangay</Label>
                <Input
                  id="barangay"
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  placeholder="Barangay name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, location landmarks, and urgency…"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Photo evidence (optional)</Label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {preview ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Upload preview" className="max-h-48 w-full object-cover" />
                  <div className="flex items-center justify-between border-t bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    <span className="truncate">{fileName}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={clearImage}>
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-600"
                >
                  <Upload className="h-8 w-8" />
                  <span className="text-sm font-medium">Click to upload image</span>
                  <span className="text-xs">JPEG, PNG, or WebP up to 5MB</span>
                </button>
              )}
              {!preview && (
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <ImageIcon className="h-3 w-3" />
                  Image upload UI — storage connects when Supabase is configured
                </p>
              )}
            </div>
            <Button type="submit" variant="gov" className="w-full" disabled={loading}>
              {loading ? "Submitting…" : "Submit Complaint"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </CitizenPage>
  );
}
