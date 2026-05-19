import { cn } from "@/lib/utils";

type SectionSkeletonProps = {
  variant?: "banner" | "news" | "gallery" | "cards" | "map" | "default";
  className?: string;
};

export function SectionSkeleton({ variant = "default", className }: SectionSkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl border border-cyan-500/10 bg-slate-900/50", className)}
      aria-hidden
    >
      {variant === "banner" && <div className="h-20 sm:h-24" />}
      {variant === "news" && (
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 rounded-xl bg-slate-800/80" />
          ))}
        </div>
      )}
      {variant === "gallery" && <div className="aspect-[2/1] max-h-72 bg-slate-800/60" />}
      {variant === "cards" && (
        <div className="grid grid-cols-2 gap-3 p-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-square rounded-xl bg-slate-800/80" />
          ))}
        </div>
      )}
      {variant === "map" && <div className="h-[min(280px,50vh)] bg-slate-800/60" />}
      {variant === "default" && <div className="h-32" />}
    </div>
  );
}
