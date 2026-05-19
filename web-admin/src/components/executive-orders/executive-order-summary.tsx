import { cn } from "@/lib/utils";

type Block =
  | { type: "paragraph"; lines: string[] }
  | { type: "list"; items: string[]; ordered: boolean };

function normalizeLine(line: string): string {
  return line.replace(/\s+/g, " ").trim();
}

function parseSummaryBlocks(text: string): Block[] {
  const rawBlocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const blocks: Block[] = [];

  for (const block of rawBlocks) {
    const lines = block.split("\n").map(normalizeLine).filter(Boolean);
    if (!lines.length) continue;

    const bulletPattern = /^([-–—•*]|\d+[.)])\s+/;
    const allBullets = lines.every((line) => bulletPattern.test(line));

    if (allBullets) {
      const ordered = /^\d+[.)]\s+/.test(lines[0]);
      blocks.push({
        type: "list",
        ordered,
        items: lines.map((line) => line.replace(bulletPattern, "").trim()),
      });
    } else {
      blocks.push({ type: "paragraph", lines });
    }
  }

  return blocks;
}

interface ExecutiveOrderSummaryProps {
  summary: string;
  className?: string;
}

/** Formal typography for executive order summary text (paragraphs, lists, spacing). */
export function ExecutiveOrderSummary({ summary, className }: ExecutiveOrderSummaryProps) {
  const blocks = parseSummaryBlocks(summary);

  if (!blocks.length) {
    return (
      <p className={cn("executive-order-summary text-sm leading-relaxed text-slate-600", className)}>
        {summary.trim()}
      </p>
    );
  }

  return (
    <div
      className={cn("executive-order-summary text-[0.9375rem] leading-[1.75] text-slate-700", className)}
      role="doc-subtitle"
    >
      {blocks.map((block, index) => {
        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag key={`list-${index}`}>
              {block.items.map((item) => (
                <li key={item.slice(0, 48)}>{item}</li>
              ))}
            </ListTag>
          );
        }

        const paragraph = block.lines.join(" ");
        return <p key={`p-${index}`}>{paragraph}</p>;
      })}
    </div>
  );
}
