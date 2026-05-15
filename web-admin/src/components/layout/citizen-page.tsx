import { PublicNav } from "@/components/layout/public-nav";

interface CitizenPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  maxWidth?: "md" | "lg" | "xl" | "2xl" | "4xl" | "7xl";
}

const widthClass = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "7xl": "max-w-7xl",
};

export function CitizenPage({
  children,
  title,
  subtitle,
  maxWidth = "2xl",
}: CitizenPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/40">
      <PublicNav />
      <main className={`mx-auto px-4 py-10 sm:px-6 lg:px-8 ${widthClass[maxWidth]}`}>
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
        </header>
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © 2026 Province of Zamboanga Sibugay — ZSSPGP
      </footer>
    </div>
  );
}
