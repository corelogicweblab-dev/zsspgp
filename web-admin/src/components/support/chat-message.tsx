"use client";

import Link from "next/link";
import type { KnowledgeAction } from "@/lib/ai/knowledge-base";
import { matchKnowledge } from "@/lib/ai/knowledge-base";
import { cn } from "@/lib/utils";

function linkifyText(text: string) {
  const parts = text.split(/(\/[a-z0-9#\-/_]+)/gi);
  return parts.map((part, i) => {
    if (part.startsWith("/")) {
      return (
        <Link
          key={`${part}-${i}`}
          href={part}
          className="font-medium text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
        >
          {part}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function parseActionsFromReply(content: string): KnowledgeAction[] {
  return content
    .split("\n")
    .filter((l) => l.startsWith("→"))
    .map((l) => {
      const m = l.match(/→\s*(.+):\s*(\/\S+)/);
      return m ? { label: m[1].trim(), href: m[2] } : null;
    })
    .filter((a): a is KnowledgeAction => a !== null);
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const entry = role === "assistant" ? matchKnowledge(content) : null;
  const actions = entry?.actions?.length
    ? entry.actions
    : role === "assistant"
      ? parseActionsFromReply(content)
      : [];

  return (
    <div
      className={cn(
        "max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
        role === "user"
          ? "ml-auto bg-cyan-600/90 text-white"
          : "mr-auto border border-slate-700/80 bg-slate-900/90 text-slate-200"
      )}
    >
      <p className="whitespace-pre-wrap">{linkifyText(content)}</p>
      {role === "assistant" && actions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-700/60 pt-2">
          {actions.map((action) => (
            <Link
              key={action.href + action.label}
              href={action.href}
              className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200 hover:bg-cyan-500/20"
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
