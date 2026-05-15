"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { ProvincialLogo } from "@/components/ui/provincial-logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Exclusive Governor Super Admin portal — not listed in public roles or menus. */
export default function GovernorExecutiveAccessPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/governor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Access denied.");
        return;
      }
      router.push(data.redirect ?? "/admin/governor");
      router.refresh();
    } catch {
      setError("Unable to verify credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <Card className="border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.12)]">
        <CardHeader className="items-center text-center">
          <ProvincialLogo size={72} priority />
          <div className="mt-4 flex items-center gap-2 text-amber-400">
            <Shield className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Executive Access Only</span>
          </div>
          <CardTitle className="mt-2">Governor Super Admin</CardTitle>
          <p className="text-sm text-slate-400">
            Restricted command center login. Not available through public registration roles.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="exec-email">Executive Email</Label>
              <Input
                id="exec-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exec-password">Executive Password</Label>
              <Input
                id="exec-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="gov" className="w-full" disabled={loading}>
              {loading ? "Verifying…" : "Access Command Center"}
            </Button>
          </form>
          <p className="mt-4 text-center text-[10px] text-slate-500">
            Secured session · Rate-limited · Audit logged
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
