"use client";

import { NewsShareBar } from "@/components/news/news-share-bar";

interface ShareNewsLinkProps {
  articleId: string;
  title?: string;
  className?: string;
  size?: "sm" | "default";
}

/** @deprecated Use NewsShareBar — thin wrapper for existing imports */
export function ShareNewsLink({ articleId, title, className }: ShareNewsLinkProps) {
  return <NewsShareBar articleId={articleId} title={title} className={className} />;
}
