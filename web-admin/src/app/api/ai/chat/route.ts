import { NextResponse } from "next/server";
import { z } from "zod";
import { AI_SYSTEM_PROMPT, type AiChatMessage } from "@/lib/ai/system-prompt";
import { fallbackAiReply } from "@/lib/ai/fallback";
import { formatKnowledgeReply, matchKnowledge } from "@/lib/ai/knowledge-base";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(24),
});

async function openAiReply(messages: AiChatMessage[]): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 600,
      messages: [{ role: "system", content: AI_SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!res.ok) {
    console.error("OpenAI chat error", res.status, await res.text());
    return null;
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const messages = parsed.data.messages as AiChatMessage[];
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const knowledge = lastUser ? matchKnowledge(lastUser.content) : null;

    const ai = await openAiReply(messages);
    const reply = ai ?? fallbackAiReply(messages);

    return NextResponse.json({
      reply,
      provider: ai ? "openai" : "builtin",
      actions: knowledge?.actions ?? [],
    });
  } catch (e) {
    console.error("AI chat route error", e);
    return NextResponse.json({ error: "Support is temporarily unavailable" }, { status: 500 });
  }
}
