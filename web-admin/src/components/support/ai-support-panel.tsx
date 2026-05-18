"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Loader2,
  MessageCircle,
  MessageSquare,
  Send,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AI_ASSISTANT_NAME } from "@/lib/ai/system-prompt";
import type { AiChatMessage } from "@/lib/ai/system-prompt";
import type { KnowledgeAction } from "@/lib/ai/knowledge-base";
import { KNOWLEDGE_ENTRIES } from "@/lib/ai/knowledge-base";
import { CONTACT_INFO } from "@/lib/constants";
import { ChatMessage } from "@/components/support/chat-message";

type PanelStep = "welcome" | "chat";

interface AiSupportPanelProps {
  open: boolean;
  initialStep: PanelStep;
  onClose: () => void;
}

const WELCOME_MESSAGE: AiChatMessage = {
  role: "assistant",
  content:
    "Contact Us — instant ZSSPGP guidance with accurate steps and direct links. Ask about register, login, complaints, DRRM map, news, or capitol contact.",
};

const QUICK_PROMPTS = [
  "How do I register?",
  "DRRM Super Dashboard map",
  "File a complaint",
  "Office hours & hotline",
] as const;

export function AiSupportPanel({ open, initialStep, onClose }: AiSupportPanelProps) {
  const [step, setStep] = useState<PanelStep>(initialStep);
  const [messages, setMessages] = useState<AiChatMessage[]>([WELCOME_MESSAGE]);
  const [lastActions, setLastActions] = useState<KnowledgeAction[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setStep(initialStep);
  }, [open, initialStep]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, step]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: AiChatMessage = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        actions?: KnowledgeAction[];
      };
      const reply =
        data.reply ??
        (res.ok
          ? "I could not generate a reply. Please try again."
          : data.error ?? "Contact is temporarily unavailable.");
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setLastActions(data.actions ?? []);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connection issue. Use the links below or visit /login and /#contact on the home page.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  function handleGetStarted() {
    setStep("chat");
  }

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[90] bg-slate-950/60 backdrop-blur-[2px]"
        aria-label="Close Contact Us"
        onClick={onClose}
      />
      <aside
        className="fixed bottom-0 right-0 z-[100] flex h-[min(92vh,640px)] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-cyan-500/25 bg-slate-950 shadow-[0_0_48px_rgba(56,189,248,0.2)] sm:bottom-24 sm:right-6 sm:h-[min(80vh,600px)] sm:rounded-2xl"
        role="dialog"
        aria-label="Contact Us"
      >
        <header className="flex items-start gap-3 border-b border-cyan-500/20 bg-gradient-to-r from-indigo-950 to-slate-950 px-4 py-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Contact Us!</p>
            <h2 className="text-base font-semibold text-white">{AI_ASSISTANT_NAME}</h2>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-cyan-200/80">
              <Sparkles className="h-3 w-3" />
              Accurate answers with direct links
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {step === "welcome" ? (
          <div className="flex flex-1 flex-col justify-between p-5">
            <div className="space-y-4">
              <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-indigo-500/30">
                  <Bot className="h-6 w-6 text-cyan-300" />
                </div>
                <p className="text-sm leading-relaxed text-slate-200">{WELCOME_MESSAGE.content}</p>
              </div>
              <div className="grid gap-2">
                {KNOWLEDGE_ENTRIES.slice(0, 4).map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => {
                      setStep("chat");
                      void sendMessage(entry.title);
                    }}
                    className="flex items-start gap-2 rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-left text-xs text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-100"
                  >
                    <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500" />
                    <span>{entry.title}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <Button variant="gov" className="w-full gap-2" onClick={handleGetStarted}>
                <UserPlus className="h-4 w-4" />
                Get Started
              </Button>
              <Link href="/#contact" className="block" onClick={onClose}>
                <Button variant="outline" className="w-full">
                  Capitol Contact Info
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages
                .filter((m) => m.role === "user" || m.role === "assistant")
                .map((m, i) => (
                  <ChatMessage
                    key={`${m.role}-${i}`}
                    role={m.role as "user" | "assistant"}
                    content={m.content}
                  />
                ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Preparing accurate response…
                </div>
              )}
              {!loading && lastActions.length > 0 && (
                <div className="flex flex-wrap gap-2 pl-1">
                  {lastActions.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200"
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-slate-800 p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void sendMessage(q)}
                    className="rounded-full border border-cyan-500/25 bg-slate-900 px-2.5 py-1 text-[11px] text-cyan-200 hover:border-cyan-400/50"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendMessage(input);
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything — get steps + links…"
                  className="min-w-0 flex-1 rounded-xl border border-cyan-500/20 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  disabled={loading}
                />
                <Button type="submit" size="icon" variant="gov" disabled={loading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}

        <footer className="border-t border-slate-800 px-4 py-2 text-center text-[10px] text-slate-500">
          {CONTACT_INFO[1]?.value} · {CONTACT_INFO[2]?.value}
        </footer>
      </aside>
    </>
  );
}
