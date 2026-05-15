"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ROLE_LABELS } from "@/lib/constants";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { UserProfile, UserRole } from "@/types";

const MOCK_USERS: UserProfile[] = [
  {
    id: "u1",
    email: "citizen@email.com",
    full_name: "Juan Dela Cruz",
    role: "citizen",
    department_id: null,
    phone: "09171234567",
    municipality: "Ipil",
    barangay: "Poblacion",
    avatar_url: null,
    is_active: true,
    created_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "u2",
    email: "drrm@zsspgp.gov.ph",
    full_name: "Maria Santos",
    role: "department_admin",
    department_id: "dept-drrm",
    phone: "09181234567",
    municipality: null,
    barangay: null,
    avatar_url: null,
    is_active: true,
    created_at: "2026-02-01T00:00:00Z",
  },
  {
    id: "u3",
    email: "admin@zsspgp.gov.ph",
    full_name: "Gov. Admin",
    role: "governor_super_admin",
    department_id: null,
    phone: null,
    municipality: null,
    barangay: null,
    avatar_url: null,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "u4",
    email: "ict@zsspgp.gov.ph",
    full_name: "Pedro Reyes",
    role: "ict_admin",
    department_id: "dept-ict",
    phone: "09191234567",
    municipality: null,
    barangay: null,
    avatar_url: null,
    is_active: true,
    created_at: "2026-03-10T00:00:00Z",
  },
  {
    id: "u5",
    email: "staff.health@zsspgp.gov.ph",
    full_name: "Ana Lopez",
    role: "staff",
    department_id: "dept-health",
    phone: null,
    municipality: null,
    barangay: null,
    avatar_url: null,
    is_active: false,
    created_at: "2026-04-05T00:00:00Z",
  },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");

  const filtered = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.municipality?.toLowerCase().includes(q) ?? false);
      return matchesRole && matchesSearch;
    });
  }, [search, roleFilter]);

  return (
    <AdminShell title="User Management" subtitle="Manage citizen and provincial staff accounts">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Search name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
              className="w-52"
            >
              <option value="all">All roles</option>
              {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </Select>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Municipality</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium">{u.full_name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === "citizen" ? "secondary" : "default"}>
                        {ROLE_LABELS[u.role]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.municipality ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.is_active ? "success" : "outline"}>
                        {u.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="py-12 text-center text-sm text-slate-500">No users match your filters.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
