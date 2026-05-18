"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { resolvePostLoginPath } from "@/lib/auth-redirect";
import { resolveSafeRedirectPath } from "@/lib/admin-access";
import { APP_SLOGAN } from "@/lib/constants";
import { CitizenPage } from "@/components/layout/citizen-page";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { SupabaseConfigHint } from "@/components/auth/supabase-config-hint";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/types";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    authError === "auth"
      ? "Authentication failed. Please try again."
      : authError === "confirm"
        ? "Email confirmation failed or the link expired. Try signing in or register again."
        : null
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
        const msg = signInError.message;
        if (msg.toLowerCase().includes("invalid api key")) {
          setError(
            "Invalid API key — check NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (full key from Supabase Dashboard, no line breaks)."
          );
          return;
        }
        setError(msg);
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("role, email, department_id, departments:department_id (code)")
        .eq("id", data.user.id)
        .maybeSingle();

      const deptRow = profile?.departments as { code?: string } | { code?: string }[] | null;
      const departmentCode = Array.isArray(deptRow) ? deptRow[0]?.code : deptRow?.code;

      const role = (profile?.role as UserRole) ?? "citizen";
      const session = {
        role,
        email: profile?.email ?? data.user.email ?? email.trim(),
        departmentCode: departmentCode ?? null,
      };

      const rawNext = searchParams.get("redirect");
      const nextPath = resolveSafeRedirectPath(rawNext, session);
      router.push(nextPath ?? resolvePostLoginPath(session));
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <p className="text-sm text-slate-400">
          One secure login for citizens and provincial offices. Use the email and password assigned to
          your account — you will be routed to your dashboard automatically.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <SupabaseConfigHint />
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
              placeholder="office@zamboangasibugay.gov.ph"
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
      subtitle={APP_SLOGAN}
      maxWidth="md"
    >
      <Suspense fallback={<Card><CardContent className="py-8 text-center text-slate-400">Loading…</CardContent></Card>}>
        <LoginForm />
      </Suspense>
    </CitizenPage>
  );
}
