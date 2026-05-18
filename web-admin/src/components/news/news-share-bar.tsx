"use client";

import { useCallback, useState } from "react";
import { Share2, Mail, MessageCircle, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNewsArticleUrl } from "@/lib/news-url";
import { cn } from "@/lib/utils";

interface NewsShareBarProps {
  articleId: string;
  title?: string;
  className?: string;
}

export function NewsShareBar({ articleId, title, className }: NewsShareBarProps) {
  const [toast, setToast] = useState<string | null>(null);

  const url = getNewsArticleUrl(articleId);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title ?? "Provincial News");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard");
    } catch {
      window.prompt("Copy this link:", url);
    }
  }, [url]);

  const shareLinks: {
    label: string;
    href: string;
    glyph: React.ReactNode;
  }[] = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      glyph: <span className="text-xs font-bold">f</span>,
    },
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      glyph: <span className="text-xs font-bold">𝕏</span>,
    },
    {
      label: "Messenger",
      href: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=0&redirect_uri=${encodedUrl}`,
      glyph: <MessageCircle className="h-4 w-4" />,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      glyph: <Mail className="h-4 w-4" />,
    },
  ];

  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Share2 className="h-3.5 w-3.5" />
          Share
        </span>
        {shareLinks.map(({ label, href, glyph }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/25 bg-slate-900/60 text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-100"
            aria-label={`Share on ${label}`}
          >
            {glyph}
          </a>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 border-cyan-500/30"
          onClick={() => void copyLink()}
        >
          <Link2 className="h-4 w-4" />
          Copy link
        </Button>
      </div>
      {toast && (
        <div
          role="status"
          className="absolute right-0 top-full z-20 mt-2 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/95 px-3 py-2 text-sm text-emerald-200 shadow-lg"
        >
          <Check className="h-4 w-4 shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}
