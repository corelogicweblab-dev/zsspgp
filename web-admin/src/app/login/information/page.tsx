"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { CitizenPage } from "@/components/layout/citizen-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOGO_PATH } from "@/lib/constants";

function InformationLoginForm() {
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

      const allowed = ["information_office", "governor_super_admin", "ict_admin"];
      if (!profile?.role || !allowed.includes(profile.role)) {
        setError("This portal is for Provincial Information Office accounts only.");
        await supabase.auth.signOut();
        return;
      }

      router.push("/admin/news");
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Image src={LOGO_PATH} alt="Logo" width={64} height={64} className="logo-glow mb-2 rounded-full" />
        <CardTitle>Information Office Login</CardTitle>
        <p className="text-sm text-slate-400">
          Provincial Information Office — news and public information management
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <GoogleSignInButton mode="login" label="Sign in with Google (Gmail)" />

        <div className="relative text-center text-xs text-slate-500">
          <div className="absolute inset-x-0 top-1/2 border-t border-slate-700" />
          <span className="relative px-3">or email login</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Official Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
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
          <Link href="/login" className="text-cyan-400 hover:underline">
            General login
          </Link>
          {" · "}
          <Link href="/register" className="text-cyan-400 hover:underline">
            Register as Information Office
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function InformationLoginPage() {
  return (
    <CitizenPage
      title="Information Office"
      subtitle="Official news publishing portal"
      maxWidth="md"
    >
      <Suspense
        fallback={
          <Card>
            <CardContent className="py-8 text-center text-slate-400">Loading…</CardContent>
          </Card>
        }
      >
        <InformationLoginForm />
      </Suspense>
    </CitizenPage>
  );
}
