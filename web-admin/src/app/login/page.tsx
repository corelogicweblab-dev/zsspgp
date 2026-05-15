"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getAuthRedirectPath } from "@/lib/auth";
import { CitizenPage } from "@/components/layout/citizen-page";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    authError === "auth" ? "Authentication failed. Please try again." : null
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      router.push(getAuthRedirectPath(profile?.role ?? "citizen"));
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <GoogleSignInButton mode="login" />

        <div className="relative text-center text-xs text-slate-500">
          <div className="absolute inset-x-0 top-1/2 border-t border-slate-700" />
          <span className="relative px-3">or sign in with email</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="gov" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400">
          <Link href="/register" className="text-cyan-400 hover:underline">
            Create account with your role
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <CitizenPage
      title="Sign In"
      subtitle="Zamboanga Sibugay Smart Provincial Governance Platform"
      maxWidth="md"
    >
      <Suspense fallback={<Card><CardContent className="py-8 text-center text-slate-400">Loading…</CardContent></Card>}>
        <LoginForm />
      </Suspense>
    </CitizenPage>
  );
}
