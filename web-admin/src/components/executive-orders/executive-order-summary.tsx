import { parseExecutiveOrderSummary } from "@/lib/executive-order-summary-parse";
import { cn } from "@/lib/utils";

interface ExecutiveOrderSummaryProps {
  summary: string;
  className?: string;
}

/** Formal executive order body — sections, lists, and readable spacing. */
export function ExecutiveOrderSummary({ summary, className }: ExecutiveOrderSummaryProps) {
  const blocks = parseExecutiveOrderSummary(summary);

  if (!blocks.length) {
    return (
      <p className={cn("executive-order-summary-fallback text-sm leading-relaxed text-slate-600", className)}>
        {summary.trim()}
      </p>
    );
  }

  return (
    <article
      className={cn("executive-order-summary", className)}
      aria-label="Executive order summary"
    >
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h3" : "h4";
          return (
            <Tag key={`h-${index}-${block.text}`} className="eo-summary-heading">
              {block.text}
            </Tag>
          );
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag key={`list-${index}`} className="eo-summary-list">
              {block.items.map((item) => (
                <li key={`${index}-${item.slice(0, 40)}`}>{item}</li>
              ))}
            </ListTag>
          );
        }

        return (
          <p key={`p-${index}`} className="eo-summary-paragraph">
            {block.text}
          </p>
        );
      })}
    </article>
  );
}
