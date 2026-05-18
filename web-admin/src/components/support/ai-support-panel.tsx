"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Headphones,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AI_ASSISTANT_NAME } from "@/lib/ai/system-prompt";
import type { AiChatMessage } from "@/lib/ai/system-prompt";
import { CONTACT_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";

type PanelStep = "welcome" | "chat";

interface AiSupportPanelProps {
  open: boolean;
  initialStep: PanelStep;
  onClose: () => void;
}

const WELCOME_MESSAGE: AiChatMessage = {
  role: "assistant",
  content:
    "Welcome to ZSSPGP 24/7 AI Support. I can help you register, login, file complaints, report incidents, and find provincial news. Tap Get Started to continue.",
};

const QUICK_PROMPTS = [
  "How do I register?",
  "File a complaint",
  "Provincial news",
  "Report an incident",
] as const;

export function AiSupportPanel({ open, initialStep, onClose }: AiSupportPanelProps) {
  const [step, setStep] = useState<PanelStep>(initialStep);
  const [messages, setMessages] = useState<AiChatMessage[]>([WELCOME_MESSAGE]);
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
      const data = (await res.json()) as { reply?: string; error?: string };
      const reply =
        data.reply ??
        (res.ok
          ? "I could not generate a reply. Please try again."
          : data.error ?? "Support is temporarily unavailable.");
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connection issue. You can still use Get Started to register, or try again in a moment.",
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
        aria-label="Close support"
        onClick={onClose}
      />
      <aside
        className="fixed bottom-0 right-0 z-[100] flex h-[min(92vh,640px)] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-cyan-500/25 bg-slate-950 shadow-[0_0_48px_rgba(56,189,248,0.2)] sm:bottom-24 sm:right-6 sm:h-[min(80vh,600px)] sm:rounded-2xl"
        role="dialog"
        aria-label="24/7 AI Support"
      >
        <header className="flex items-start gap-3 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900 to-slate-950 px-4 py-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300">
            <Headphones className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300">24/7 Support</p>
            <h2 className="text-base font-semibold text-white">{AI_ASSISTANT_NAME}</h2>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-cyan-200/80">
              <Sparkles className="h-3 w-3" />
              AI-powered provincial assistance
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
              <ul className="space-y-2 text-sm text-slate-400">
                {QUICK_PROMPTS.map((q) => (
                  <li key={q} className="flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-cyan-500" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 space-y-2">
              <Button variant="gov" className="w-full gap-2" onClick={handleGetStarted}>
                <UserPlus className="h-4 w-4" />
                Get Started
              </Button>
              <Link href="/register" className="block" onClick={onClose}>
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={cn(
                    "max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "ml-auto bg-cyan-600/90 text-white"
                      : "mr-auto border border-slate-700/80 bg-slate-900/90 text-slate-200"
                  )}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  AI is typing…
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
                  placeholder="Ask ZSSPGP AI anything…"
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
