import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Landmark, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GOVERNOR_IMAGE_PATH, GOVERNOR_PROFILE } from "@/lib/governor-profile";

function BioSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-amber-500/15">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">{children}</div>
      </CardContent>
    </Card>
  );
}

export default function KnowYourGovernorPage() {
  const p = GOVERNOR_PROFILE;

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-4">
      <Link href="/">
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-200">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Button>
      </Link>

      <section className="governor-hero-card overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center gap-8 p-6 sm:flex-row sm:p-10">
          <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-2xl border border-amber-400/30 bg-slate-900/80 shadow-[0_0_40px_rgba(251,191,36,0.15)] sm:h-56 sm:w-56">
            <Image
              src={GOVERNOR_IMAGE_PATH}
              alt={p.name}
              fill
              className="object-cover object-top"
              sizes="224px"
              priority
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300/90">
              Know Your Governor
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white text-glow sm:text-4xl">{p.name}</h1>
            <p className="mt-2 text-sm text-cyan-200/90 sm:text-base">{p.title}</p>
            <p className="mt-4 text-lg font-medium text-amber-100/95">{p.tagline}</p>
          </div>
        </div>
      </section>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300 sm:text-base">
            {p.intro}
          </p>
        </CardContent>
      </Card>

      <BioSection title={p.education.title} icon={GraduationCap}>
        <p>{p.education.intro}</p>
        <ul className="list-inside list-disc space-y-2 text-slate-200/90">
          {p.education.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{p.education.outro}</p>
      </BioSection>

      <BioSection title={p.publicService.title} icon={Landmark}>
        <p>{p.publicService.intro}</p>
        <ul className="list-inside list-disc space-y-2 text-slate-200/90">
          {p.publicService.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{p.publicService.outro}</p>
      </BioSection>

      <BioSection title={p.vision.title} icon={Target}>
        <p>{p.vision.intro}</p>
        <ul className="list-inside list-disc space-y-2 text-slate-200/90">
          {p.vision.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{p.vision.outro}</p>
      </BioSection>

      <BioSection title={p.legacy.title} icon={Sparkles}>
        <p>{p.legacy.intro}</p>
        <ul className="list-inside list-disc space-y-2 text-slate-200/90">
          {p.legacy.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{p.legacy.outro}</p>
      </BioSection>
    </div>
  );
}
