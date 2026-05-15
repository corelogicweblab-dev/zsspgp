import {
  Shield,
  MessageSquare,
  AlertTriangle,
  BarChart3,
  Smartphone,
  Building2,
} from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { LandingHero } from "@/components/landing/hero";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: BarChart3, title: "Governor Command Center", desc: "Real-time provincial analytics and executive oversight." },
  { icon: Building2, title: "Department Portals", desc: "DRRM, Health, Tourism, Agriculture, and ICT unified." },
  { icon: MessageSquare, title: "Citizen Complaints", desc: "Track and resolve citizen concerns efficiently." },
  { icon: AlertTriangle, title: "DRRM Incidents", desc: "Emergency reporting with severity-based alerts." },
  { icon: Shield, title: "Role-Based Security", desc: "Enterprise RBAC with Supabase Auth and RLS." },
  { icon: Smartphone, title: "Mobile App", desc: "Citizen access via React Native Expo." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/40">
      <PublicNav />
      <LandingHero />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-slate-900">Integrated Governance Modules</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Enterprise-grade digital transformation for provincial government operations.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="transition hover:shadow-lg">
              <CardContent className="p-6">
                <f.icon className="mb-4 h-10 w-10 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        © 2026 Province of Zamboanga Sibugay — ZSSPGP MVP
      </footer>
    </div>
  );
}
