import type { AiChatMessage } from "./system-prompt";

const KEYWORDS: { match: RegExp; reply: string }[] = [
  {
    match: /register|sign\s*up|account|create/i,
    reply:
      'To get started, open **Create Account** at /register. Choose your role (citizen or authorized staff), complete the form, and confirm your email if prompted. Need help mid-signup? Tell me which step you are on.',
  },
  {
    match: /login|sign\s*in|password|oauth|google/i,
    reply:
      "Use **Official Login** at /login with your registered email and password, or your configured OAuth provider. If you forgot your password, use the reset link on the login page.",
  },
  {
    match: /complaint|report|issue|grievance/i,
    reply:
      "File a complaint at /complaints after signing in. Include municipality, barangay, a clear title, and details. You can track status from your citizen dashboard.",
  },
  {
    match: /incident|emergency|drrm|disaster/i,
    reply:
      "For incidents and emergencies, go to /incidents (sign in required). Provide location, severity, and a factual description so DRRM teams can respond.",
  },
  {
    match: /news|pio|announcement|update/i,
    reply:
      "Official provincial news is at /news. Featured articles appear on the home page. PIO staff publish through the admin news module.",
  },
  {
    match: /governor|hofer|executive/i,
    reply:
      'Learn about Governor Dulce Ann K. Hofer at /know-your-governor — biography, education, and vision for the province.',
  },
  {
    match: /admin|dashboard|staff|ict/i,
    reply:
      "Authorized users sign in at /login and are routed to the correct admin module by role (governor, ICT, departments, information office, etc.).",
  },
  {
    match: /hello|hi|help|start|get\s*started|saan|paano/i,
    reply:
      'Welcome to ZSSPGP 24/7 AI support. Tap **Get Started** or tell me if you need to register, login, file a complaint, report an incident, or read provincial news.',
  },
];

export function fallbackAiReply(messages: AiChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = lastUser?.content?.trim() ?? "";

  if (!text) {
    return "I am here 24/7. Choose **Get Started** below or type your question — for example: register, login, complaint, incident, or news.";
  }

  for (const { match, reply } of KEYWORDS) {
    if (match.test(text)) return reply.replace(/\*\*/g, "");
  }

  return `Thanks for your message. I am the ${"ZSSPGP"} AI assistant (24/7). I can guide you with registration, login, complaints, incidents, and news. Try asking about one of those topics, or visit /register to get started. For urgent capitol matters, use the contact details on the home page.`;
}
