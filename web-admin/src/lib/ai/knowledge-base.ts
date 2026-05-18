import { CONTACT_INFO } from "@/lib/constants";
import { OFFICE_HOURS } from "@/lib/site-navigation";
import { DEPARTMENT_PORTALS } from "@/lib/department-portals";

export type KnowledgeAction = {
  label: string;
  href: string;
};

export type KnowledgeEntry = {
  id: string;
  match: RegExp;
  title: string;
  summary: string;
  steps: string[];
  actions: KnowledgeAction[];
};

const capitol = CONTACT_INFO.find((c) => c.label === "Provincial Capitol")?.value ?? "Ipil, Zamboanga Sibugay";
const hotline = CONTACT_INFO.find((c) => c.label === "Hotline")?.value ?? "(062) 333-0000";
const email = CONTACT_INFO.find((c) => c.label === "Email")?.value ?? "info@zamboangasibugay.gov.ph";

export const KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  {
    id: "register",
    match: /register|sign\s*up|account|create|gumawa/i,
    title: "Create your ZSSPGP account",
    summary: "Citizens and authorized staff register once, then sign in at the same login page.",
    steps: [
      "Open /register on this site.",
      "Choose your role (Citizen, Information Office, or Department Staff/Admin).",
      "Complete name, email, password, and location fields.",
      "Confirm your email if Supabase sends a verification link.",
      "Sign in at /login with the same email and password.",
    ],
    actions: [
      { label: "Create Account", href: "/register" },
      { label: "Official Login", href: "/login" },
    ],
  },
  {
    id: "login",
    match: /login|sign\s*in|password|mag\s*login/i,
    title: "Official Login",
    summary: "One login page for citizens and all provincial departments.",
    steps: [
      "Go to /login.",
      "Enter your designated office or citizen email and password.",
      "Department users are routed automatically to their dashboard (e.g. DRRM → /admin/department/drrm).",
      "Citizens go to /dashboard after login.",
    ],
    actions: [{ label: "Sign In", href: "/login" }],
  },
  {
    id: "complaint",
    match: /complaint|reklamo|grievance|issue|serbisyo/i,
    title: "File a citizen complaint",
    summary: "Report provincial service issues with location and details.",
    steps: [
      "Sign in at /login (or register at /register).",
      "Open /complaints.",
      "Select municipality, barangay, category, title, and description.",
      "Submit — you will receive a reference number to track status on your dashboard.",
    ],
    actions: [
      { label: "File Complaint", href: "/complaints" },
      { label: "Citizen Dashboard", href: "/dashboard" },
    ],
  },
  {
    id: "drrm",
    match: /drrm|disaster|emergency|incident|baha|sunog|lindol|map|evacuation/i,
    title: "DRRM Super Dashboard Ops",
    summary: "Provincial disaster command: live map, active incidents, and response status.",
    steps: [
      "DRRM staff: sign in with drrm@zamboangasibugay.gov.ph at /login.",
      "Open DRRM Super Dashboard Ops at /admin/department/drrm for the operations map and incident overview.",
      "Review or update incidents at /admin/incidents.",
      "Citizens report emergencies via /complaints or contact hotline " + hotline + ".",
    ],
    actions: [
      { label: "DRRM Super Dashboard", href: "/admin/department/drrm" },
      { label: "Incident Reports", href: "/admin/incidents" },
      { label: "File Complaint", href: "/complaints" },
    ],
  },
  {
    id: "news",
    match: /news|pio|announcement|balita|update/i,
    title: "Provincial news & information",
    summary: "Official releases from the Provincial Information Office.",
    steps: [
      "Browse all articles at /news.",
      "Featured stories appear on the home page.",
      "PIO staff publish via /admin/news after signing in.",
    ],
    actions: [
      { label: "View News", href: "/news" },
      { label: "Announcements", href: "/announcements" },
    ],
  },
  {
    id: "governor",
    match: /governor|hofer|executive|opisina/i,
    title: "Governor's Office",
    summary: "Governor Dulce Ann K. Hofer — biography and executive dashboards.",
    steps: [
      "Public biography: /know-your-governor.",
      "Authorized executives use /admin/governor after login.",
    ],
    actions: [
      { label: "Know Your Governor", href: "/know-your-governor" },
      { label: "Governor Dashboard", href: "/admin/governor" },
    ],
  },
  {
    id: "contact",
    match: /contact|tawag|phone|email|address|oras|hours|hotline/i,
    title: "Contact the Provincial Government",
    summary: `${capitol} · Hotline ${hotline} · ${email}`,
    steps: [
      `${OFFICE_HOURS.weekdays}: ${OFFICE_HOURS.weekdayTime}`,
      `${OFFICE_HOURS.weekend}: ${OFFICE_HOURS.weekendStatus}`,
      "Use Contact Us (bottom-right) for instant AI guidance with direct links.",
    ],
    actions: [
      { label: "Contact Section", href: "/#contact" },
      { label: "Sign In", href: "/login" },
    ],
  },
  {
    id: "departments",
    match: /department|opisina|tourism|health|agriculture|ict|information/i,
    title: "Department portals",
    summary: "Each department has a designated email and password at /login.",
    steps: DEPARTMENT_PORTALS.map(
      (d) => `${d.code}: ${d.email} → /admin/department/${d.slug}`
    ),
    actions: [
      { label: "Department Overview", href: "/admin/department" },
      { label: "Official Login", href: "/login" },
    ],
  },
];

export function matchKnowledge(text: string): KnowledgeEntry | null {
  const t = text.trim();
  if (!t) return null;
  return KNOWLEDGE_ENTRIES.find((e) => e.match.test(t)) ?? null;
}

export function formatKnowledgeReply(entry: KnowledgeEntry): string {
  const steps = entry.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  const actions = entry.actions.map((a) => `→ ${a.label}: ${a.href}`).join("\n");
  return `${entry.title}\n\n${entry.summary}\n\nWhat to do:\n${steps}\n\nQuick links:\n${actions}`;
}

export function getContactFactsBlock(): string {
  return `Provincial Capitol: ${capitol}
Hotline: ${hotline}
Email: ${email}
Office hours: ${OFFICE_HOURS.weekdays} ${OFFICE_HOURS.weekdayTime}; ${OFFICE_HOURS.weekend} ${OFFICE_HOURS.weekendStatus}`;
}
