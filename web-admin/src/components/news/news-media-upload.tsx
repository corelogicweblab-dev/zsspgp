"use client";

import { useCallback, useRef, useState } from "react";
import { ImageIcon, Film, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { uploadNewsMedia } from "@/services/news.client";
import { cn } from "@/lib/utils";
import type { NewsMediaType } from "@/types";

interface NewsMediaUploadProps {
  label: string;
  coverUrl: string;
  coverPreview: string | null;
  coverFile: File | null;
  mediaUrl: string;
  mediaType: NewsMediaType;
  onCoverUrlChange: (url: string) => void;
  onCoverFileChange: (file: File | null, preview: string | null) => void;
  onMediaChange: (url: string | null, type: NewsMediaType) => void;
  disabled?: boolean;
}

export function NewsMediaUpload({
  label,
  coverUrl,
  coverPreview,
  coverFile,
  mediaUrl,
  mediaType,
  onCoverUrlChange,
  onCoverFileChange,
  onMediaChange,
  disabled,
}: NewsMediaUploadProps) {
  const coverRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = coverPreview ?? (coverUrl || null);

  const pickCover = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Cover must be an image (JPEG, PNG, or WebP).");
      return;
    }
    setError(null);
    onCoverFileChange(file, URL.createObjectURL(file));
    onCoverUrlChange("");
  };

  const uploadInlineMedia = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const { url, mediaType: type } = await uploadNewsMedia(file);
      onMediaChange(url, type);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled || uploading) return;
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      if (file.type.startsWith("image/")) pickCover(file);
      else if (file.type.startsWith("video/")) void uploadInlineMedia(file);
      else setError("Use an image or video file.");
    },
    [disabled, uploading]
  );

  const clearCover = () => {
    onCoverFileChange(null, null);
    onCoverUrlChange("");
    if (coverRef.current) coverRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{label}</Label>
        <input
          ref={coverRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) pickCover(f);
          }}
        />
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "rounded-xl border-2 border-dashed transition",
            dragOver ? "border-cyan-400 bg-cyan-500/10" : "border-cyan-500/30 bg-slate-950/40"
          )}
        >
          {preview ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Cover preview" className="h-full w-full object-cover" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 bg-slate-950/80"
                onClick={clearCover}
                aria-label="Remove cover"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => coverRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 px-4 py-8 text-slate-400 hover:text-cyan-200"
            >
              <Upload className="h-8 w-8 text-cyan-500/70" />
              <span className="text-sm font-medium">Drag & drop cover image, or click to upload</span>
              <span className="text-xs">Thumbnail for headlines & cards</span>
            </button>
          )}
        </div>
        <Label htmlFor="coverUrl" className="text-xs text-slate-500">
          Or paste cover image URL
        </Label>
        <Input
          id="coverUrl"
          type="url"
          placeholder="https://…"
          value={coverUrl}
          disabled={Boolean(coverFile) || disabled}
          onChange={(e) => onCoverUrlChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Article image or video (optional)</Label>
        <input
          ref={mediaRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
          className="hidden"
          disabled={disabled || uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void uploadInlineMedia(f);
          }}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={disabled || uploading}
            onClick={() => mediaRef.current?.click()}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            Upload image / video
          </Button>
          {mediaUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onMediaChange(null, null)}
            >
              Clear media
            </Button>
          )}
        </div>
        {mediaUrl && (
          <div className="overflow-hidden rounded-lg border border-cyan-500/20 bg-slate-900/50 p-2">
            {mediaType === "video" ? (
              <video src={mediaUrl} controls className="max-h-48 w-full rounded" />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={mediaUrl} alt="Article media" className="max-h-48 w-full rounded object-contain" />
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-300">{error}</p>
      )}
    </div>
  );
}
