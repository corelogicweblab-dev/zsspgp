/** Optimized WebP first (slow networks); smaller PNG only if WebP fails. */
export const GOVERNOR_IMAGE_PATH = "/governorannhofer-spotlight.webp";
export const GOVERNOR_HEADER_IMAGE_PATH = "/governorannhofer-hero.webp";
export const GOVERNOR_IMAGE_FALLBACK = "/governorannhoferheader.png";
export const GOVERNOR_HEADER_FALLBACK = "/governorannhoferheader.png";
export const KNOW_YOUR_GOVERNOR_PATH = "/know-your-governor";

export const GOVERNOR_PROFILE = {
  name: "Dulce Ann K. Hofer",
  nicknames: "Governor Ann Hofer",
  alsoKnownAs: "Doc Ann",
  title: "Governor of Zamboanga Sibugay",
  tagline: "A Leader Committed to Progress, Service, and People",
  intro: `Dulce Ann K. Hofer, widely known as "Governor Ann Hofer" or "Doc Ann," is the current Governor of Zamboanga Sibugay — a visionary public servant dedicated to building a stronger, more progressive, and people-centered province.

With a leadership style grounded in compassion, discipline, and excellence in governance, Governor Ann Hofer continues to champion programs that improve the lives of Sibugaynons through education, infrastructure, agriculture, healthcare, economic development, and community empowerment.

Born into a family deeply rooted in public service, she carries forward the enduring legacy of her father, the late George T. Hofer, whose vision helped establish Zamboanga Sibugay as a province. Today, Governor Ann Hofer continues that mission by leading the province toward innovation, modernization, and inclusive growth.`,
  education: {
    title: "Educational Excellence",
    intro:
      "Governor Ann Hofer believes that education is one of the strongest foundations of progress. Her academic achievements reflect her commitment to leadership and public administration:",
    items: [
      "Bachelor of Science in Business Management — Ateneo de Manila University",
      "Master in Business Administration — University of the Philippines Cebu",
      "Doctorate in Public Administration — University of the Philippines Diliman",
    ],
    outro:
      "Her strong educational background continues to guide her governance and policy-making initiatives.",
  },
  publicService: {
    title: "Public Service & Leadership",
    intro: "Before becoming governor, she served as:",
    items: [
      "Representative of the 2nd District of Zamboanga Sibugay",
      "Chairperson of the House Committee on Higher and Technical Education",
      "Chairperson of the House Committee on Foreign Affairs",
    ],
    outro:
      "Through years of public service, she became known for promoting effective governance, institutional development, and programs that directly benefit local communities.",
  },
  vision: {
    title: "Vision for Zamboanga Sibugay",
    intro: "Under Governor Ann Hofer's leadership, the province continues to pursue:",
    items: [
      "Sustainable infrastructure development",
      "Modernized agriculture and rural support",
      "Accessible education and scholarship programs",
      "Transparent and accountable governance",
      "Economic growth and investment opportunities",
      "Peace, unity, and stronger community participation",
    ],
    outro:
      "Her administration emphasizes inclusive development — ensuring that progress reaches every municipality, barangay, and family across the province.",
  },
  legacy: {
    title: "Legacy of Leadership",
    intro:
      "Governor Ann Hofer's legacy is defined by her dedication to public service, continuity of progress, and commitment to empowering future generations. Her leadership represents:",
    items: [
      "Strong and compassionate governance",
      "Advancement of education and opportunity",
      "Development-driven leadership",
      "Preservation of Sibugaynon pride and identity",
      "A continuing vision for a modern and progressive Zamboanga Sibugay",
    ],
    outro:
      "Through integrity, service, and visionary leadership, Governor Ann Hofer continues to inspire meaningful change and lasting development for the people of Zamboanga Sibugay.",
  },
} as const;
