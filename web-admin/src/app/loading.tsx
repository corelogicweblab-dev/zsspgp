import { SectionSkeleton } from "@/components/ui/section-skeleton";

export default function RootLoading() {
  return (
    <div className="space-y-8 py-4" aria-busy aria-label="Loading page">
      <SectionSkeleton className="min-h-[220px]" />
      <SectionSkeleton variant="banner" />
      <SectionSkeleton variant="news" />
    </div>
  );
}
