import { APP_NAME, CONTACT_INFO } from "@/lib/constants";
import { OFFICE_HOURS } from "@/lib/site-navigation";

const email = CONTACT_INFO.find((c) => c.label === "Email")?.value ?? "info@zamboangasibugay.gov.ph";
const hotline = CONTACT_INFO.find((c) => c.label === "Hotline")?.value ?? "(062) 333-0000";

export type TransparencySection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type TransparencyDocument = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: TransparencySection[];
};

export const DATA_PRIVACY_NOTICE: TransparencyDocument = {
  title: "Data Privacy Notice",
  subtitle: `How ${APP_NAME} collects, uses, and protects personal information`,
  lastUpdated: "May 2026",
  sections: [
    {
      id: "scope",
      title: "Scope",
      paragraphs: [
        `This notice applies to citizens, employees, and authorized users of ${APP_NAME} operated by the Provincial Government of Zamboanga Sibugay in partnership with CoreLogic.`,
        "By registering, signing in, or submitting forms on this platform, you acknowledge the practices described below in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173).",
      ],
    },
    {
      id: "collection",
      title: "Information we collect",
      paragraphs: ["We may collect the following categories of personal data when you use ZSSPGP:"],
      bullets: [
        "Identity and contact details (name, email, phone, municipality, barangay)",
        "Account credentials and role assignments for staff and citizens",
        "Complaint, incident, and service request details you voluntarily submit",
        "Job application materials including résumés uploaded for hiring posts",
        "Technical logs such as IP address, browser type, and session timestamps for security",
      ],
    },
    {
      id: "use",
      title: "How we use your data",
      paragraphs: ["Personal data is processed only for legitimate provincial governance purposes:"],
      bullets: [
        "Delivering citizen services (complaints, alerts, hiring, news, and announcements)",
        "Routing requests to the correct provincial department or office",
        "Sending notifications and public broadcasts you opt into or that are legally required",
        "Securing the platform, preventing fraud, and maintaining audit trails",
        "Complying with lawful orders from competent government authorities",
      ],
    },
    {
      id: "sharing",
      title: "Sharing and disclosure",
      paragraphs: [
        "We do not sell personal data. Information may be shared with authorized provincial offices, disaster response units, and technology providers bound by confidentiality agreements when necessary to fulfill a service you requested.",
        "Aggregated, non-identifying statistics may be used for provincial reporting and transparency dashboards.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      paragraphs: ["Under the Data Privacy Act, you may request:"],
      bullets: [
        "Access to personal data we hold about you",
        "Correction of inaccurate or incomplete records",
        "Suspension, blocking, or erasure where legally applicable",
        "Data portability in a structured, commonly used format",
      ],
    },
    {
      id: "contact-dpo",
      title: "Privacy inquiries",
      paragraphs: [
        `For data privacy concerns, contact the Provincial Information Office at ${email} or call ${hotline}.`,
        `Office hours: ${OFFICE_HOURS.weekdays}, ${OFFICE_HOURS.weekdayTime}.`,
      ],
    },
  ],
};

export const CITIZEN_CHARTER: TransparencyDocument = {
  title: "Citizen Charter",
  subtitle: "Service standards and commitments of the Provincial Government of Zamboanga Sibugay",
  lastUpdated: "May 2026",
  sections: [
    {
      id: "commitment",
      title: "Our commitment",
      paragraphs: [
        "The Provincial Government of Zamboanga Sibugay is committed to efficient, courteous, and transparent public service through ZSSPGP and in-person channels at the Provincial Capitol, Ipil.",
      ],
    },
    {
      id: "services",
      title: "Core citizen services",
      paragraphs: ["Through this platform you can access:"],
      bullets: [
        "File and track complaints with reference numbers",
        "View official news, announcements, and emergency alerts",
        "Apply for published provincial job vacancies online",
        "Receive public broadcasts and provincial updates",
        "Contact offices via AI-assisted support and published hotlines",
      ],
    },
    {
      id: "standards",
      title: "Service standards",
      paragraphs: ["Target processing times for digital submissions:"],
      bullets: [
        "Complaint acknowledgment — within 1 working day",
        "Complaint initial review — within 3 working days",
        "Hiring application receipt confirmation — within 2 working days",
        "Emergency alert publication — as soon as verified by authorized PIO/DRRM staff",
        "General inquiries via Contact Us — same-day during office hours",
      ],
    },
    {
      id: "requirements",
      title: "What citizens must provide",
      paragraphs: ["To help us serve you faster, please:"],
      bullets: [
        "Use accurate contact information and location details",
        "Attach clear descriptions and evidence when filing complaints",
        "Check announcement expiry dates before applying for positions",
        "Keep your login credentials confidential",
      ],
    },
    {
      id: "feedback",
      title: "Feedback and escalation",
      paragraphs: [
        "If service standards are not met, escalate through the complaint module or email the Provincial Information Office.",
        `Hotline: ${hotline} · Email: ${email}`,
      ],
    },
  ],
};

export const OPEN_GOVERNANCE_INTRO: TransparencyDocument = {
  title: "Open Governance",
  subtitle: "Transparency, participation, and accountability for every Sibugaynon",
  lastUpdated: "May 2026",
  sections: [
    {
      id: "principles",
      title: "Principles",
      paragraphs: [
        "Open governance means making provincial information accessible, inviting citizen participation, and holding offices accountable for published service standards.",
        `${APP_NAME} is the digital front door for these commitments.`,
      ],
    },
    {
      id: "channels",
      title: "Transparency channels",
      paragraphs: ["Use the following official channels:"],
      bullets: [
        "Provincial news and PIO releases",
        "Published announcements including procurement and hiring",
        "Executive orders and capitol communications",
        "Complaint tracking with status updates",
        "Data Privacy Notice and Citizen Charter on this portal",
      ],
    },
  ],
};
