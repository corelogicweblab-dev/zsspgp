import { APP_SLOGAN, CONTACT_INFO } from "@/lib/constants";
import { OFFICE_HOURS } from "@/lib/site-navigation";

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
      { label: "Sign In", href: "/login" },
    ],
  },
  {
    id: "login",
    match: /login|sign\s*in|password|mag\s*login/i,
    title: "Sign In",
    summary: `One secure login at /login for citizens and provincial staff. ${APP_SLOGAN}`,
    steps: [
      "Go to /login.",
      "Enter the email and password for your account (provided by your office or from registration).",
      "Staff are routed to their department dashboard automatically.",
      "Citizens go to /dashboard after login.",
    ],
    actions: [{ label: "Sign In", href: "/login" }],
  },
  {
    id: "hiring",
    match: /hiring|apply|job|vacancy|application|trabaho/i,
    title: "Job applications",
    summary: "Hiring announcements from the Provincial Information Office.",
    steps: [
      "Browse openings at /announcements?category=hiring.",
      "Click View application details on a posting.",
      "Complete the form at /announcements/{id}/apply — submissions go to the Governor command center.",
    ],
    actions: [
      { label: "Hiring announcements", href: "/announcements?category=hiring" },
    ],
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
      "DRRM staff: sign in at /login with your assigned account.",
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
    id: "capitol",
    match: /capitol|map|ipil|location|saan|address|visit/i,
    title: "Provincial Capitol map",
    summary: "Find the capitol complex in Ipil on the home page map.",
    steps: [
      "Scroll to the capitol map on the home page or open /#capitol-map.",
      "The pin marks the Provincial Capitol Complex, Ipil.",
      `Office hours: ${OFFICE_HOURS.weekdays} ${OFFICE_HOURS.weekdayTime}.`,
    ],
    actions: [
      { label: "Capitol map", href: "/#capitol-map" },
      { label: "Contact section", href: "/#contact" },
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
