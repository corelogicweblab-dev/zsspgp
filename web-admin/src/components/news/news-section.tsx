"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Newspaper, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "@/types";

interface NewsSectionProps {
  articles: NewsArticle[];
}

export function NewsSection({ articles }: NewsSectionProps) {
  return (
    <section>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-2 flex items-center gap-2 text-cyan-400"
          >
            <Newspaper className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Provincial Information Office
            </span>
          </motion.div>
          <h2 className="text-3xl font-bold text-white">News & Information</h2>
          <p className="mt-2 max-w-xl text-slate-400">
            Official updates from the Provincial Information Office of Zamboanga Sibugay.
          </p>
        </div>
        <Link href="/news">
          <Button variant="outline" className="gap-2">
            View all news <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-400">
            No published news at this time. Check back for official provincial updates.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/news/${article.id}`}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    {article.is_featured && (
                      <span className="mb-3 inline-block rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                        Featured
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-cyan-50 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400 line-clamp-3">
                      {article.summary ?? article.content}
                    </p>
                    <p className="mt-4 text-xs text-slate-500">
                      {article.published_at
                        ? formatDate(article.published_at)
                        : formatDate(article.created_at)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
