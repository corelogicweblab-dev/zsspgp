import type { AiChatMessage } from "./system-prompt";
import { formatKnowledgeReply, matchKnowledge } from "./knowledge-base";

export function fallbackAiReply(messages: AiChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = lastUser?.content?.trim() ?? "";

  if (!text) {
    return "Contact Us is ready. Ask about registration, login, complaints, DRRM map, news, or capitol contact — each answer includes direct links you can open immediately.";
  }

  const entry = matchKnowledge(text);
  if (entry) return formatKnowledgeReply(entry);

  return `I can help with ZSSPGP services. Try asking about:
• Register or login (/register, /login)
• File a complaint (/complaints)
• DRRM Super Dashboard with map (/admin/department/drrm)
• Provincial news (/news)
• Governor (/know-your-governor)
• Contact & office hours (/#contact)

Describe what you need and I will give step-by-step actions with links.`;
}
