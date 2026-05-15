"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getAuthRedirectPath } from "@/lib/auth";
import { SIGNUP_ROLES } from "@/lib/constants";
import { CitizenPage } from "@/components/layout/citizen-page";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { MunicipalityBarangayFields } from "@/components/forms/municipality-barangay-fields";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [barangay, setBarangay] = useState("");
  const [purokOrStreet, setPurokOrStreet] = useState("");
  const [role, setRole] = useState<UserRole>("citizen");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            municipality: municipality.trim(),
            barangay: barangay.trim(),
            purok_or_street: purokOrStreet.trim(),
            role,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        await supabase
          .from("users")
          .update({
            role,
            phone: phone.trim(),
            municipality: municipality.trim(),
            barangay: barangay.trim(),
            purok_or_street: purokOrStreet.trim(),
          })
          .eq("id", data.user.id);
      }

      router.push(getAuthRedirectPath(role));
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CitizenPage
      title="Create Account"
      subtitle="Zamboanga Sibugay Smart Provincial Governance Platform"
      maxWidth="lg"
    >
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <GoogleSignInButton mode="signup" role={role} />

          <div className="relative text-center text-xs text-slate-500">
            <div className="absolute inset-x-0 top-1/2 border-t border-slate-700" />
            <span className="relative px-3">or register with email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="role">Account Role</Label>
              <Select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                required
              >
                {SIGNUP_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-slate-500">
                {SIGNUP_ROLES.find((r) => r.value === role)?.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
                  placeholder="09XXXXXXXXX"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <p className="text-xs text-slate-500">Minimum 8 characters.</p>
              </div>

              <MunicipalityBarangayFields
                municipality={municipality}
                barangay={barangay}
                purokOrStreet={purokOrStreet}
                onMunicipalityChange={setMunicipality}
                onBarangayChange={setBarangay}
                onPurokOrStreetChange={setPurokOrStreet}
                municipalityId="reg-municipality"
                barangayId="reg-barangay"
                purokId="reg-purok"
              />
            </div>

            <Button type="submit" variant="gov" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-cyan-400 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </CitizenPage>
  );
}
