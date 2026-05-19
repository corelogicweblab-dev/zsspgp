import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { TransparencyDocument } from "@/lib/transparency-content";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function TransparencyDocumentView({ document }: { document: TransparencyDocument }) {
  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/transparency/open-governance"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-slate-400 hover:text-white")}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden />
          Open Governance
        </Link>
        <p className="text-xs text-slate-500">Last updated: {document.lastUpdated}</p>
      </div>

      {document.sections.map((section) => (
        <Card key={section.id} id={section.id} className="scroll-mt-24 border-cyan-500/10">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white sm:text-xl">{section.title}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-slate-300 sm:text-base">
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300 sm:text-base">
                {section.bullets.map((b) => (
                  <li key={b.slice(0, 40)}>{b}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </article>
  );
}