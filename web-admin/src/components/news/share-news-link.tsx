"use client";

import { useState, useCallback } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNewsArticleUrl } from "@/lib/news-url";
import { cn } from "@/lib/utils";

interface ShareNewsLinkProps {
  articleId: string;
  className?: string;
  size?: "sm" | "default";
}

export function ShareNewsLink({ articleId, className, size = "sm" }: ShareNewsLinkProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(async () => {
    const url = getNewsArticleUrl(articleId);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }, [articleId]);

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      className={cn("gap-2", className)}
      onClick={() => void copyLink()}
      aria-label={copied ? "Link copied" : "Copy share link"}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-400" />
          <span className="text-emerald-300">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span>Copy link</span>
        </>
      )}
    </Button>
  );
}
