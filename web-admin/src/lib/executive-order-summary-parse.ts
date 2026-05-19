/** Known executive-order section headings (longest match first). */
const SECTION_HEADINGS = [
  "TASK FORCE COMPOSITION",
  "CYBERSECURITY PROVISIONS",
  "IMPLEMENTING GUIDELINES",
  "COVERED SYSTEMS",
  "LEGAL BASIS",
  "OBJECTIVES",
  "RESPONSIBILITIES",
  "EFFECTIVITY",
  "DEFINITIONS",
  "BACKGROUND",
  "PURPOSE",
  "FUNDING",
  "WHEREAS",
  "RECITALS",
  "SCOPE",
] as const;

const ROLE_LABELS = ["Chairperson", "Vice Chairperson", "Members", "Secretariat"] as const;

export type SummaryBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Insert line breaks before section titles, roles, and Republic Acts. */
function preprocessSummary(text: string): string {
  let s = text.replace(/\r\n/g, "\n").trim();

  for (const heading of SECTION_HEADINGS) {
    const re = new RegExp(`\\s+(${escapeRegExp(heading)})\\s+`, "gi");
    s = s.replace(re, `\n\n§§${heading.toUpperCase()}§§\n\n`);
  }

  for (const role of ROLE_LABELS) {
    const re = new RegExp(`\\s+(${escapeRegExp(role)}):\\s*`, "gi");
    s = s.replace(re, `\n\n${role}:\n`);
  }

  s = s.replace(/\s*(Republic Act No\.\s*[^.]+\.)/gi, "\n• $1");

  s = s.replace(/\s+(\d+[.)]\s+)/g, "\n$1");

  return s;
}

function isSectionMarker(line: string): string | null {
  const match = line.match(/^§§(.+?)§§$/);
  return match ? match[1].trim() : null;
}

function isRoleLine(line: string): boolean {
  return ROLE_LABELS.some((r) => line.toLowerCase().startsWith(`${r.toLowerCase()}:`));
}

function isBulletLine(line: string): boolean {
  return /^([-–—•*]|\d+[.)])\s+/.test(line);
}

function stripBullet(line: string): string {
  return line.replace(/^([-–—•*]|\d+[.)])\s+/, "").trim();
}

/** Split run-on items: "systems Electronic tracking" → separate lines. */
function splitRunOnItems(text: string): string[] {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return [];

  if (trimmed.includes("\n")) {
    return trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
  }

  const byBullet = trimmed.split(/(?<=[a-z0-9,)])\s+(?=[A-Z][a-z])/);
  if (byBullet.length > 1) {
    return byBullet.map((p) => p.trim()).filter(Boolean);
  }

  const bySentence = trimmed.split(/(?<=[.!?])\s+(?=[A-Z])/);
  if (bySentence.length > 1 && trimmed.length > 120) {
    return bySentence.map((p) => p.trim()).filter(Boolean);
  }

  return [trimmed];
}

function flushParagraph(buffer: string[], blocks: SummaryBlock[]) {
  const text = buffer.join(" ").replace(/\s+/g, " ").trim();
  buffer.length = 0;
  if (!text) return;

  const items = splitRunOnItems(text);
  if (items.length > 1 && items.every((i) => i.length < 220)) {
    blocks.push({ type: "list", ordered: false, items });
  } else {
    blocks.push({ type: "paragraph", text });
  }
}

function flushList(buffer: string[], blocks: SummaryBlock[], ordered: boolean) {
  if (!buffer.length) return;
  blocks.push({
    type: "list",
    ordered,
    items: buffer.map(stripBullet).filter(Boolean),
  });
  buffer.length = 0;
}

export function parseExecutiveOrderSummary(text: string): SummaryBlock[] {
  const preprocessed = preprocessSummary(text);
  const rawLines = preprocessed
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const blocks: SummaryBlock[] = [];
  let paragraphBuf: string[] = [];
  let listBuf: string[] = [];
  let listOrdered = false;
  let afterHeading = false;

  const endList = () => {
    flushList(listBuf, blocks, listOrdered);
    listOrdered = false;
  };

  for (const line of rawLines) {
    const section = isSectionMarker(line);
    if (section) {
      flushList(listBuf, blocks, listOrdered);
      flushParagraph(paragraphBuf, blocks);
      blocks.push({ type: "heading", level: 2, text: section });
      afterHeading = true;
      continue;
    }

    if (isRoleLine(line)) {
      flushList(listBuf, blocks, listOrdered);
      flushParagraph(paragraphBuf, blocks);
      blocks.push({ type: "heading", level: 3, text: line });
      afterHeading = true;
      continue;
    }

    if (isBulletLine(line)) {
      flushParagraph(paragraphBuf, blocks);
      if (!listBuf.length) listOrdered = /^\d+[.)]/.test(line);
      listBuf.push(line);
      afterHeading = false;
      continue;
    }

    if (listBuf.length) {
      flushList(listBuf, blocks, listOrdered);
    }

    if (afterHeading && paragraphBuf.length === 0) {
      const items = splitRunOnItems(line);
      if (items.length > 1 && items.every((i) => i.length < 220)) {
        blocks.push({ type: "list", ordered: false, items });
        afterHeading = false;
        continue;
      }
    }

    paragraphBuf.push(line);
    afterHeading = false;
  }

  flushList(listBuf, blocks, listOrdered);
  flushParagraph(paragraphBuf, blocks);

  return blocks;
}
